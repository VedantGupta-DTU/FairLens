"""
FairLens Fairness Engine — Core statistical bias analysis
Implements 4 fairness tests per the FairLens spec
"""

import pandas as pd
import numpy as np
from typing import Any


class FairnessEngine:
    """Runs statistical fairness tests on a dataset."""

    def __init__(
        self,
        df: pd.DataFrame,
        outcome_col: str,
        protected_cols: list[str],
        privileged_groups: dict[str, str] | None = None,
    ):
        self.df = df
        self.outcome_col = outcome_col
        self.protected_cols = protected_cols
        self.privileged_groups = privileged_groups or {}

        # Ensure outcome is binary (0/1)
        self._binarize_outcome()

    def _binarize_outcome(self):
        """Convert outcome column to binary 0/1 if not already."""
        col = self.df[self.outcome_col]
        if col.dtype == object or col.dtype.name == "category":
            # Map common positive outcomes
            positive_values = {
                "approved", "yes", "1", "true", "accept", "accepted",
                "selected", "pass", "passed", "granted", "haan", "ha",
            }
            self.df[self.outcome_col] = col.str.strip().str.lower().isin(positive_values).astype(int)
        else:
            # Ensure 0/1
            self.df[self.outcome_col] = (col > 0).astype(int)

    def demographic_parity(self, protected_col: str) -> dict[str, Any]:
        """Test 1: Check if positive outcome rate is equal across groups."""
        groups = self.df.groupby(protected_col)[self.outcome_col].mean()
        group_counts = self.df.groupby(protected_col)[self.outcome_col].count()
        max_diff = float(groups.max() - groups.min())

        # Determine severity
        if max_diff < 0.1:
            severity = "pass"
            status = "FAIR"
        elif max_diff < 0.2:
            severity = "warning"
            status = "MODERATE BIAS"
        else:
            severity = "critical"
            status = "BIASED"

        return {
            "test": "Demographic Parity",
            "protected_attribute": protected_col,
            "group_rates": {str(k): round(float(v) * 100, 1) for k, v in groups.items()},
            "group_counts": {str(k): int(v) for k, v in group_counts.items()},
            "max_disparity": round(max_diff * 100, 1),
            "severity": severity,
            "status": status,
        }

    def disparate_impact_ratio(self, protected_col: str) -> dict[str, Any]:
        """Test 2: 80% rule — minority rate / majority rate >= 0.8."""
        groups = self.df.groupby(protected_col)[self.outcome_col].mean()

        # Find privileged group (highest rate or user-specified)
        privileged = self.privileged_groups.get(protected_col)
        if privileged and privileged in groups.index:
            privileged_rate = groups[privileged]
        else:
            privileged = str(groups.idxmax())
            privileged_rate = groups.max()

        if privileged_rate == 0:
            return {
                "test": "Disparate Impact (80% Rule)",
                "protected_attribute": protected_col,
                "ratios": {},
                "min_ratio": 0,
                "severity": "critical",
                "status": "CANNOT COMPUTE",
                "privileged_group": privileged,
            }

        ratios = {}
        for group, rate in groups.items():
            if str(group) != privileged:
                ratios[str(group)] = round(float(rate / privileged_rate), 4)

        min_ratio = min(ratios.values()) if ratios else 1.0

        if min_ratio >= 0.8:
            severity = "pass"
            status = "FAIR"
        elif min_ratio >= 0.6:
            severity = "warning"
            status = "MODERATE BIAS"
        else:
            severity = "critical"
            status = "BIASED"

        return {
            "test": "Disparate Impact (80% Rule)",
            "protected_attribute": protected_col,
            "privileged_group": privileged,
            "privileged_rate": round(float(privileged_rate) * 100, 1),
            "ratios": ratios,
            "min_ratio": round(min_ratio, 4),
            "threshold": 0.80,
            "severity": severity,
            "status": status,
        }

    def equalized_odds_simplified(self, protected_col: str) -> dict[str, Any]:
        """Test 3: Check if selection rates differ significantly between groups
        (simplified version without true labels — uses outcome distribution)."""
        groups = self.df.groupby(protected_col)[self.outcome_col]
        group_stats = {}

        for name, group in groups:
            positive_rate = float(group.mean())
            group_stats[str(name)] = {
                "positive_rate": round(positive_rate * 100, 1),
                "count": int(len(group)),
            }

        rates = [s["positive_rate"] for s in group_stats.values()]
        max_gap = max(rates) - min(rates) if rates else 0

        if max_gap < 10:
            severity = "pass"
        elif max_gap < 20:
            severity = "warning"
        else:
            severity = "critical"

        return {
            "test": "Equalized Odds (Simplified)",
            "protected_attribute": protected_col,
            "group_stats": group_stats,
            "max_rate_gap": round(max_gap, 1),
            "severity": severity,
            "status": "FAIR" if severity == "pass" else "BIASED",
        }

    def group_size_balance(self, protected_col: str) -> dict[str, Any]:
        """Test 4: Check if groups are reasonably balanced in the dataset."""
        counts = self.df[protected_col].value_counts()
        total = int(counts.sum())
        proportions = counts / total

        balance_ratio = float(proportions.min() / proportions.max()) if proportions.max() > 0 else 0

        if balance_ratio >= 0.3:
            severity = "pass"
            note = "Groups are reasonably balanced"
        elif balance_ratio >= 0.1:
            severity = "warning"
            note = "Some groups are underrepresented — may affect test reliability"
        else:
            severity = "critical"
            note = "Severe imbalance — minority group is very small, tests may be skewed"

        return {
            "test": "Group Size Balance",
            "protected_attribute": protected_col,
            "group_sizes": {str(k): int(v) for k, v in counts.items()},
            "group_proportions": {str(k): round(float(v) * 100, 1) for k, v in proportions.items()},
            "balance_ratio": round(balance_ratio, 4),
            "severity": severity,
            "note": note,
        }

    def run_full_audit(self) -> dict[str, Any]:
        """Run all 4 fairness tests for all protected attributes."""
        all_findings = []

        for col in self.protected_cols:
            if col not in self.df.columns:
                continue
            # Skip columns with too many unique values (likely not categorical)
            if self.df[col].nunique() > 20:
                continue

            all_findings.append(self.demographic_parity(col))
            all_findings.append(self.disparate_impact_ratio(col))
            all_findings.append(self.equalized_odds_simplified(col))
            all_findings.append(self.group_size_balance(col))

        # Calculate overall score
        score = self._calculate_score(all_findings)

        # Extract top-level findings summary (one per attribute)
        summary_findings = self._summarize_findings(all_findings)

        return {
            "score": score,
            "findings": summary_findings,
            "detailed_tests": all_findings,
            "total_tests": len(all_findings),
            "critical_count": sum(1 for f in all_findings if f["severity"] == "critical"),
            "warning_count": sum(1 for f in all_findings if f["severity"] == "warning"),
            "pass_count": sum(1 for f in all_findings if f["severity"] == "pass"),
        }

    def _calculate_score(self, findings: list[dict]) -> int:
        """Calculate overall fairness score 0-100."""
        if not findings:
            return 50

        severity_scores = {"pass": 1.0, "warning": 0.5, "critical": 0.0}
        total = sum(severity_scores.get(f["severity"], 0.5) for f in findings)
        raw = total / len(findings)
        return max(0, min(100, int(raw * 100)))

    def _summarize_findings(self, all_findings: list[dict]) -> list[dict]:
        """Create one summary finding per protected attribute."""
        attr_findings: dict[str, list[dict]] = {}

        for f in all_findings:
            attr = f.get("protected_attribute", "unknown")
            if attr not in attr_findings:
                attr_findings[attr] = []
            attr_findings[attr].append(f)

        summaries = []
        for attr, tests in attr_findings.items():
            # Worst severity wins
            severities = [t["severity"] for t in tests]
            if "critical" in severities:
                overall_severity = "critical"
            elif "warning" in severities:
                overall_severity = "warning"
            else:
                overall_severity = "pass"

            # Find the most impactful test result
            dp_test = next((t for t in tests if t["test"] == "Demographic Parity"), None)
            di_test = next((t for t in tests if t["test"] == "Disparate Impact (80% Rule)"), None)

            summary = {
                "attribute": attr,
                "severity": overall_severity,
                "title": f"{'Caste' if 'caste' in attr.lower() else attr.replace('_', ' ').title()} Bias Analysis",
            }

            if dp_test:
                rates = dp_test.get("group_rates", {})
                if rates:
                    max_group = max(rates, key=rates.get)
                    min_group = min(rates, key=rates.get)
                    summary["metric"] = f"{min_group}: {rates[min_group]}% vs {max_group}: {rates[max_group]}%"
                    summary["group1"] = {"name": min_group, "value": rates[min_group]}
                    summary["group2"] = {"name": max_group, "value": rates[max_group]}

            if di_test:
                summary["disparate_impact"] = di_test.get("min_ratio", 0)
                summary["threshold"] = 0.80

            summaries.append(summary)

        return summaries
