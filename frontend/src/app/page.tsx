'use client'

import { useEffect, useState, useRef } from 'react'
import InputForm from '../components/InputForm'
import AssetCard from '../components/AssetCard'
import PortfolioSummary from '../components/PortfolioSummary'
import CurrencySelector, { supportedCurrencies } from '../components/CurrencySelector'
import toast from 'react-hot-toast'
import SummaryRow from '../components/SummaryRow'

interface AnalysisResultProps {
  analysisResult: any
  currency: {
    symbol: string
    rate: number
  }
}

export default function Home() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState('USD')
  const reportRef = useRef<HTMLDivElement>(null)

  const currentDate = new Date().toLocaleDateString()

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-result')
    const savedCurrency = localStorage.getItem('selectedCurrency')

    if (saved) {
      setResult(JSON.parse(saved))
      toast('📂 Loaded saved portfolio', { icon: '💾' })
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
    console.log('✅ Fetched Result:', data)  // ← ADD THIS
    setResult(data)
    localStorage.setItem('portfolio-result', JSON.stringify(data))
    toast.success('Portfolio analysis complete!')
  } catch (error) {
    console.error('API fetch error:', error)
    toast.error('Something went wrong. Please try again.')
  } finally {
    setLoading(false)
  }
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

              {Object.entries(result).map(([symbolKey, data]) => (
                <AssetCard
                  key={symbolKey}
                  symbol={symbolKey}
                  data={data}
                  currency={{ symbol, rate }}
                />
              ))}

              <PortfolioSummary analysisResult={result} currency={{ symbol, rate }} />
            </div>

            <div className="mt-6">
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
