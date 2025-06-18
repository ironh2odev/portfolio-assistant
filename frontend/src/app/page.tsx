'use client'

import { useEffect, useState, useRef } from 'react'
import InputForm from '../components/InputForm'
import AssetCard from '../components/AssetCard'
import PortfolioSummary from '../components/PortfolioSummary'
import CurrencySelector, { supportedCurrencies } from '../components/CurrencySelector'
import SummaryRow from '../components/SummaryRow'
import SentimentChart from '../components/SentimentChart'
import ForecastChart from '../components/ForecastChart'
import toast from 'react-hot-toast'
import type { ForecastData } from '@/types'
import {
  forecastToCSV,
  generateForecastSummary,
  calculatePortfolioHealth,
} from '@/lib/utils'

export default function Home() {
  const [result, setResult] = useState<any>(null)
  const [sentiment, setSentiment] = useState<Record<string, any> | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [forecastSummary, setForecastSummary] = useState<string | null>(null)
  const [newsInsights, setNewsInsights] = useState<Record<string, string[]> | null>(null)
  const [health, setHealth] = useState<{ score: number; label: string; color: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState('USD')
  const reportRef = useRef<HTMLDivElement>(null)

  const currentDate = new Date().toLocaleDateString()

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-result')
    const savedSentiment = localStorage.getItem('portfolio-sentiment')
    const savedCurrency = localStorage.getItem('selectedCurrency')

    if (saved) {
      const parsed = JSON.parse(saved)
      setResult(parsed)
      setHealth(calculatePortfolioHealth(parsed))
      toast('📂 Loaded saved portfolio', { icon: '💾' })
    }

    if (savedSentiment) {
      setSentiment(JSON.parse(savedSentiment))
    }

    if (savedCurrency) {
      setCurrency(savedCurrency)
    }
  }, [])

  const handleAnalyze = async (symbols: string, allocations?: Record<string, number>) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ symbols })
      if (allocations) {
        params.append('allocations', JSON.stringify(allocations))
      }

      const res = await fetch(`http://localhost:8000/market?${params.toString()}`)
      if (!res.ok) throw new Error('API call failed')

      const data = await res.json()
      setResult(data)
      setHealth(calculatePortfolioHealth(data))
      localStorage.setItem('portfolio-result', JSON.stringify(data))
      toast.success('Portfolio analysis complete!')
    } catch (error) {
      console.error('API fetch error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSentimentFetch = async () => {
  if (!result) return toast.error('Run a portfolio analysis first.')

  const symbols = Object.keys(result)

  try {
    // === Fetch Sentiment First ===
    const sentimentRes = await fetch(`http://localhost:8000/sentiment?symbols=${symbols.join(',')}`)
    if (!sentimentRes.ok) throw new Error('Sentiment fetch failed')
    const sentimentData = await sentimentRes.json()
    setSentiment(sentimentData)
    localStorage.setItem('portfolio-sentiment', JSON.stringify(sentimentData))
    toast.success('🧠 Sentiment insights retrieved!')

    // === Fetch Forecasts Per Symbol ===
    const forecastData: ForecastData = {}

    for (const symbol of symbols) {
      const res = await fetch(`http://localhost:8000/forecast?symbol=${symbol}`)
      if (!res.ok) {
        console.warn(`Failed to get forecast for ${symbol}`)
        continue
      }
      const json = await res.json()
      forecastData[symbol] = json
    }

    console.log("Forecast Data:", JSON.stringify(forecastData, null, 2))
    setForecast(forecastData)
    setForecastSummary(generateForecastSummary(forecastData))
  } catch (err) {
    console.error(err)
    toast.error('Failed to fetch sentiment or forecast insights.')
  }
}

  const handleNewsFetch = async () => {
  if (!result) return toast.error('Run a portfolio analysis first.')

  const symbols = Object.keys(result).join(',')
  try {
    const newsRes = await fetch(`http://localhost:8000/rag-news-insights?symbols=${symbols}`)
    if (!newsRes.ok) throw new Error('RAG News fetch failed')
    const newsData = await newsRes.json()
    setNewsInsights(newsData)
    toast.success('📰 RAG News insights loaded!')
  } catch (err) {
    console.error(err)
    toast.error('Failed to fetch RAG news insights.')
  }
}

  const handleExportForecast = () => {
    if (!forecast) return toast.error('No forecast data to export.')
    const csv = forecastToCSV(forecast)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'forecast.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('📤 Forecast CSV downloaded!')
  }

  const handleDownloadReport = async () => {
    if (!reportRef.current) return
    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default
    html2pdf()
      .set({
        margin: 0.5,
        filename: 'portfolio-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      })
      .from(reportRef.current)
      .save()
    toast.success('📄 Report downloaded!')
  }

  const { symbol, rate } = supportedCurrencies[currency as keyof typeof supportedCurrencies]

  return (
    <main className="min-h-screen p-6 sm:p-10 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Portfolio Assistant</h1>
        <p className="text-gray-600 mb-4">
          Track your portfolio assets, understand risk, and receive smart rebalance suggestions.
        </p>

        <CurrencySelector selected={currency} onChange={(val) => {
          setCurrency(val)
          localStorage.setItem('selectedCurrency', val)
        }} />

        <InputForm onAnalyze={handleAnalyze} />

        {loading && (
          <p className="text-blue-500 text-sm font-medium mt-4">Analyzing portfolio...</p>
        )}

        {!result && !loading && (
          <p className="text-gray-500 text-sm mt-6">No portfolio data available. Please run an analysis.</p>
        )}

        {result && (
          <>
            <div ref={reportRef} className="mt-8 space-y-6">
              <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-700">📄 Portfolio Report</h2>
                <p className="text-sm text-gray-600">Date: {currentDate}</p>
                <p className="text-sm text-gray-600">Currency: {currency} ({symbol})</p>
              </div>

              <SummaryRow result={result} />

              {health && (
                <div className="p-4 rounded-lg border shadow bg-opacity-10"
                  style={{ backgroundColor: `var(--tw-bg-opacity, 1)`, borderColor: `var(--tw-border-opacity, 1)` }}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">❤️ Portfolio Health</h3>
                  <p className={`text-${health.color} text-xl font-bold`}>
                    {health.label} ({health.score}/100)
                  </p>
                </div>
              )}

              {Object.entries(result).map(([symbolKey, data]) => (
                <AssetCard
                  key={symbolKey}
                  symbol={symbolKey}
                  data={data}
                  currency={{ symbol, rate }}
                />
              ))}

              <PortfolioSummary analysisResult={result} currency={{ symbol, rate }} />

              {sentiment && <SentimentChart sentiment={sentiment} />}
              {forecast && <ForecastChart forecast={forecast} currencySymbol={symbol} />}

              {forecast && (
                <>
                  <button
                    onClick={handleExportForecast}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    📤 Export Forecast CSV
                  </button>

                  {forecastSummary && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-md text-blue-800 text-sm whitespace-pre-line">
                      <strong>🧠 Forecast Summary</strong>
                      <p className="mt-1">{forecastSummary}</p>
                    </div>
                  )}
                </>
              )}

              {sentiment && (
                <div className="bg-yellow-100 p-4 rounded-md border border-yellow-300">
                  <h3 className="text-lg font-semibold mb-2 text-yellow-800">🧠 Market Sentiment</h3>
                  <ul className="space-y-1 text-sm text-yellow-900 list-disc list-inside">
                    {Object.entries(sentiment).map(([symbol, obj]) => (
                      <li key={symbol}>
                        <strong>{symbol}</strong>: {typeof obj === 'object' ? obj.summary : obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {newsInsights && (
                <div className="bg-indigo-50 border border-indigo-300 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2 text-indigo-800">📰 RAG News Highlights</h3>
                  <ul className="text-sm text-indigo-900 space-y-2 list-disc list-inside">
                    {Object.entries(newsInsights).map(([symbol, articles]) => (
                      <li key={symbol}>
                        <strong>{symbol}:</strong>
                        <ul className="ml-4 list-disc list-inside">
                          {Array.isArray(articles) ? (
  articles.map((headline, idx) => (
    <li key={idx}>{headline}</li>
  ))
) : (
  <li>{articles}</li>
)}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 flex-wrap">
              <button
                onClick={handleSentimentFetch}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                🧠 Get Sentiment Insights
              </button>

              <button
                onClick={handleNewsFetch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                📰 Load RAG News Insights
              </button>

              <button
                onClick={handleDownloadReport}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                📄 Download Full Report
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
