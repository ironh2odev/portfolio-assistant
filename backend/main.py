from fastapi import FastAPI, Request
from typing import Optional
import ast

from fastapi.middleware.cors import CORSMiddleware

# === Import core agents ===
from backend.agents.market_watch import MarketWatchAgent
from backend.agents.risk_analyzer import RiskAnalyzerAgent
from backend.agents.explanation_agent import ExplanationAgent
from backend.agents.rebalance_agent import RebalanceRecommender
from backend.agents.sentiment_agent import SentimentAnalyzerAgent
from backend.agents.forecast_agent import ForecastAgent            

# ✅ Import modular route files
from backend.routes import summary
from backend.routes import sentiment
from backend.routes import news
# from backend.routes import forecast  # Uncomment only if forecast.py route exists

app = FastAPI()

# === Enable CORS for Next.js frontend ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Core Portfolio Analysis Endpoint ===
@app.get("/market")
def get_market_data(symbols: str = "AAPL,GOOG", allocations: Optional[str] = None):
    symbol_list = symbols.split(",")

    # Parse or default allocations
    try:
        current_allocations = ast.literal_eval(allocations) if allocations else {
            symbol: round(100 / len(symbol_list), 2) for symbol in symbol_list
        }
    except (ValueError, SyntaxError):
        current_allocations = {symbol: round(100 / len(symbol_list), 2) for symbol in symbol_list}

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
            "allocation": normalized_allocations.get(symbol, 0)
        }

    return response

# === Forecast Endpoint (FIXED) ===
@app.get("/forecast")
def forecast_price(symbol: str = "AAPL"):
    """
    Run offline time series forecasting on sample data (e.g., backend/data/forecast/aapl_sample_prices.csv).
    Returns forecast in format compatible with frontend expectations.
    """
    try:
        agent = ForecastAgent(symbol)
        forecast_df = agent.predict()

        # Format forecast output
        date_list = forecast_df['ds'].dt.strftime('%Y-%m-%d').tolist()
        price_list = forecast_df['yhat'].round(2).tolist()

        return {
            "date": date_list,
            "price": price_list
        }
    except Exception as e:
        return {"error": str(e)}

# === Register modular routes ===
app.include_router(summary.router)
app.include_router(sentiment.router)
app.include_router(news.router)
# app.include_router(forecast.router)  # Optional based on your routes
