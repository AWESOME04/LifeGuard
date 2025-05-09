import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FaQuoteLeft, FaSync } from 'react-icons/fa';
import Spinner from '../Spinner/Spinner';
import DataCard from './DataCard';

const QuoteCard = ({ quote, loading, isDarkMode, onRefresh }) => {
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
            <p className="quote-text">&quot;{quote.quote}&quot;</p>
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

QuoteCard.propTypes = {
  quote: PropTypes.shape({
    quote: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
  }),
  loading: PropTypes.bool,
  isDarkMode: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default memo(QuoteCard);
