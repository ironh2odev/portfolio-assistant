# AI-Powered Portfolio Assistant

A full-stack financial analytics application combining portfolio risk analysis, forecasting, market sentiment, live financial news retrieval, and LLM-generated insights in an interactive dashboard.

Built with **Next.js, TypeScript, FastAPI, Python, Prophet, Chart.js, Finnhub, and OpenAI**.

## Overview

The AI-Powered Portfolio Assistant is a full-stack application designed to transform portfolio data into understandable financial analytics and AI-assisted insights.

Users can provide stock symbols and portfolio allocations, after which the application coordinates several backend analysis components to retrieve market data, calculate risk metrics, generate rebalancing suggestions, produce price forecasts, retrieve financial news, and present the results through an interactive Next.js dashboard.

The project evolved from an earlier Streamlit/FastAPI MVP into a separated Next.js + FastAPI architecture, providing a clearer boundary between the frontend, API layer, financial-analysis logic, and AI integrations.

The application is designed as a software-engineering and applied-AI demonstration rather than a financial-advice or automated trading system.

## Key Features

- Multi-asset portfolio analysis
- Custom portfolio allocation input
- CSV portfolio upload
- Market data retrieval using `yfinance`
- Financial risk analysis
- Natural-language explanations of portfolio analysis
- Portfolio rebalancing suggestions
- Market sentiment insights
- 30-day time-series forecasting using Prophet
- Interactive portfolio and forecast visualizations with Chart.js
- Live company-news retrieval using Finnhub
- LLM-generated summaries of retrieved financial headlines
- Portfolio health summary
- Multiple display currencies
- Forecast export to CSV
- Downloadable portfolio reports
- Browser-based persistence for selected portfolio state
- Modular FastAPI routes and Python analysis components

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Chart.js / react-chartjs-2
- react-hot-toast
- html2pdf.js

### Backend

- Python
- FastAPI
- pandas
- yfinance
- Uvicorn

### AI / ML

- OpenAI API
- Prophet
- LLM-based financial-news summarization
- Modular risk, sentiment, forecasting, explanation, and rebalancing components

### External Data

- Yahoo Finance market data through `yfinance`
- Finnhub company-news API

### Database / Storage

No production database is required by the current V1.

The frontend uses browser `localStorage` for selected state. Local project files are also used for sample forecasting data and earlier experimental resources.

### Infrastructure / Deployment

**Needs confirmation:** no production deployment architecture is established in the documented V1.

### Development Tools

- Git
- GitHub
- npm
- Python virtual environments

## Architecture / How It Works

The project uses a separated frontend/backend architecture.

```text
┌──────────────────────────────┐
│       Next.js Frontend       │
│                              │
│ Portfolio Input / CSV        │
│ Charts & Visualizations      │
│ Insights                     │
│ CSV / PDF Export             │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│        FastAPI Backend       │
│                              │
│ /market                      │
│ /sentiment                   │
│ /forecast                    │
│ /rag-news-insights           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     Analysis Components      │
│                              │
│ MarketWatchAgent             │
│ RiskAnalyzerAgent            │
│ ExplanationAgent             │
│ RebalanceRecommender         │
│ SentimentAnalyzerAgent       │
│ ForecastAgent                │
│ RAGNewsAgent                 │
└──────────┬───────────┬───────┘
           │           │
           ▼           ▼
      Market Data   External APIs
       / Prophet   Finnhub / OpenAI
```

### Portfolio Analysis

The frontend sends the selected stock symbols and optional allocations to the FastAPI `/market` endpoint.

The backend coordinates a sequence of specialized components:

1. `MarketWatchAgent` retrieves market data.
2. `RiskAnalyzerAgent` calculates financial risk information.
3. `ExplanationAgent` converts analysis results into understandable explanations.
4. `RebalanceRecommender` produces portfolio allocation suggestions.
5. FastAPI combines the results into structured JSON.
6. The Next.js frontend renders the response through asset cards, summaries, and charts.

This separates financial domain logic from the API and presentation layers.

### Forecasting

The frontend requests forecasts for individual portfolio symbols through `/forecast`.

`ForecastAgent`:

1. Loads the relevant time-series dataset.
2. Converts the data into Prophet's `ds` and `y` structure.
3. Fits the forecasting model.
4. Generates a 30-day forecast.
5. Returns forecast dates and predicted values through the API.

The frontend combines the returned forecasts and visualizes them using Chart.js.

**Current limitation:** the demonstrated V1 forecasting implementation uses local sample datasets rather than a production historical-market-data pipeline. Forecast output should therefore be treated as a technical demonstration rather than investment guidance.

### Financial News Insights

The application retrieves company-specific financial headlines from Finnhub.

Retrieved headlines are then supplied to an OpenAI model, which generates a concise summary for each portfolio asset.

The important architectural distinction is that the application retrieves external financial information before asking the language model to interpret it rather than relying on the LLM itself as a source of current market information.

### Frontend

The Next.js frontend handles:

- portfolio input
- API requests
- loading and error feedback
- financial visualizations
- forecast summaries
- sentiment presentation
- financial-news summaries
- currency display
- CSV forecast export
- downloadable reports
- selected browser-side persistence

## Screenshots

> Add current screenshots before publishing the repository.

![Portfolio Dashboard](./screenshots/dashboard.png)

![Portfolio Analysis](./screenshots/portfolio-analysis.png)

![Price Forecast](./screenshots/forecast.png)

![Financial News Insights](./screenshots/news-insights.png)

## Getting Started

### Prerequisites

Install:

- Python 3.11+
- Node.js
- npm
- Git

API credentials are also required for the external services used by the application.

### Clone the Repository

```bash
git clone <repository-url>
cd portfolio-assistant
```

### Backend Setup

Create a Python virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables.

Start FastAPI:

```bash
python -m uvicorn backend.main:app --reload
```

The development API will be available at:

```text
http://127.0.0.1:8000
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

### Tests

**Needs confirmation:** a comprehensive automated test suite was not established in the documented V1 development history.

Automated unit, API, integration, and frontend tests are a recommended next step before treating the application as production-ready.

## Example Environment Variables

Create a local `.env` file containing your own credentials.

Never commit real API keys.

```env
OPENAI_API_KEY=your_openai_api_key_here
FINNHUB_API_KEY=your_finnhub_api_key_here
```

Additional variables should be documented here if required by the current source tree.

## Technical Decisions

### 1. Next.js Frontend + FastAPI Backend

**Problem**

The original MVP needed to evolve beyond a prototype interface while retaining Python's financial-analysis and ML ecosystem.

**Decision**

Use Next.js and TypeScript for the frontend and FastAPI/Python for financial and AI processing.

**Why it made sense**

Python provides strong libraries for financial data processing and forecasting, while Next.js provides a flexible foundation for building a modern interactive interface.

FastAPI creates a clear API boundary between the two.

**Trade-offs**

A separated frontend/backend architecture introduces additional concerns including CORS, API contracts, deployment configuration, error handling, and data serialization.

---

### 2. Modular Analysis Components

**Problem**

Market retrieval, risk analysis, forecasting, sentiment, rebalancing, explanations, and news processing represent different responsibilities.

Putting all of this logic directly inside API routes would make the backend increasingly difficult to maintain.

**Decision**

Separate these responsibilities into components such as:

- `MarketWatchAgent`
- `RiskAnalyzerAgent`
- `ExplanationAgent`
- `RebalanceRecommender`
- `SentimentAnalyzerAgent`
- `ForecastAgent`
- `RAGNewsAgent`

**Why it made sense**

Each capability can be changed independently while the API remains relatively stable.

For example, the forecasting implementation can later be replaced or expanded without rewriting the portfolio-analysis pipeline or frontend.

**Trade-offs**

Modularity introduces interfaces that must remain consistent.

During development, mismatches between forecasting component interfaces, API response structures, and TypeScript frontend expectations required explicit debugging and data normalization.

---

### 3. External Retrieval Before LLM Generation

**Problem**

A language model should not be treated as a source of current financial news.

**Decision**

Retrieve company-specific financial headlines through Finnhub before passing the retrieved information to the OpenAI model for summarization.

**Why it made sense**

This separates retrieval from generation and grounds the generated response in externally obtained financial context.

**Trade-offs**

Output quality still depends on:

- headline relevance
- external API availability
- symbol matching
- API rate limits
- LLM interpretation

The resulting summaries should therefore not be treated as validated financial advice.

## What I Learned / Engineering Takeaways

This project reinforced several practical engineering principles.

### API contracts are part of the architecture

Correct backend logic is not enough if the frontend expects a different JSON structure. Forecast integration required keeping Python response structures and TypeScript data models aligned.

### Modular domain logic improves extensibility

Separating forecasting, risk analysis, sentiment, market retrieval, and news processing makes individual capabilities easier to test, replace, or extend.

### AI should be grounded when current information matters

Retrieving financial information before LLM processing produces a more defensible architecture than asking a model to independently provide current market information.

### ML output requires validation

A model successfully producing predictions does not automatically make those predictions financially meaningful. Forecasting systems require appropriate datasets, evaluation metrics, backtesting, and domain-aware validation.

### Full-stack AI engineering extends beyond model calls

Building the application required coordinating:

- data retrieval
- Python processing
- API design
- frontend state
- TypeScript interfaces
- visualization
- error handling
- external services
- export functionality

The AI component is one part of the overall software system.

## Future Improvements

- Replace sample forecast datasets with a validated historical-market-data pipeline
- Use appropriate stock-market trading calendars
- Add forecasting evaluation metrics
- Backtest forecasting performance
- Compare Prophet with alternative forecasting approaches
- Add portfolio performance backtesting
- Add benchmark comparison
- Expand diversification and portfolio-level analytics
- Introduce Pydantic response schemas throughout the API
- Add comprehensive automated tests
- Improve external API failure handling
- Add caching and rate-limit handling
- Add structured logging and observability
- Configure frontend API URLs through environment variables
- Add CI/CD
- Containerize the application
- Create a sanitized hosted demonstration
- Improve accessibility and responsive behavior
- Add clearer data-source attribution
- Expand financial disclaimers and validation

## Status

**Completed Portfolio V1 / Functional Demonstration**

The core full-stack workflow is implemented, including portfolio analysis, financial risk processing, forecasting, sentiment, live financial-news retrieval, LLM-generated summaries, visualization, and export functionality.

The repository is suitable as a software-engineering and applied-AI portfolio case study.

It should not currently be represented as a production investment platform, automated trading system, or validated source of financial advice.

## Disclaimer

This project is intended for software-engineering, educational, and demonstration purposes.

Forecasts, generated summaries, risk analysis, and portfolio suggestions should not be interpreted as financial or investment advice.
