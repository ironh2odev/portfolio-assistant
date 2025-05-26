class RebalanceRecommender:
    def __init__(self, portfolio_allocations, risk_summary, target_allocation=None):
        """
        portfolio_allocations: dict of {symbol: current allocation in %}
        risk_summary: dict of {symbol: {sharpe_ratio, volatility, max_drawdown}}
        target_allocation: dict of {symbol: ideal allocation in %} (optional)
        """
        self.allocations = portfolio_allocations
        self.risk = risk_summary
        self.target = target_allocation or self._even_allocation()

    def _even_allocation(self):
        # If no target given, assume equal weights
        count = len(self.allocations)
        return {symbol: round(100 / count, 2) for symbol in self.allocations}

    def suggest(self):
        suggestions = {}
        for symbol, current_pct in self.allocations.items():
            target_pct = self.target.get(symbol, 0)
            risk_data = self.risk.get(symbol, {})
            drawdown = risk_data.get("max_drawdown", 0)
            volatility = risk_data.get("volatility", 0)

            drift = round(current_pct - target_pct, 2)

            if abs(drift) < 5:
                continue  # No rebalance needed if within 5%

            if drift > 0:
                if drawdown < -0.1 or volatility > 0.03:
                    suggestions[symbol] = f"Reduce {symbol} by {abs(drift)}% due to high risk and overweight."
                else:
                    suggestions[symbol] = f"Consider trimming {symbol} by {abs(drift)}% to align with target."
            else:
                if drawdown > -0.05 and volatility < 0.02:
                    suggestions[symbol] = f"Increase {symbol} by {abs(drift)}% due to low risk and underweight."
                else:
                    suggestions[symbol] = f"Consider adding to {symbol} by {abs(drift)}% if risk is acceptable."

        return suggestions