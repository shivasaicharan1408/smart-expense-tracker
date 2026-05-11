import React from 'react';
import { formatCurrency } from '../utils/constants';

const DashboardMetrics = ({ total, budget, avgDaily, daysPassed, transactionCount }) => {
  const percentUsed = budget > 0 ? Math.round((total / budget) * 100) : 0;
  const budgetLeft = Math.max(0, budget - total);

  return (
    <div className="metric-row">
      <div className="metric-card">
        <div className="label">Spent so far</div>
        <div className="value">₹{formatCurrency(total)}</div>
        <div className={`delta ${total > budget * 0.8 ? 'up' : 'down'}`}>
          {percentUsed}% of budget
        </div>
      </div>
      
      <div className="metric-card">
        <div className="label">Budget left</div>
        <div className="value">₹{formatCurrency(budgetLeft)}</div>
        <div className={`delta ${total > budget ? 'up' : 'neutral'}`}>
          {budget > 0 ? `of ₹${formatCurrency(budget)}` : ''}
        </div>
      </div>

      <div className="metric-card">
        <div className="label">Avg per day</div>
        <div className="value">₹{formatCurrency(Math.round(avgDaily))}</div>
        <div className="delta neutral">over {daysPassed} days</div>
      </div>

      <div className="metric-card">
        <div className="label">Transactions</div>
        <div className="value">{transactionCount}</div>
        <div className="delta neutral">this month</div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
