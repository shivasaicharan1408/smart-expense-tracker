import React, { useState } from 'react';
import { today } from '../utils/constants';
import { createExpense } from '../api';

const ExpenseForm = ({ budget, setBudget, onExpenseAdded }) => {
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState('Food');
  const [date, setDate] = useState(today());
  const [bInput, setBInput] = useState('');

  const handleAdd = async () => {
    if (bInput && parseFloat(bInput) > 0) {
      setBudget(parseFloat(bInput));
    }
    
    if (!desc || !amt || parseFloat(amt) <= 0) {
      alert('Please enter a description and valid amount.');
      return;
    }

    try {
      const newExpense = await createExpense({
        amount: parseFloat(amt),
        category: cat,
        date: date,
        description: desc
      });
      
      onExpenseAdded(newExpense);
      setDesc('');
      setAmt('');
      setDate(today());
    } catch (error) {
      console.error('Failed to create expense', error);
    }
  };

  return (
    <div className="panel">
      <div className="panel-title">Add expense</div>
      <div className="add-form">
        <div className="row">
          <input 
            type="text" 
            placeholder="Description" 
            value={desc} 
            onChange={e => setDesc(e.target.value)} 
          />
          <input 
            type="number" 
            placeholder="₹ Amount" 
            min="0" 
            step="1" 
            style={{ maxWidth: '120px' }} 
            value={amt} 
            onChange={e => setAmt(e.target.value)} 
          />
        </div>
        <div className="row">
          <select value={cat} onChange={e => setCat(e.target.value)}>
            <option value="Food">🍛 Food</option>
            <option value="Transport">🚗 Transport</option>
            <option value="Shopping">🛍 Shopping</option>
            <option value="Health">💊 Health</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Utilities">💡 Utilities</option>
            <option value="Other">📦 Other</option>
          </select>
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
          />
        </div>
        <div className="row">
          <div className="budget-input-row">
            <label>Monthly budget ₹</label>
            <input 
              type="number" 
              placeholder={budget.toString()} 
              min="0" 
              step="500" 
              value={bInput} 
              onChange={e => setBInput(e.target.value)} 
            />
          </div>
          <button className="add-btn" onClick={handleAdd}>Add ↩</button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
