
import React, { useState, useEffect } from 'react';
import { getZenQuote } from '../services/geminiService';
import { QuoteData } from '../types';

const ZenQuote: React.FC = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      const data = await getZenQuote();
      setQuote(data);
      setLoading(false);
    };
    fetchQuote();
  }, []);

  if (loading) return <div className="animate-pulse opacity-30 italic">静寂を求めて...</div>;
  if (!quote) return null;

  return (
    <div className="max-w-xl text-center px-4 animate-fadeIn">
      <p className="text-lg md:text-xl italic font-light mb-2">"{quote.text}"</p>
      <p className="text-sm opacity-60">— {quote.author}</p>
    </div>
  );
};

export default ZenQuote;
