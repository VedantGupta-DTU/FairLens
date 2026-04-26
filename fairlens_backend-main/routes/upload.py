"""
Upload Route — CSV/JSON file upload and parsing
"""

import uuid
import io
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd

router = APIRouter()

# In-memory session store (for demo/hackathon — replace with DB for production)
sessions: dict = {}


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a CSV or JSON file for bias analysis."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Validate file type
    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ("csv", "json", "xlsx"):
        raise HTTPException(status_code=400, detail=f"Unsupported file type: .{ext}. Use CSV, JSON, or XLSX.")

    # Read file content
    content = await file.read()

    try:
        if ext == "csv":
            df = pd.read_csv(io.BytesIO(content))
        elif ext == "json":
            df = pd.read_json(io.BytesIO(content))
        elif ext == "xlsx":
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Unsupported format")
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse file: {str(e)}")

    # Generate session ID
    session_id = str(uuid.uuid4())

    # Store in memory
    sessions[session_id] = {
        "df": df,
        "filename": file.filename,
        "row_count": len(df),
        "column_count": len(df.columns),
        "columns": list(df.columns),
    }

    # Return metadata + sample
    sample = df.head(5).fillna("").to_dict(orient="records")
    column_types = {col: str(dtype) for col, dtype in df.dtypes.items()}

    return {
        "session_id": session_id,
        "filename": file.filename,
        "row_count": len(df),
        "column_count": len(df.columns),
        "columns": list(df.columns),
        "column_types": column_types,
        "sample_data": sample,
    }
