"use client";

import React from "react";

interface SentimentResult {
  summary: string;
  score: "positive" | "neutral" | "negative";
}

interface Props {
  data: Record<string, SentimentResult>;
}

export default function SentimentInsights({ data }: Props) {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">📰 Sentiment Insights</h2>
      {Object.entries(data).map(([symbol, result]) => (
        <div key={symbol} className="mb-4 p-4 rounded-xl shadow bg-white">
          <h3 className="text-lg font-semibold">{symbol}</h3>
          <p className={`text-sm mt-1`}>
            <strong>Sentiment:</strong>{" "}
            <span
              className={
                result.score === "positive"
                  ? "text-green-600"
                  : result.score === "negative"
                  ? "text-red-600"
                  : "text-gray-600"
              }
            >
              {result.score}
            </span>
          </p>
          <p className="mt-2 text-gray-800 text-sm">{result.summary}</p>
        </div>
      ))}
    </div>
  );
}
