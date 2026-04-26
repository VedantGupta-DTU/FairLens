"""
Grok API Client — xAI's Grok model for AI-powered analysis
"""

import os
import httpx
from typing import Optional


GROK_API_URL = "https://api.x.ai/v1/chat/completions"
GROK_MODEL = "grok-3-mini-fast"


def _get_api_key() -> str:
    key = os.getenv("GROK_API_KEY", "")
    if not key or key == "your_grok_api_key_here":
        raise ValueError("GROK_API_KEY not set. Add it to backend/.env")
    return key


async def chat_completion(
    messages: list[dict],
    temperature: float = 0.7,
    max_tokens: int = 2048,
) -> str:
    """Send messages to Grok and get a completion."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            GROK_API_URL,
            headers={
                "Authorization": f"Bearer {_get_api_key()}",
                "Content-Type": "application/json",
            },
            json={
                "model": GROK_MODEL,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def detect_attributes(columns: list[str], sample_rows: list[dict]) -> dict:
    """Use Grok to identify protected attributes and outcome column."""
    prompt = f"""You are an AI fairness expert analyzing an Indian dataset.

Given these column names and sample data, identify:
1. **protected_attributes**: columns representing gender, caste, religion, income level, geographic location, disability status, age, language
2. **outcome_column**: the column representing the binary decision/outcome (e.g., approved/rejected, selected/not-selected)
3. **privileged_groups**: for each protected attribute, which value is the "privileged" majority group

Consider Indian-specific terms:
- Caste: General, OBC, SC, ST, jati, varg
- Gender: Male, Female, Other/Third Gender, ling, gender
- Religion: Hindu, Muslim, Christian, Sikh, dharm
- Region: State, District, Urban/Rural, tehsil, location
- Income: income, salary, aay, earning

Column names: {columns}
Sample data (first 5 rows): {sample_rows[:5]}

Respond in STRICT JSON format only:
{{
  "protected_attributes": ["col1", "col2"],
  "outcome_column": "col_name",
  "privileged_groups": {{"col1": "value1", "col2": "value2"}},
  "description": "Brief description of what this dataset represents"
}}"""

    response = await chat_completion(
        messages=[
            {"role": "system", "content": "You are a data analysis expert. Respond only in valid JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )

    # Parse JSON from response (handle markdown code blocks)
    import json
    text = response.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
    return json.loads(text)


async def explain_findings(findings: list[dict], dataset_info: dict) -> str:
    """Generate AI explanation of bias findings."""
    prompt = f"""You are FairLens AI, an expert in algorithmic fairness in Indian context.

Dataset: {dataset_info.get('filename', 'Unknown')}
Records: {dataset_info.get('row_count', '?')}
Columns: {dataset_info.get('column_count', '?')}

Fairness test results:
{findings}

Write a clear, actionable analysis in 3-4 paragraphs:
1. Summary of overall fairness (score interpretation)
2. Most critical finding and its real-world impact on Indian citizens
3. Intersection effects (e.g., SC/ST women face compounded bias)
4. Recommended mitigation strategies with brief technical approach

Use simple language. Reference specific numbers from the results. Be direct about which groups are harmed."""

    return await chat_completion(
        messages=[
            {"role": "system", "content": "You are FairLens AI, a bias auditor for Indian public systems. Be direct, data-driven, and empathetic. Reference specific numbers."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.5,
    )


async def chat_about_bias(
    user_message: str,
    report_context: dict,
    chat_history: list[dict],
) -> str:
    """Chat with user about bias findings. Supports Hindi/English."""
    system_prompt = f"""You are FairLens AI Bias Explorer. You have analyzed a dataset and found these results:

Dataset: {report_context.get('filename', 'Unknown')} ({report_context.get('row_count', '?')} records)
Overall Fairness Score: {report_context.get('score', '?')}/100
Findings: {report_context.get('findings', [])}

Rules:
- Answer in the SAME LANGUAGE the user writes in (Hindi or English)
- Always cite specific numbers from the analysis
- If asked for code, provide Python code snippets
- Be empathetic about impact on marginalized communities
- If asked about a group not in the data, say so clearly
- Keep responses concise but data-rich"""

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(chat_history[-10:])  # last 10 messages for context
    messages.append({"role": "user", "content": user_message})

    return await chat_completion(messages=messages, temperature=0.6)
