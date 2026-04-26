"""
Chat Route — Conversational bias explorer with Grok AI
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from routes.analyze import reports
from services.grok import chat_about_bias

router = APIRouter()

# Store chat histories per session
chat_histories: dict[str, list[dict]] = {}


class ChatRequest(BaseModel):
    session_id: str
    message: str


@router.post("/chat")
async def chat(req: ChatRequest):
    """Chat with Grok about bias findings."""
    report = reports.get(req.session_id)
    if not report:
        raise HTTPException(
            status_code=404,
            detail="No report found for this session. Run analysis first.",
        )

    # Get or create chat history
    if req.session_id not in chat_histories:
        chat_histories[req.session_id] = []

    history = chat_histories[req.session_id]

    # Build report context for Grok
    report_context = {
        "filename": report["filename"],
        "row_count": report["row_count"],
        "score": report["score"],
        "findings": report["findings"],
        "ai_explanation": report.get("ai_explanation", ""),
        "protected_attributes": report["protected_attributes"],
        "outcome_column": report["outcome_column"],
    }

    try:
        ai_response = await chat_about_bias(
            user_message=req.message,
            report_context=report_context,
            chat_history=history,
        )
    except Exception as e:
        ai_response = f"Sorry, I couldn't process your request. Error: {str(e)}"

    # Update history
    history.append({"role": "user", "content": req.message})
    history.append({"role": "assistant", "content": ai_response})

    return {
        "response": ai_response,
        "session_id": req.session_id,
    }
