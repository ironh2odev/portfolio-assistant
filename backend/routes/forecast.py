# backend/routes/forecast.py

from fastapi import APIRouter, Query
from typing import Dict
from backend.agents.forecast_agent import ForecastAgent

router = APIRouter()

@router.get("/forecast")
async def get_forecast(symbol: str = Query(...)) -> Dict[str, list]:
    try:
        agent = ForecastAgent(symbol)
        result = agent.run_forecast()
        return result
    except Exception as e:
        return {"error": str(e)}
