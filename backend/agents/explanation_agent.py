class ExplanationAgent:
    def __init__(self, risk_summary):
        """
        risk_summary: dict of {symbol: {sharpe_ratio, volatility, max_drawdown}}
        """
        self.risk_summary = risk_summary

    def generate(self):
        explanations = {}
        for symbol, metrics in self.risk_summary.items():
            sharpe = metrics.get("sharpe_ratio", 0)
            vol = metrics.get("volatility", 0)
            drawdown = metrics.get("max_drawdown", 0)

            parts = []

            if sharpe >= 1:
                parts.append(f"{symbol} has a strong risk-adjusted return (Sharpe {sharpe}).")
            elif sharpe > 0:
                parts.append(f"{symbol} has moderate returns for the level of risk (Sharpe {sharpe}).")
            else:
                parts.append(f"{symbol} is underperforming with a negative Sharpe ratio ({sharpe}).")

            if drawdown < -0.1:
                parts.append(f"It experienced a significant drop of {round(drawdown * 100, 2)}%, indicating some volatility.")
            elif drawdown < -0.05:
                parts.append(f"Its drawdown of {round(drawdown * 100, 2)}% suggests moderate risk.")
            else:
                parts.append("Drawdown levels are mild, suggesting lower risk.")

            explanations[symbol] = " ".join(parts)

        return explanations
