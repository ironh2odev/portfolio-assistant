'use client';

import { useState } from 'react';
import Papa from 'papaparse';

type InputFormProps = {
  onAnalyze: (symbols: string) => void;
};

export default function InputForm({ onAnalyze }: InputFormProps) {
  const [symbols, setSymbols] = useState('AAPL,GOOG');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = () => {
    if (symbols.trim()) {
      onAnalyze(symbols);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        const rows = results.data;
        const parsedSymbols = rows.map((row) => row.Symbol).filter(Boolean).join(',');
        if (parsedSymbols) {
          setSymbols(parsedSymbols);
          onAnalyze(parsedSymbols); // ✅ Trigger analysis automatically
        }
      },
      error: (err) => {
        console.error('CSV parse error:', err);
      },
    });
  };

  return (
    <>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={symbols}
          onChange={(e) => setSymbols(e.target.value)}
          className="border px-4 py-2 rounded w-full shadow-sm"
          placeholder="Enter stock symbols (e.g. AAPL,GOOG)"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Analyze
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-2">Or upload CSV:</p>
      <input
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        className="mb-2"
      />
      {fileName && <p className="text-xs text-gray-400">Loaded file: {fileName}</p>}
    </>
  );
}
