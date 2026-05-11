export const CAT_COLORS = {
  Food: '#1D9E75',
  Transport: '#378ADD',
  Shopping: '#D85A30',
  Health: '#7F77DD',
  Entertainment: '#D4537E',
  Utilities: '#EF9F27',
  Other: '#888780',
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper to get today's date in YYYY-MM-DD
export function today(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

// Format numbers to Indian locale as requested in the design
export function formatCurrency(num) {
  return num.toLocaleString('en-IN');
}
