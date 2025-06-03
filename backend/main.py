from fastapi import FastAPI, Request
from typing import Optional
import ast
import os

from fastapi.middleware.cors import CORSMiddleware

# === Import core agents ===
from backend.agents.market_watch import MarketWatchAgent
from backend.agents.risk_analyzer import RiskAnalyzerAgent
from backend.agents.explanation_agent import ExplanationAgent
from backend.agents.rebalance_agent import RebalanceRecommender

# ✅ Import summary route
from backend.routes import summary

app = FastAPI()

# === CORS for Next.js frontend ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Core market endpoint ===
@app.get("/market")
def get_market_data(symbols: str = "AAPL,GOOG", allocations: Optional[str] = None):
    symbol_list = symbols.split(",")

    # Default to even split if no allocation provided
    try:
        current_allocations = ast.literal_eval(allocations) if allocations else {
            symbol: round(100 / len(symbol_list), 2) for symbol in symbol_list
        }
    except (ValueError, SyntaxError):
        current_allocations = {symbol: round(100 / len(symbol_list), 2) for symbol in symbol_list}

    # === Normalize allocation to decimal (0–1) ===
    normalized_allocations = {
        symbol: (current_allocations.get(symbol, 0) / 100) for symbol in symbol_list
    }

    # === Agent Pipeline ===
    market_agent = MarketWatchAgent(symbol_list)
    market_data = market_agent.fetch_data()

    risk_agent = RiskAnalyzerAgent(market_data)
    risk_summary = risk_agent.analyze()

    explain_agent = ExplanationAgent(risk_summary)
    explanations = explain_agent.generate()

    rebalance_agent = RebalanceRecommender(current_allocations, risk_summary)
    rebalance_suggestions = rebalance_agent.suggest()

    # === Combined Output ===
    response = {}
    for symbol in symbol_list:
        response[symbol] = {
            "prices": market_data[symbol].tail(5).to_dict(),
            "risk": risk_summary.get(symbol, {}),
            "explanation": explanations.get(symbol, "No insight available."),
            "rebalance_suggestion": rebalance_suggestions.get(symbol, "No change needed."),
            "allocation": normalized_allocations.get(symbol, 0)  # ✅ This line is key
        }

    return response

# === Register Summary Agent endpoint ===
app.include_router(summary.router)
