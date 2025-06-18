'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type Props = {
  sentiment: Record<string, any>
}

export default function SentimentChart({ sentiment }: Props) {
  const counts = {
    positive: 0,
    neutral: 0,
    negative: 0
  }

  for (const item of Object.values(sentiment)) {
    const score = typeof item === 'object' ? item.score : 'neutral'
    if (score in counts) {
      counts[score as keyof typeof counts]++
    } else {
      counts.neutral++
    }
  }

  const data = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: [counts.positive, counts.neutral, counts.negative],
        backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Sentiment Breakdown</h3>
      <Bar data={data} options={options} />
    </div>
  )
}
