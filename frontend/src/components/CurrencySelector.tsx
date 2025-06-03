'use client'

import { useEffect, useState } from 'react'

export const supportedCurrencies = {
  USD: { symbol: '$', rate: 1 },
  ZWL: { symbol: 'Z$', rate: 867 },       // Example: 1 USD = 867 ZWL
  ZAR: { symbol: 'R', rate: 18.5 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 }
}

interface Props {
  onChange: (currency: string) => void
  selected: string
}

export default function CurrencySelector({ onChange, selected }: Props) {
  const [currency, setCurrency] = useState(selected)

  useEffect(() => {
    localStorage.setItem('selectedCurrency', currency)
    onChange(currency)
  }, [currency])

  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-600 mr-2">Currency:</label>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 focus:outline-none"
      >
        {Object.keys(supportedCurrencies).map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </select>
    </div>
  )
}
