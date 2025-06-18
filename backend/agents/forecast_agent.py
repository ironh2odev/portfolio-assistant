# backend/agents/forecast_agent.py

import pandas as pd
from prophet import Prophet
from pathlib import Path
from typing import Dict

class ForecastAgent:
    def __init__(self, symbol: str, data_dir: str = "backend/data/forecast"):
        self.symbol = symbol.upper()
        self.data_path = Path(data_dir) / f"{self.symbol.lower()}_sample_prices.csv"
        self.model = Prophet()

    def load_and_prepare_data(self) -> pd.DataFrame:
        df = pd.read_csv(self.data_path)
        df = df.rename(columns={"Date": "ds", "Close": "y"})
        df["ds"] = pd.to_datetime(df["ds"])
        return df[["ds", "y"]]

    def train_model(self, df: pd.DataFrame):
        self.model.fit(df)

    def make_forecast(self, days: int = 30) -> Dict[str, float]:
        future = self.model.make_future_dataframe(periods=days)
        forecast = self.model.predict(future)
        forecast_tail = forecast.tail(days)[["ds", "yhat"]]
        return {
            row["ds"].strftime("%Y-%m-%d"): round(row["yhat"], 2)
            for _, row in forecast_tail.iterrows()
        }

    def predict(self, days: int = 30) -> pd.DataFrame:
        df = self.load_and_prepare_data()
        self.train_model(df)
        future = self.model.make_future_dataframe(periods=days)
        forecast = self.model.predict(future)
        return forecast.tail(days)[["ds", "yhat"]]