# 📊 Financial Portfolio Assistant

A lightweight AI-powered MVP that analyzes your stock portfolio, evaluates risks, and gives simple rebalance suggestions—all in one click.

## Features

- **Stock Analysis**: Pulls recent price data using `yfinance`
- **Risk Metrics**: Calculates Sharpe Ratio, Volatility, and Max Drawdown
- **Natural-Language Explanations**: Understand what the numbers actually mean
- **Rebalancing Tips**: Suggests tweaks based on portfolio drift and risk profile
- **CSV Upload**: Supports portfolio uploads via CSV (`Symbol, Allocation`)

---

## Tech Stack

- **Frontend**: [Streamlit](https://streamlit.io/)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/)
- **Data Source**: [Yahoo Finance](https://finance.yahoo.com/) via `yfinance`
- **Python Libraries**: `pandas`, `requests`, `uvicorn`, `yfinance`, `streamlit`

---

## Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/ironh2odev/portfolio-assistant.git
cd portfolio-assistant

### 2. Set Up Environment

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

### 3. Run the App
Start Backend (FastAPI):
uvicorn backend.main:app --reload

Start Frontend (Streamlit)
streamlit run frontend/app.py
