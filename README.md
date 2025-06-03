# 🚀 Financial Portfolio Assistant

A production-grade, AI-powered financial dashboard that analyzes your stock portfolio, explains risk, suggests rebalances, and offers actionable insights — built for **real-world deployment** and **freelance work with financial clients**.

---

## ✨ What's New in V1 (`nextjs-v1`)

I've upgraded from a Streamlit MVP to a **scalable, modern full-stack web app**:

- ✅ **Frontend**: Next.js + Tailwind CSS (beautiful, responsive, interactive)
- ✅ **Backend**: FastAPI + Modular AI Agents (clean architecture)
- ✅ **Chart Visuals**: Live allocation and risk visualizations using Chart.js
- ✅ **PDF Export**: Downloadable AI-generated portfolio reports
- ✅ **AI Summary Agent**: GPT-powered insights about your entire portfolio

---

## 📜 Evolution: From MVP to V1

| Version       | Tech Stack           | Purpose                   |
|---------------|----------------------|----------------------------|
| `main`        | Streamlit + FastAPI  | Rapid MVP (Proof of Concept) |
| `nextjs-v1`   | Next.js + FastAPI    | Scalable V1 (Production Ready) |

---

## 🧠 Features

- 📈 Real-Time Market Data (via `yfinance`)
- 📊 Risk Analysis: Sharpe, Volatility, Max Drawdown
- 🧠 AI-Powered Natural Language Summaries
- 🔄 Rebalance Recommendations
- 📂 CSV Portfolio Upload
- 📉 Live Charts for Allocation and Risk
- 📄 Downloadable Summary PDF (via `html2pdf.js`)
- 🧠 GPT-4 Summary Agent (Phase 3+)

---

## ⚙️ Tech Stack

**Frontend**:  
- `Next.js` + `TypeScript`  
- `Tailwind CSS`  
- `Chart.js`  
- `html2pdf.js`  
- `react-hot-toast`  

**Backend**:  
- `FastAPI`  
- `yfinance`, `pandas`  
- Modular AI Agents (`market_watch`, `risk_analyzer`, `rebalance_agent`, `summary_agent`)

---

## 🚀 Getting Started

```bash
# 1. Clone the Repo
git clone https://github.com/ironh2odev/portfolio-assistant.git
cd portfolio-assistant

# 2. Set Up Python Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload

# 3. Set Up Next.js Frontend
cd frontend
npm install
npm run dev
