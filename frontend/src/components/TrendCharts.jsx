import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { CAT_COLORS, MONTHS } from '../utils/constants';
import { getDayOfMonth } from '../utils/math';

const TrendCharts = ({ expenses, pred, viewYear, viewMonth, allExpenses }) => {
  // 1. Line Chart Data (Daily Spending)
  const dailyMap = {};
  expenses.forEach(e => {
    const d = getDayOfMonth(e.date);
    dailyMap[d] = (dailyMap[d] || 0) + e.amount;
  });

  const lineData = [];
  let cum = 0;
  for (let d = 1; d <= pred.daysInMonth; d++) {
    const dataPoint = { day: d };
    
    if (d <= pred.daysPassed) {
      cum += (dailyMap[d] || 0);
      dataPoint.actual = cum;
    }
    
    if (pred.slope !== undefined) {
      dataPoint.predicted = Math.max(0, Math.round(pred.slope * d + pred.intercept));
    }
    
    lineData.push(dataPoint);
  }

  // 2. Donut Chart Data (Category Breakdown)
  const catTotals = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const pieData = Object.entries(catTotals).map(([name, value]) => ({ name, value }));

  // 3. Bar Chart Data (Monthly Comparison)
  const getMonthExpenses = (yr, mo) => {
    return allExpenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === yr && d.getMonth() === mo;
    });
  };

  const barData = [];
  for (let i = 5; i >= 0; i--) {
    let dYr = viewYear;
    let dMo = viewMonth - i;
    while (dMo < 0) { dMo += 12; dYr -= 1; }
    
    const mo_exps = getMonthExpenses(dYr, dMo);
    barData.push({
      month: MONTHS[dMo].slice(0, 3),
      total: mo_exps.reduce((s, e) => s + e.amount, 0),
      isCurrent: i === 0
    });
  }

  return (
    <>
      <div className="section-header" style={{ marginTop: '1.5rem' }}>
        <h2>Trend Charts</h2>
      </div>
      <div className="chart-row">
        <div className="panel">
          <div className="panel-title">Daily spending this month</div>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#888', fontSize: 10 }} tickFormatter={(val) => `₹${val}`} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-background-secondary)', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="actual" stroke="#1D9E75" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="#378ADD" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="panel">
          <div className="panel-title">Category breakdown</div>
          <div style={{ height: '200px' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CAT_COLORS[entry.name] || '#888'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-background-secondary)', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '11px', color: '#888' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">No data yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2>Monthly comparison</h2>
      </div>
      <div className="panel">
        <div style={{ height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888', fontSize: 10 }} tickFormatter={(val) => `₹${val}`} axisLine={false} tickLine={false} />
              <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-background-secondary)', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
              <Bar dataKey="total" radius={[4, 4, 0, 0]} name="Total Spend">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isCurrent ? '#1D9E75' : 'rgba(29, 158, 117, 0.35)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default TrendCharts;
