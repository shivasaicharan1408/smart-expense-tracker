export function getDayOfMonth(dateStr) {
  return new Date(dateStr).getDate();
}

export function linearRegression(xs, ys) {
  const n = xs.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = my - slope * mx;
  return { slope, intercept };
}

export function predictMonthEnd(exps, yr, mo) {
  if (exps.length < 2) {
    const total = exps.reduce((s, e) => s + e.amount, 0);
    return { predicted: total * 2.5, spent: total, confidence: 'low', slope: 0, intercept: 0 };
  }
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const today = new Date();
  const daysPassed = (yr === today.getFullYear() && mo === today.getMonth())
    ? Math.min(today.getDate(), daysInMonth)
    : daysInMonth;

  const dailyMap = {};
  exps.forEach(e => {
    const d = getDayOfMonth(e.date);
    dailyMap[d] = (dailyMap[d] || 0) + e.amount;
  });

  const xs = [], ys = [];
  let cum = 0;
  for (let d = 1; d <= daysPassed; d++) {
    cum += (dailyMap[d] || 0);
    xs.push(d); ys.push(cum);
  }

  const { slope, intercept } = linearRegression(xs, ys);
  const predicted = Math.max(0, slope * daysInMonth + intercept);
  const spent = exps.reduce((s, e) => s + e.amount, 0);
  const confidence = exps.length >= 8 ? 'high' : exps.length >= 4 ? 'medium' : 'low';

  return {
    predicted: Math.round(predicted),
    spent: Math.round(spent),
    confidence,
    slope,
    intercept,
    xs,
    ys,
    daysPassed,
    daysInMonth
  };
}
