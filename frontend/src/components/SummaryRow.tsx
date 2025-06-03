'use client'

import { Trophy, TrendingUp, Zap } from 'lucide-react'

interface Props {
  result: Record<
    string,
    {
      risk?: {
        sharpe_ratio?: number
        volatility?: number
        max_drawdown?: number
      }
    }
  > | null | undefined
}

export default function SummaryRow({ result }: Props) {
  if (!result || typeof result !== 'object' || Object.keys(result).length === 0) {
    return (
      <div className="text-sm text-gray-500 italic mt-4">
        No summary data available.
      </div>
    )
  }

  // Get the asset with the max drawdown
  const maxDrawdownEntry = Object.entries(result).reduce(
    (acc, [symbol, data]) => {
      const drawdown = data.risk?.max_drawdown ?? -Infinity
      return drawdown > (acc.value ?? -Infinity) ? { symbol, value: drawdown } : acc
    },
    { symbol: '', value: -Infinity }
  )

  // Get the asset with the best Sharpe ratio
  const bestSharpeEntry = Object.entries(result).reduce(
    (acc, [symbol, data]) => {
      const sharpe = data.risk?.sharpe_ratio ?? -Infinity
      return sharpe > (acc.value ?? -Infinity) ? { symbol, value: sharpe } : acc
    },
    { symbol: '', value: -Infinity }
  )

  // Get the most volatile asset
  const mostVolatileEntry = Object.entries(result).reduce(
    (acc, [symbol, data]) => {
      const vol = data.risk?.volatility ?? -Infinity
      return vol > (acc.value ?? -Infinity) ? { symbol, value: vol } : acc
    },
    { symbol: '', value: -Infinity }
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-700 font-semibold mb-1">
          <Trophy size={18} />
          Best Sharpe Ratio
        </div>
        <p className="text-gray-800 text-sm">
          {bestSharpeEntry.symbol} – {bestSharpeEntry.value?.toFixed(2)}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700 font-semibold mb-1">
          <TrendingUp size={18} />
          Most Volatile
        </div>
        <p className="text-gray-800 text-sm">
          {mostVolatileEntry.symbol} – {(mostVolatileEntry.value * 100).toFixed(2)}%
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-red-700 font-semibold mb-1">
          <Zap size={18} />
          Max Drawdown
        </div>
        <p className="text-gray-800 text-sm">
          {maxDrawdownEntry.symbol} – {(maxDrawdownEntry.value * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  )
}
