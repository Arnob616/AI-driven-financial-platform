import { useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { useTransactions } from '@/hooks/use-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, ArrowRightLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function Dashboard() {
  const { data: transactions = [], isLoading } = useTransactions();

  const stats = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense, count: transactions.length };
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { name: string; value: number; color: string }>();
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const name = t.categories?.name || 'Uncategorized';
      const color = t.categories?.color || '#6b7280';
      const existing = map.get(name);
      map.set(name, { name, value: (existing?.value || 0) + Number(t.amount), color });
    });
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const months: { month: string; income: number; expense: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const start = format(startOfMonth(date), 'yyyy-MM-dd');
      const end = format(endOfMonth(date), 'yyyy-MM-dd');
      const monthTx = transactions.filter(t => t.date >= start && t.date <= end);
      months.push({
        month: format(date, 'MMM'),
        income: monthTx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
        expense: monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
      });
    }
    return months;
  }, [transactions]);

  const recentTx = transactions.slice(0, 5);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your financial overview at a glance</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Income', value: stats.totalIncome, icon: TrendingUp, className: 'gradient-income text-income-foreground' },
            { label: 'Total Expenses', value: stats.totalExpense, icon: TrendingDown, className: 'gradient-expense text-expense-foreground' },
            { label: 'Balance', value: stats.balance, icon: Wallet, className: 'gradient-primary text-primary-foreground' },
            { label: 'Transactions', value: stats.count, icon: ArrowRightLeft, className: 'bg-card text-card-foreground border border-border', isCount: true },
          ].map(({ label, value, icon: Icon, className, isCount }) => (
            <div key={label} className={`stat-card ${className} rounded-2xl`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium opacity-80">{label}</span>
                <Icon className="h-5 w-5 opacity-70" />
              </div>
              <p className="text-2xl font-display font-bold animate-count-up">
                {isCount ? value : fmt(value)}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip formatter={(v: number) => fmt(v)} />
                    <Bar dataKey="income" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center">
                {categoryBreakdown.length === 0 ? (
                  <p className="text-muted-foreground text-center w-full">No expense data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {categoryBreakdown.map((entry, i) => (
                          <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTx.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No transactions yet. Add your first one!</p>
            ) : (
              <div className="space-y-3">
                {recentTx.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tx.type === 'income' ? 'hsl(160, 60%, 45%)' : 'hsl(0, 72%, 51%)' }} />
                      <div>
                        <p className="text-sm font-medium">{tx.description || tx.categories?.name || 'Transaction'}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(tx.date), 'MMM d, yyyy')} · {tx.categories?.name}</p>
                      </div>
                    </div>
                    <span className={`font-semibold text-sm ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      {tx.type === 'income' ? '+' : '-'}{fmt(Number(tx.amount))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
