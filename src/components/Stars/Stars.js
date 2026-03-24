import React from 'react';
import './Stars.css';

export default function Stars({ rating = 0, count }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="stars-wrap">
      <span className="stars">
        {'★'.repeat(full)}
        {half ? '½' : ''}
        {'☆'.repeat(empty)}
      </span>
      {count !== undefined && (
        <span className="stars-count">({count})</span>
      )}
    </div>
  );
}
