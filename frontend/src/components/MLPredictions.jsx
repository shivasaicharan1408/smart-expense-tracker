import React from 'react';
import { CAT_COLORS, formatCurrency } from '../utils/constants';

const MLPredictions = ({ pred, budget, avgDaily, expenses, total }) => {
  const savePred = Math.max(0, budget - pred.predicted);
  const overBudget = pred.predicted > budget;
  const pct = budget > 0 ? Math.round((pred.predicted / budget) * 100) : 0;
  
  const catTotals = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const cats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const topCat = cats[0] ? cats[0][0] : null;
  const topPct = cats[0] && total > 0 ? Math.round((cats[0][1] / total) * 100) : 0;

  let insightText = '';
  if (expenses.length === 0) {
    insightText = 'No expenses recorded for this month. Add your first expense above to start tracking.';
  } else {
    insightText = `<strong>ML Insight:</strong> Based on ${expenses.length} transactions, you are projected to spend <strong>₹${formatCurrency(pred.predicted)}</strong> this month. `;
    if (overBudget) {
      insightText += `<span class="warn-text">This exceeds your ₹${formatCurrency(budget)} budget by ₹${formatCurrency(pred.predicted - budget)}.</span> Consider cutting back on <strong>${topCat}</strong>, which makes up ${topPct}% of your spending. `;
    } else {
      insightText += `You are within your ₹${formatCurrency(budget)} budget and projected to save <strong class="ok-text">₹${formatCurrency(savePred)}</strong>. `;
    }
    if (pred.slope > avgDaily * 0.1) {
      insightText += 'Your spending velocity is <strong>increasing</strong> — trend suggests acceleration towards month-end.';
    } else if (pred.slope < -avgDaily * 0.1) {
      insightText += 'Your spending is <strong>decelerating</strong> — good discipline in the second half of the month.';
    } else {
      insightText += 'Your daily spending rate is <strong>consistent</strong> throughout the month.';
    }
  }

  return (
    <>
      <div className="section-header">
        <h2>ML Predictions</h2>
        <span className="tag tag-ml">Linear Regression Model</span>
      </div>
      
      <div className="predict-grid">
        <div className="predict-card">
          <div className="pc-label">Predicted month-end spend</div>
          <div className={`pc-value ${overBudget ? 'warn-text' : ''}`}>₹{formatCurrency(pred.predicted)}</div>
          <div className="pc-detail">Confidence: <strong>{pred.confidence}</strong> · {expenses.length} data points</div>
          <div className="pc-bar">
            <div 
              className="pc-bar-inner" 
              style={{ width: `${Math.min(100, pct)}%`, background: overBudget ? '#D85A30' : '#1D9E75' }}
            ></div>
          </div>
        </div>
        
        <div className="predict-card">
          <div className="pc-label">Projected savings</div>
          <div className={`pc-value ${overBudget ? 'warn-text' : 'ok-text'}`}>₹{formatCurrency(savePred)}</div>
          <div className="pc-detail">
            {overBudget 
              ? `Likely to exceed budget by ₹${formatCurrency(pred.predicted - budget)}` 
              : 'On track to stay within budget'}
          </div>
          <div className="pc-bar">
            <div 
              className="pc-bar-inner" 
              style={{ width: `${Math.min(100, overBudget ? 100 : Math.round((savePred / budget) * 100))}%`, background: overBudget ? '#D85A30' : '#378ADD' }}
            ></div>
          </div>
        </div>
        
        <div className="predict-card">
          <div className="pc-label">Daily spend rate</div>
          <div className="pc-value">₹{formatCurrency(Math.round(avgDaily))}</div>
          <div className="pc-detail">Recommended: ₹{budget > 0 ? formatCurrency(Math.round(budget / pred.daysInMonth)) : '—'}/day</div>
          <div className="pc-bar">
            <div 
              className="pc-bar-inner" 
              style={{ width: `${budget > 0 ? Math.min(100, Math.round((avgDaily / (budget / pred.daysInMonth)) * 100)) : 0}%`, background: '#EF9F27' }}
            ></div>
          </div>
        </div>
        
        <div className="predict-card">
          <div className="pc-label">Top spending category</div>
          <div className="pc-value" style={{ fontSize: '15px', color: CAT_COLORS[topCat] || 'var(--color-text-primary)' }}>
            {topCat || '—'}
          </div>
          <div className="pc-detail">
            {topCat 
              ? `₹${formatCurrency(cats[0][1])} · ${Math.round((cats[0][1] / (total || 1)) * 100)}% of spending` 
              : 'No data yet'}
          </div>
          <div className="pc-bar">
            <div 
              className="pc-bar-inner" 
              style={{ width: `${topCat && total > 0 ? Math.round((cats[0][1] / total) * 100) : 0}%`, background: CAT_COLORS[topCat] || '#888' }}
            ></div>
          </div>
        </div>
      </div>

      <div 
        className="insight-box" 
        style={{ marginTop: '1rem' }} 
        dangerouslySetInnerHTML={{ __html: insightText }} 
      />
    </>
  );
};

export default MLPredictions;
