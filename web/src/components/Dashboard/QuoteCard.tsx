import { memo } from 'react';
import { FaQuoteLeft, FaSync } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';
import DataCard from './DataCard';
import { Quote } from '../../types/common.types';

interface QuoteCardProps {
  quote?: Quote | null;
  loading?: boolean;
  isDarkMode?: boolean;
  onRefresh?: () => void;
}

const QuoteCard = ({ quote, loading, isDarkMode, onRefresh }: QuoteCardProps) => {
  return (
    <DataCard
      title="Daily Inspiration"
      icon={FaQuoteLeft}
      className="quote-card"
      onRefresh={onRefresh}
    >
      <div className="quote-container">
        {loading ? (
          <div className="quote-loading">
            <Spinner size="medium" color={isDarkMode ? '#fff' : '#4285F4'} />
          </div>
        ) : quote ? (
          <>
            <p className="quote-text">&quot;{quote.text}&quot;</p>
            <p className="quote-author">– {quote.author}</p>
          </>
        ) : (
          <div className="quote-error">
            <p>Unable to load quote</p>
            {onRefresh && (
              <button onClick={onRefresh} className="retry-btn">
                <FaSync /> Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </DataCard>
  );
};

export default memo(QuoteCard);
