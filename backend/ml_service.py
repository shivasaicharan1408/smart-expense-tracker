import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np
from datetime import date
from dateutil.relativedelta import relativedelta

def predict_next_month_spending(db_session, ExpenseModel):
    # Fetch all expenses
    expenses = db_session.query(ExpenseModel).all()
    
    if len(expenses) < 5:
        # Not enough data for meaningful ML
        return 0.0
        
    # Convert to Pandas DataFrame
    data = [{"amount": e.amount, "date": e.date} for e in expenses]
    df = pd.DataFrame(data)
    
    # Ensure date column is datetime
    df['date'] = pd.to_datetime(df['date'])
    
    # Group by month and year, sum amounts
    df['month_year'] = df['date'].dt.to_period('M')
    monthly_spending = df.groupby('month_year')['amount'].sum().reset_index()
    monthly_spending['month_index'] = range(1, len(monthly_spending) + 1)
    
    if len(monthly_spending) < 2:
        return 0.0 # Need at least 2 months to train a basic regression
        
    # Features (X) and Target (y)
    X = monthly_spending[['month_index']]
    y = monthly_spending['amount']
    
    # Train Linear Regression model
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict next month
    next_month_index = len(monthly_spending) + 1
    predicted_amount = model.predict(pd.DataFrame({'month_index': [next_month_index]}))[0]
    
    # Prevent negative predictions
    return max(0, predicted_amount)
