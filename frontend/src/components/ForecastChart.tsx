'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import React from 'react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export type ForecastChartProps = {
  forecast: Record<string, { date: string[]; price: number[] }>
  currencySymbol: string
}

export default function ForecastChart({ forecast, currencySymbol }: ForecastChartProps) {
  const firstKey = Object.keys(forecast)[0]

  if (!forecast || Object.keys(forecast).length === 0 || !forecast[firstKey]?.date?.length) {
    return (
      <div className="mt-10 bg-white p-5 shadow rounded-lg text-gray-600">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">📈 Price Forecast</h3>
        <p>No forecast data available at the moment.</p>
      </div>
    )
  }

  const labels = forecast[firstKey].date
  const chartData = {
    labels,
    datasets: Object.entries(forecast).map(([symbol, data]) => ({
      label: symbol,
      data: data.price,
      fill: false,
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 2,
      tension: 0.3,
    }))
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${currencySymbol}${context.raw}`
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function (value: number | string, index: number, ticks: any) {
            return `${currencySymbol}${value}`
          }
        }
      }
    }
  }

  return (
    <div className="mt-10 bg-white p-5 shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">📈 Price Forecast (Next 30 Days)</h3>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}
