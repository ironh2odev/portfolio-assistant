from fastapi import FastAPI, Request
from typing import Optional
import ast

from .agents.market_watch import MarketWatchAgent
from .agents.risk_analyzer import RiskAnalyzerAgent
from .agents.explanation_agent import ExplanationAgent
from .agents.rebalance_agent import RebalanceRecommender

app = FastAPI()

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

    # Fetch data
    market_agent = MarketWatchAgent(symbol_list)
    market_data = market_agent.fetch_data()

    # Analyze risk
    risk_agent = RiskAnalyzerAgent(market_data)
    risk_summary = risk_agent.analyze()

    # Generate insight
    explain_agent = ExplanationAgent(risk_summary)
    explanations = explain_agent.generate()

    # Rebalance suggestions
    rebalance_agent = RebalanceRecommender(current_allocations, risk_summary)
    rebalance_suggestions = rebalance_agent.suggest()

    # Response
    response = {}
    for symbol in symbol_list:
        response[symbol] = {
            "prices": market_data[symbol].tail(5).to_dict(),
            "risk": risk_summary.get(symbol, {}),
            "explanation": explanations.get(symbol, "No insight available."),
            "rebalance_suggestion": rebalance_suggestions.get(symbol, "No change needed.")
        }

    return response
