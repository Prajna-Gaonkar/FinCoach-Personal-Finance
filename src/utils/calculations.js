// Summary metrics, budgets, goals, and spending insights.

/**
 * Calculates remaining balance, income, expense, and savings totals for transactions.
 * @param {Array} transactions 
 * @returns {Object} { totalIncome, totalExpenses, totalSavings, remainingBalance }
 */
export const calculateSummaryMetrics = (transactions) => {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      totalIncome += amount;
    } else if (tx.type === 'expense') {
      totalExpenses += amount;
    }
  });

  const remainingBalance = totalIncome - totalExpenses;
  const totalSavings = remainingBalance > 0 ? remainingBalance : 0;

  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    remainingBalance
  };
};

/**
 * Filters transactions by a specific month (format: 'YYYY-MM')
 */
export const getTransactionsByMonth = (transactions, yearMonth) => {
  return transactions.filter(tx => tx.date.startsWith(yearMonth));
};

/**
 * Groups and sums expenses by category for a specific month
 */
export const getCategorySpending = (transactions, yearMonth) => {
  const expenses = transactions.filter(tx => tx.type === 'expense' && tx.date.startsWith(yearMonth));
  const grouped = {};

  expenses.forEach((tx) => {
    if (!grouped[tx.category]) {
      grouped[tx.category] = 0;
    }
    grouped[tx.category] += Number(tx.amount) || 0;
  });

  return grouped;
};

/**
 * Calculates the monthly speed needed to reach a savings goal
 * @param {Object} goal - { targetAmount, currentSaved, targetDate }
 * @returns {Object} { progress, remaining, monthsLeft, monthlyNeeded }
 */
export const calculateGoalMetrics = (goal) => {
  const target = Number(goal.targetAmount) || 0;
  const saved = Number(goal.currentSaved) || 0;
  const remaining = Math.max(target - saved, 0);
  const progress = target > 0 ? Math.min(Math.round((saved / target) * 100), 100) : 0;

  // Calculate months remaining
  const now = new Date();
  const targetDateObj = new Date(goal.targetDate);
  
  // Calculate difference in months
  const yearDiff = targetDateObj.getFullYear() - now.getFullYear();
  const monthDiff = targetDateObj.getMonth() - now.getMonth();
  let monthsLeft = yearDiff * 12 + monthDiff;
  
  // If date is in the same month, or passed, treat it as 1 month to avoid dividing by 0
  if (monthsLeft <= 0) {
    monthsLeft = 1;
  }

  const monthlyNeeded = Math.round(remaining / monthsLeft);

  return {
    progress,
    remaining,
    monthsLeft,
    monthlyNeeded
  };
};

/**
 * Compares actual category spending against set budgets for a month.
 * @param {Object} categorySpend - grouped expenses { Food: 4500, Travel: 1200 }
 * @param {Array} budgets - set budgets [{ category: 'Food', limit: 5000 }]
 * @returns {Array} List of budgets with actual spend and alert level
 */
export const calculateBudgetComparison = (categorySpend, budgets) => {
  return budgets.map((b) => {
    const spent = categorySpend[b.category] || 0;
    const diff = b.limit - spent;
    const percent = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;

    let alertLevel = 'safe'; // safe, warning, exceeded
    let alertMessage = 'Safe spending';

    if (spent > b.limit) {
      alertLevel = 'exceeded';
      alertMessage = `Over budget by ${Math.abs(diff).toLocaleString()}`;
    } else if (spent >= b.limit * 0.85) {
      alertLevel = 'warning';
      alertMessage = `Approaching limit — ${diff.toLocaleString()} left`;
    }

    return {
      category: b.category,
      limit: b.limit,
      spent,
      percent,
      diff,
      alertLevel,
      alertMessage
    };
  });
};

/** Builds spending tips from transactions and budgets for the selected month. */
export const generateInsights = (transactions, budgets, currentYearMonth = '2026-05') => {
  const insights = [];
  const currentMonthTx = getTransactionsByMonth(transactions, currentYearMonth);
  const currentExpenses = currentMonthTx.filter(tx => tx.type === 'expense');

  if (currentExpenses.length === 0) {
    return [
      {
        id: 'no-data',
        title: 'No insights yet',
        description: 'Add some income and expenses for this month to see spending tips here.',
        type: 'info'
      }
    ];
  }

  // 1. Highest spending category this month
  const categorySpend = getCategorySpending(transactions, currentYearMonth);
  let peakCategory = '';
  let peakAmount = 0;
  Object.entries(categorySpend).forEach(([cat, amt]) => {
    if (amt > peakAmount) {
      peakAmount = amt;
      peakCategory = cat;
    }
  });

  if (peakCategory) {
    insights.push({
      id: 'peak-spend',
      title: 'Highest Spending Category',
      description: `Your highest spending category this month is ${peakCategory} (${peakAmount.toLocaleString()} total).`,
      type: 'warning'
    });
  }

  // 2. Needs vs Wants analysis
  // Needs: Rent, Bills, Health, Education
  // Wants: Food, Travel, Shopping, Entertainment, Other
  let needsTotal = 0;
  let wantsTotal = 0;
  currentExpenses.forEach((tx) => {
    const amt = Number(tx.amount) || 0;
    const cat = tx.category.toLowerCase();
    if (['rent', 'bills', 'health', 'education'].includes(cat)) {
      needsTotal += amt;
    } else {
      wantsTotal += amt;
    }
  });

  const totalExpense = needsTotal + wantsTotal;
  if (totalExpense > 0) {
    const needsPercent = Math.round((needsTotal / totalExpense) * 100);
    const wantsPercent = 100 - needsPercent;

    let ratioMessage = `Your spending ratio is ${needsPercent}% Needs and ${wantsPercent}% Wants/Lifestyle.`;
    if (needsPercent > 60) {
      ratioMessage += " Your fixed needs are high; try to lower subscription/utility costs.";
    } else if (wantsPercent > 40) {
      ratioMessage += " Lifestyle spending is on the high side. Many people aim for something close to 50% needs, 30% wants, 20% savings.";
    } else {
      ratioMessage += " Your needs vs wants split looks reasonable.";
    }

    insights.push({
      id: 'needs-wants',
      title: 'Needs vs Wants Balance',
      description: ratioMessage,
      type: 'info'
    });
  }

  // 3. Month-over-Month Expense comparison
  // Find last month format (e.g. '2026-04' if current is '2026-05')
  const [year, month] = currentYearMonth.split('-').map(Number);
  let lastMonthYear = year;
  let lastMonthNum = month - 1;
  if (lastMonthNum === 0) {
    lastMonthNum = 12;
    lastMonthYear -= 1;
  }
  const lastMonthStr = `${lastMonthYear}-${String(lastMonthNum).padStart(2, '0')}`;
  
  const lastMonthTx = getTransactionsByMonth(transactions, lastMonthStr);
  const lastMonthExpenses = lastMonthTx.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + Number(tx.amount), 0);
  const currentMonthExpenses = currentExpenses.reduce((sum, tx) => sum + Number(tx.amount), 0);

  if (lastMonthExpenses > 0) {
    const pctDiff = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
    const absPct = Math.round(Math.abs(pctDiff));

    if (pctDiff > 5) {
      insights.push({
        id: 'mom-trend',
        title: 'Expenses are Rising',
        description: `Spending is up ${absPct}% vs last month (${currentMonthExpenses.toLocaleString()} vs ${lastMonthExpenses.toLocaleString()}). Check your budgets if you want to cut back.`,
        type: 'danger'
      });
    } else if (pctDiff < -5) {
      insights.push({
        id: 'mom-trend',
        title: 'Spending is down',
        description: `You spent ${absPct}% less than last month. Nice work.`,
        type: 'success'
      });
    }
  }

  // 4. Budget Alerts integration
  const budgetComparisons = calculateBudgetComparison(categorySpend, budgets);
  const exceededBudgets = budgetComparisons.filter(b => b.alertLevel === 'exceeded');
  const warningBudgets = budgetComparisons.filter(b => b.alertLevel === 'warning');

  if (exceededBudgets.length > 0) {
    const names = exceededBudgets.map(b => b.category).join(', ');
    insights.push({
      id: 'budget-exceeded-alert',
      title: 'Over budget',
      description: `You went over your monthly limit for: ${names}. See the Budgets page for details.`,
      type: 'danger'
    });
  } else if (warningBudgets.length > 0) {
    const names = warningBudgets.map(b => b.category).join(', ');
    insights.push({
      id: 'budget-warning-alert',
      title: 'Approaching Budget Limits',
      description: `Keep an eye on: ${names}. They are close to exceeding 85% of your set limit.`,
      type: 'warning'
    });
  }

  // 5. Biggest Expense Ever
  let maxExpenseTx = null;
  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      if (!maxExpenseTx || Number(tx.amount) > Number(maxExpenseTx.amount)) {
        maxExpenseTx = tx;
      }
    }
  });

  if (maxExpenseTx) {
    insights.push({
      id: 'biggest-expense',
      title: 'Largest single expense',
      description: `Your biggest purchase so far is "${maxExpenseTx.title}" (${Number(maxExpenseTx.amount).toLocaleString()} on ${maxExpenseTx.date}).`,
      type: 'info'
    });
  }

  return insights;
};
