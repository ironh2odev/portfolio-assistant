# backend/routes/news.py

from fastapi import APIRouter, Query
import os
from backend.agents.rag_news_agent import RAGNewsAgent

router = APIRouter()

# Path to mock news folder
NEWS_DIR = os.path.join("backend", "mock_news")

@router.get("/news-insights")
def get_news_insights(symbols: str = Query(..., description="Comma-separated stock symbols")):
    """
    Returns mock news summaries from .txt files for each symbol.
    """
    symbol_list = [sym.strip().upper() for sym in symbols.split(",")]
    insights = {}

    for symbol in symbol_list:
        file_path = os.path.join(NEWS_DIR, f"{symbol}.txt")
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                insights[symbol] = f.read().splitlines()
        else:
            insights[symbol] = ["No recent news insights found for this asset."]

    return insights

@router.get("/rag-news-insights")
def get_rag_news_insights(symbols: str = Query(..., description="Comma-separated stock symbols")):
    """
    Returns LLM-generated RAG-style news summaries.
    """
    symbol_list = [sym.strip().upper() for sym in symbols.split(",")]
    agent = RAGNewsAgent(symbol_list)
    return agent.summarize_news()
