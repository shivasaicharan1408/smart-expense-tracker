import React, { useState, useEffect } from 'react';
import { MONTHS } from './utils/constants';
import { predictMonthEnd } from './utils/math';
import { getExpenses } from './api';

import DashboardMetrics from './components/DashboardMetrics';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryBreakdown from './components/CategoryBreakdown';
import MLPredictions from './components/MLPredictions';
import TrendCharts from './components/TrendCharts';

import './index.css';

function App() {
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [budget, setBudget] = useState(15000);
  
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExpenses();
        // data from FastAPI endpoint /expenses/
        setAllExpenses(data);
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const shiftMonth = (d) => {
    let newMo = viewMonth + d;
    let newYr = viewYear;
    if (newMo > 11) { newMo = 0; newYr++; }
    if (newMo < 0) { newMo = 11; newYr--; }
    setViewMonth(newMo);
    setViewYear(newYr);
  };

  const getMonthExpenses = (yr, mo) => {
    return allExpenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === yr && d.getMonth() === mo;
    });
  };

  const handleExpenseAdded = (newExpense) => {
    setAllExpenses(prev => [newExpense, ...prev]);
  };

  const handleExpenseDeleted = (id) => {
    setAllExpenses(prev => prev.filter(e => e.id !== id));
  };

  if (loading) {
    return <div className="tracker"><div className="empty-state">Loading your financial data...</div></div>;
  }

  const currentExpenses = getMonthExpenses(viewYear, viewMonth);
  const totalSpent = currentExpenses.reduce((s, e) => s + e.amount, 0);
  const pred = predictMonthEnd(currentExpenses, viewYear, viewMonth);
  const avgDaily = pred.daysPassed > 0 ? (totalSpent / pred.daysPassed) : 0;

  return (
    <div className="tracker">
      <div className="top-bar">
        <div>
          <h1>Expense Tracker</h1>
          <div className="sub">Intelligent spending analysis & ML forecast</div>
        </div>
        <div className="month-switch">
          <button onClick={() => shiftMonth(-1)}>‹</button>
          <span style={{ minWidth: '100px', textAlign: 'center', fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={() => shiftMonth(1)}>›</button>
        </div>
      </div>

      <DashboardMetrics 
        total={totalSpent} 
        budget={budget} 
        avgDaily={avgDaily} 
        daysPassed={pred.daysPassed} 
        transactionCount={currentExpenses.length} 
      />

      <div className="main-grid">
        <div>
          <ExpenseForm budget={budget} setBudget={setBudget} onExpenseAdded={handleExpenseAdded} />
          <ExpenseList expenses={currentExpenses} onExpenseDeleted={handleExpenseDeleted} />
        </div>
        <CategoryBreakdown expenses={currentExpenses} total={totalSpent} />
      </div>

      <MLPredictions 
        pred={pred} 
        budget={budget} 
        avgDaily={avgDaily} 
        expenses={currentExpenses} 
        total={totalSpent} 
      />

      <TrendCharts 
        expenses={currentExpenses} 
        pred={pred} 
        viewYear={viewYear} 
        viewMonth={viewMonth} 
        allExpenses={allExpenses} 
      />
    </div>
  );
}

export default App;
