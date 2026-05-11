import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { TrendingUp, Activity, DollarSign } from 'lucide-react';

const Dashboard = ({ expenses, prediction }) => {
  // Calculate total current month spending
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category for chart
  const categoryTotals = currentMonthExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals).map(category => ({
    name: category,
    value: categoryTotals[category]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="dashboard-grid">
      {/* Summary Cards */}
      <div className="card glass summary-card">
        <div className="summary-icon bg-blue">
          <DollarSign size={24} />
        </div>
        <div className="summary-info">
          <h3>Current Month</h3>
          <p className="summary-value">${totalSpent.toFixed(2)}</p>
        </div>
      </div>

      <div className="card glass summary-card highlight-card">
        <div className="summary-icon bg-purple">
          <TrendingUp size={24} />
        </div>
        <div className="summary-info">
          <h3>ML Prediction ({prediction?.next_month || 'Next Month'})</h3>
          <p className="summary-value">
            ${prediction?.predicted_amount !== undefined ? prediction.predicted_amount.toFixed(2) : '0.00'}
          </p>
          <span className="summary-subtitle">Expected spending</span>
        </div>
      </div>

      {/* Chart */}
      <div className="card glass chart-card span-2">
        <h3>Spending by Category</h3>
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-chart">
            <Activity size={48} className="text-muted mb-2" />
            <p className="text-muted">No data for current month</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
