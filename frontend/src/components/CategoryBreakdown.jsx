import React from 'react';
import { CAT_COLORS, formatCurrency } from '../utils/constants';

const CategoryBreakdown = ({ expenses, total }) => {
  const catTotals = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });

  const cats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="panel">
      <div className="panel-title">Spending by category</div>
      <div>
        {cats.length === 0 ? (
          <div className="empty-state">No data yet</div>
        ) : (
          cats.map(([cat, amt]) => {
            const pct = total > 0 ? Math.round((amt / total) * 100) : 0;
            return (
              <div className="cat-bar" key={cat}>
                <div className="cat-bar-label">
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{cat}</span>
                  <span>
                    ₹{formatCurrency(amt)}{' '}
                    <span style={{ color: 'var(--color-text-secondary)' }}>({pct}%)</span>
                  </span>
                </div>
                <div className="cat-bar-track">
                  <div 
                    className="cat-bar-fill" 
                    style={{ width: `${pct}%`, background: CAT_COLORS[cat] || '#888' }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
