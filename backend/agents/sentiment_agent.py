# backend/agents/sentiment_agent.py

from typing import List, Dict
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

class SentimentAnalyzerAgent:
    def __init__(self, symbols: List[str]):
        self.symbols = symbols
        self.index = self._load_index()

    def _load_index(self):
        documents = SimpleDirectoryReader("data/news").load_data()
        return VectorStoreIndex.from_documents(documents)

    def analyze(self) -> Dict[str, Dict]:
        results = {}
        for symbol in self.symbols:
            query = f"Recent sentiment and news about {symbol}"
            response = self.index.as_query_engine().query(query)
            results[symbol] = {
                "summary": response.response,
                "score": self._dummy_sentiment_score(response.response)
            }
        return results

    def _dummy_sentiment_score(self, text: str) -> str:
        if "gain" in text or "growth" in text:
            return "positive"
        elif "loss" in text or "fall" in text:
            return "negative"
        return "neutral"
