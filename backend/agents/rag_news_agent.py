# backend/agents/rag_news_agent.py

import os
import requests
from typing import List, Dict
from datetime import datetime, timedelta
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class RAGNewsAgent:
    def __init__(self, symbols: List[str], finnhub_api_key: str = None):
        self.symbols = symbols
        self.finnhub_api_key = finnhub_api_key or os.getenv("FINNHUB_API_KEY")

    def fetch_live_articles(self, symbol: str) -> List[str]:
        """
        Fetches recent headlines for the given symbol from Finnhub (last 7 days).
        """
        to_date = datetime.utcnow().date()
        from_date = to_date - timedelta(days=7)

        url = (
            f"https://finnhub.io/api/v1/company-news"
            f"?symbol={symbol.upper()}"
            f"&from={from_date}"
            f"&to={to_date}"
            f"&token={self.finnhub_api_key}"
        )

        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            headlines = [item["headline"] for item in data if "headline" in item]
            return headlines[:5] if headlines else [f"⚠️ No recent headlines found for {symbol}."]
        except Exception as e:
            return [f"⚠️ Error fetching live news for {symbol}: {str(e)}"]

    def summarize_news(self) -> Dict[str, str]:
        """
        Uses GPT to summarize the headlines for each stock symbol.
        """
        summaries = {}

        for symbol in self.symbols:
            articles = self.fetch_live_articles(symbol)

            # Early exit if there's a warning or error
            if any(a.startswith("⚠️") for a in articles):
                summaries[symbol] = "\n".join(articles)
                continue

            prompt = (
                f"Summarize these financial news headlines for {symbol}:\n\n" +
                "\n".join(articles)
            )

            try:
                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a financial analyst."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=250,
                    temperature=0.6,
                )
                summaries[symbol] = response.choices[0].message.content.strip()

            except Exception as e:
                summaries[symbol] = f"⚠️ Error summarizing news for {symbol}: {str(e)}"

        return summaries
