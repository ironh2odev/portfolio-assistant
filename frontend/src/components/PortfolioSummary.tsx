'use client'

import { useRef, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Clipboard, ClipboardCheck, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler,
} from 'chart.js'

ChartJS.register(ArcElement, ChartTooltip, ChartLegend, Filler)

type PortfolioSummaryProps = {
  analysisResult: any
  currency: {
    symbol: string
    rate: number
  }
}

const PortfolioSummary = ({ analysisResult, currency }: PortfolioSummaryProps) => {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)

  const fetchSummary = async () => {
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/summary', {
        analysis_result: analysisResult
      })
      setSummary(res.data.summary)
      toast.success('AI Summary generated!')
    } catch (error) {
      toast.error("Couldn't generate summary")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!summary) return
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    if (!summaryRef.current) return

    const html2pdfModule = await import('html2pdf.js')
    const html2pdf = html2pdfModule.default

    html2pdf()
      .set({
        margin: 0.5,
        filename: 'portfolio-summary.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .from(summaryRef.current)
      .save()

    toast.success('📄 PDF downloaded!')
  }

  const handleExportCSV = () => {
    const rows = [
      ['Symbol', 'Allocation', 'Sharpe Ratio', 'Volatility', 'Max Drawdown', 'Rebalance Suggestion']
    ]

    Object.entries(analysisResult).forEach(([symbol, data]: [string, any]) => {
      rows.push([
        symbol,
        `${(data.allocation * 100).toFixed(2)}%`,
        data.risk?.sharpe_ratio ?? 'N/A',
        `${(data.risk?.volatility * 100).toFixed(2)}%`,
        `${(data.risk?.max_drawdown * 100).toFixed(2)}%`,
        `"${data.rebalance_suggestion}"`
      ])
    })

    const csvContent = rows.map(e => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'portfolio-data.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('📄 CSV file downloaded!')
  }

  const assetSymbols = Object.keys(analysisResult)
  const allocations = assetSymbols.map(sym => {
    const val = analysisResult[sym]?.allocation
    return typeof val === 'number' && !isNaN(val) ? val : 0
  })

  console.log('Chart Labels:', assetSymbols)
  console.log('Chart Allocations:', allocations)

  const totalAllocation = allocations.reduce((a, b) => a + b, 0)
  const hasData = totalAllocation > 0

  const chartData = {
    labels: assetSymbols,
    datasets: [
      {
        label: 'Portfolio Allocation',
        data: allocations,
        backgroundColor: [
          '#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444',
          '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#0ea5e9'
        ],
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const raw = context.raw ?? 0
            const val = (raw * currency.rate).toFixed(2)
            return `${context.label}: ${currency.symbol}${val}`
          }
        }
      }
    }
  }

  console.log('🔍 Allocations:', allocations)
  console.log('🧪 Has Data:', hasData)
  console.log('📊 Analysis Result:', analysisResult)

  return (
    <div className="relative mt-10 border rounded-2xl shadow-sm bg-white p-6 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          🧠 Portfolio Summary
        </h2>

        {summary && (
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
            >
              {copied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
            >
              <Download size={16} />
              PDF
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
            >
              📥 CSV
            </button>
          </div>
        )}
      </div>

      <button
        onClick={fetchSummary}
        className="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
      >
        {loading ? 'Generating Summary...' : 'Generate AI Summary'}
      </button>

      {summary && (
        <motion.div
          ref={summaryRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap"
        >
          {summary}
        </motion.div>
      )}

      {/* 🎯 Donut Chart */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">📈 Allocation Chart</h3>
        {hasData ? (
          <Doughnut key={summary} data={chartData} options={chartOptions} />
        ) : (
          <p className="text-sm text-gray-500">No allocation data available.</p>
        )}
      </div>
    </div>
  )
}

export default PortfolioSummary
