import numpy as np
import pandas as pd

class RiskAnalyzerAgent:
    def __init__(self, portfolio_data):
        """
        portfolio_data: dict of {symbol: pd.DataFrame} where each DataFrame has 'Close' prices
        """
        self.portfolio_data = portfolio_data

    def calculate_sharpe_ratio(self, returns, risk_free_rate=0.01):
        excess_returns = returns - risk_free_rate / 252
        return np.mean(excess_returns) / np.std(excess_returns) if np.std(excess_returns) != 0 else 0

    def calculate_max_drawdown(self, prices):
        cumulative_max = prices.cummax()
        drawdown = (prices - cumulative_max) / cumulative_max
        return drawdown.min()

    def analyze(self):
        analysis = {}
        for symbol, df in self.portfolio_data.items():
            if 'Close' not in df.columns or df['Close'].isnull().all():
                continue
            df = df.dropna()
            returns = df['Close'].pct_change().dropna()
            sharpe = self.calculate_sharpe_ratio(returns)
            drawdown = self.calculate_max_drawdown(df['Close'])
            volatility = returns.std()

            analysis[symbol] = {
                "sharpe_ratio": round(sharpe, 3),
                "volatility": round(volatility, 3),
                "max_drawdown": round(drawdown, 3)
            }
        return analysis