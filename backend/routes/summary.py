# backend/routes/summary.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict
from backend.agents.summary_agent import AISummaryAgent

router = APIRouter()

class SummaryRequest(BaseModel):
    analysis_result: Dict

@router.post("/summary")
async def get_portfolio_summary(payload: SummaryRequest):
    try:
        agent = AISummaryAgent(payload.analysis_result)
        summary = agent.generate_summary()
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
