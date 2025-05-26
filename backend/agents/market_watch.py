import yfinance as yf

class MarketWatchAgent:
    def __init__(self, symbols):
        self.symbols = symbols

    def fetch_data(self, period="1mo", interval="1d"):
        data = {}
        for symbol in self.symbols:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period, interval=interval)
            data[symbol] = hist
        return data