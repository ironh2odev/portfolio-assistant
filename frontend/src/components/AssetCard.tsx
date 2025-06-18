'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'
import { format } from 'date-fns'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

type AssetCardProps = {
  symbol: string
  data: any
  currency: {
    symbol: string
    rate: number
  }
  sentiment?: string // 👈 NEW PROP
}

export default function AssetCard({ symbol, data, currency, sentiment }: AssetCardProps) {
  const prices = data?.prices || {}
  const dates = Object.keys(prices?.Close || {})
  const closePrices = (Object.values(prices?.Close || {}) as number[]).map(
    (p) => p * currency.rate
  )

  const chartData = {
    labels: dates.map((date: string) => format(new Date(date), 'MMM d')),
    datasets: [
      {
        label: `${symbol} Close Price`,
        data: closePrices,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.3,
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${currency.symbol}${context.raw.toFixed(2)}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (tickValue: number | string) => {
            const val = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue
            return `${currency.symbol}${val.toFixed(2)}`
          }
        }
      }
    }
  }

  const rebalance = data.rebalance_suggestion
  const formattedRebalance =
    typeof rebalance === 'string' && rebalance.match(/(\d+\.?\d*)%/)
      ? rebalance.replace(/(\d+\.?\d*)%/, (match) => {
          const amount = parseFloat(match)
          const converted = (amount / 100) * (closePrices.at(-1) ?? 0)
          return `${currency.symbol}${converted.toFixed(2)}`
        })
      : rebalance

  const sentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-yellow-500'
    }
  }

  return (
    <div className="bg-white p-6 shadow-md rounded-lg mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-1">{symbol}</h2>

      {sentiment && (
        <p className={`text-sm font-medium ${sentimentColor(sentiment)} mb-3`}>
          Sentiment: {sentiment.toUpperCase()}
        </p>
      )}

      <div className="mb-4">
        <Line data={chartData} options={options} />
      </div>

      <div className="grid grid-cols-3 gap-6 text-sm mb-4">
        <div>
          <h4 className="font-semibold text-gray-700">Sharpe Ratio</h4>
          <p>{data.risk?.sharpe_ratio ?? 'N/A'}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700">Volatility</h4>
          <p>{(data.risk?.volatility * 100).toFixed(2)}%</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700">Max Drawdown</h4>
          <p>{(data.risk?.max_drawdown * 100).toFixed(2)}%</p>
        </div>
      </div>

      <div className="mb-2">
        <h4 className="font-medium text-gray-700">📉 Rebalance Suggestion</h4>
        <p className="text-blue-700">{formattedRebalance}</p>
      </div>

      <div>
        <h4 className="font-medium text-gray-700">🧠 Explanation</h4>
        <p className="text-gray-600 text-sm">{data.explanation}</p>
      </div>
    </div>
  )
}
