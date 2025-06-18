# 🚀 AI-Powered Financial Portfolio Assistant (v1.0)

A **production-ready, AI-driven portfolio dashboard** that analyzes your stock allocations, explains risk, suggests rebalances, forecasts future prices, and summarizes real-time financial news — built for real-world usage and client-facing demos.

---

## ✨ What's New in Version 1.0 (`nextjs-v1`)

We've upgraded from a Streamlit MVP to a scalable, full-stack architecture:

| 🔧 Feature                      | ✅ Status |
|--------------------------------|----------|
| 🎨 Frontend                    | Next.js + Tailwind CSS |
| ⚙️ Backend                     | FastAPI + Modular AI Agents |
| 📊 Portfolio Charts            | Allocation + Risk (Chart.js) |
| 📄 Export Reports              | Downloadable PDFs (html2pdf.js) |
| 🧠 GPT-4 Summary Agent         | Smart insights from your portfolio |
| 💡 Live Forecasting            | AI price prediction (Prophet) |
| 🧠 Market Sentiment            | GPT-powered emotional analysis |
| 📰 Real Financial News (RAG)   | Live headlines + GPT summaries (Finnhub + GPT-4) |

---

## 📜 Project Evolution

| Version     | Tech Stack               | Purpose                          |
|-------------|--------------------------|----------------------------------|
| `main`      | Streamlit + FastAPI      | Rapid MVP / Proof of Concept     |
| `nextjs-v1` | Next.js + FastAPI        | Production-Ready Full-Stack App  |

---

## 🧠 Core Features

- ✅ **Real-Time Market Data** from `yfinance`
- 📊 **Risk Analysis**: Sharpe, Volatility, Max Drawdown
- 🧠 **GPT Summary Agent**: Explains what your portfolio is doing
- 🔄 **Rebalance Suggestions**: Smarter asset distribution
- 📉 **Chart Visualizations**: Interactive Chart.js views
- 📂 **CSV Upload Support**: Auto-parse user portfolios
- 🧠 **Market Sentiment Agent**: Emotion-aware feedback
- 📈 **Forecast Agent**: AI time-series predictions (Prophet)
- 📰 **RAG News Agent**: Live news via Finnhub + GPT-4 summaries
- 📄 **PDF Report Download**: Instantly export client-ready insights

---

## ⚙️ Tech Stack

### 💻 Frontend
- `Next.js` + `TypeScript`
- `Tailwind CSS`
- `Chart.js`
- `react-hot-toast`
- `html2pdf.js`

### 🧠 Backend
- `FastAPI`
- `pandas`, `yfinance`, `Prophet`
- Modular AI Agents:
  - `market_watch_agent`
  - `risk_analyzer_agent`
  - `rebalance_agent`
  - `summary_agent`
  - `forecast_agent`
  - `sentiment_agent`
  - `rag_news_agent`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ironh2odev/portfolio-assistant.git
cd portfolio-assistant

### 2. Set Up Python Backend (FastAPI)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload

### 3. Set Up Frontend (Next.js)
cd frontend
npm install
npm run dev
