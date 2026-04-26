"""
Analyze Route — Run fairness analysis on uploaded dataset
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from routes.upload import sessions
from engine.fairness import FairnessEngine
from services.grok import detect_attributes, explain_findings

router = APIRouter()

# Store reports for later retrieval
reports: dict = {}


class AnalyzeRequest(BaseModel):
    session_id: str
    description: str = ""


@router.post("/analyze")
async def analyze(req: AnalyzeRequest):
    """Run full fairness analysis on an uploaded dataset."""
    session = sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found. Upload a file first.")

    df = session["df"]
    columns = session["columns"]
    sample = df.head(5).fillna("").to_dict(orient="records")

    # Step 1: Use Grok to detect protected attributes & outcome column
    try:
        detection = await detect_attributes(columns, sample)
    except Exception as e:
        # Fallback: heuristic detection
        detection = _fallback_detection(columns, df)

    protected_cols = detection.get("protected_attributes", [])
    outcome_col = detection.get("outcome_column", "")
    privileged_groups = detection.get("privileged_groups", {})

    if not outcome_col or outcome_col not in df.columns:
        # Try to find a likely outcome column
        outcome_col = _guess_outcome_column(df)
        if not outcome_col:
            raise HTTPException(
                status_code=422,
                detail="Could not identify the outcome/decision column. Please ensure your dataset has a binary outcome column (e.g., approved/rejected).",
            )

    # Filter to valid columns
    protected_cols = [c for c in protected_cols if c in df.columns]
    if not protected_cols:
        raise HTTPException(
            status_code=422,
            detail="No protected attributes found in the dataset. Ensure columns like gender, caste, religion, location exist.",
        )

    # Step 2: Run fairness engine
    engine = FairnessEngine(
        df=df.copy(),
        outcome_col=outcome_col,
        protected_cols=protected_cols,
        privileged_groups=privileged_groups,
    )
    audit_results = engine.run_full_audit()

    # Step 3: Get AI explanation
    dataset_info = {
        "filename": session["filename"],
        "row_count": session["row_count"],
        "column_count": session["column_count"],
        "description": req.description,
    }

    try:
        ai_explanation = await explain_findings(audit_results["findings"], dataset_info)
    except Exception:
        ai_explanation = "AI explanation unavailable. Please check your Grok API key."

    # Build report
    report = {
        "session_id": req.session_id,
        "filename": session["filename"],
        "row_count": session["row_count"],
        "column_count": session["column_count"],
        "protected_attributes": protected_cols,
        "outcome_column": outcome_col,
        "privileged_groups": privileged_groups,
        "detection_description": detection.get("description", ""),
        "score": audit_results["score"],
        "findings": audit_results["findings"],
        "detailed_tests": audit_results["detailed_tests"],
        "total_tests": audit_results["total_tests"],
        "critical_count": audit_results["critical_count"],
        "warning_count": audit_results["warning_count"],
        "pass_count": audit_results["pass_count"],
        "ai_explanation": ai_explanation,
    }

    # Store report
    reports[req.session_id] = report

    return report


@router.get("/report/{session_id}")
async def get_report(session_id: str):
    """Retrieve a saved report."""
    report = reports.get(session_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    return report


def _fallback_detection(columns: list[str], df) -> dict:
    """Heuristic fallback when Grok API is unavailable."""
    protected_keywords = {
        "gender": ["gender", "sex", "ling", "male", "female"],
        "caste": ["caste", "category", "jati", "varg", "sc", "st", "obc", "general"],
        "religion": ["religion", "dharm", "faith"],
        "location": ["location", "region", "state", "district", "urban", "rural", "tehsil", "city"],
        "age": ["age", "umar", "age_group"],
        "income": ["income", "salary", "aay", "earning", "income_level"],
    }

    found_protected = []
    for col in columns:
        col_lower = col.lower().strip()
        for category, keywords in protected_keywords.items():
            if any(kw in col_lower for kw in keywords):
                found_protected.append(col)
                break

    # Guess outcome
    outcome_keywords = [
        "approved", "status", "result", "outcome", "decision", "selected",
        "accepted", "rejected", "label", "target", "loan_status",
    ]
    outcome = ""
    for col in columns:
        if any(kw in col.lower() for kw in outcome_keywords):
            outcome = col
            break

    return {
        "protected_attributes": found_protected,
        "outcome_column": outcome,
        "privileged_groups": {},
        "description": "Detected via heuristic fallback (Grok API unavailable)",
    }


def _guess_outcome_column(df) -> str:
    """Try to find a binary outcome column."""
    for col in df.columns:
        if df[col].nunique() == 2:
            col_lower = col.lower()
            outcome_hints = ["approved", "status", "result", "outcome", "decision", "selected", "label", "target"]
            if any(h in col_lower for h in outcome_hints):
                return col
    # Just pick the first binary column
    for col in df.columns:
        if df[col].nunique() == 2:
            return col
    return ""
