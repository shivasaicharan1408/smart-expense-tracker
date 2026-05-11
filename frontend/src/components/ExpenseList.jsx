import React from 'react';
import { CAT_COLORS, formatCurrency } from '../utils/constants';
import { deleteExpense } from '../api';

const ExpenseList = ({ expenses, onExpenseDeleted }) => {
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      onExpenseDeleted(id);
    } catch (error) {
      console.error('Failed to delete expense', error);
    }
  };

  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15);

  return (
    <div style={{ marginTop: '1rem' }}>
      <div className="panel-title">Recent expenses</div>
      <div className="expense-list">
        {sorted.length === 0 ? (
          <div className="empty-state">No expenses this month.<br/>Add one above.</div>
        ) : (
          sorted.map(e => (
            <div className="expense-item" key={e.id}>
              <div className="ei-left">
                <div className="cat-dot" style={{ background: CAT_COLORS[e.category] || '#888' }}></div>
                <div>
                  <div className="ei-desc">{e.description}</div>
                  <div className="ei-date">{e.category} · {e.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="ei-amt">₹{formatCurrency(e.amount)}</div>
                <button 
                  className="ei-del" 
                  onClick={() => handleDelete(e.id)} 
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
