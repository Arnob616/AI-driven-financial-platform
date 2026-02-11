import { useMemo, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useTransactions } from '@/hooks/use-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function Reports() {
  const [period, setPeriod] = useState('6months');
  const { data: transactions = [] } = useTransactions();

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const monthlyData = useMemo(() => {
    const count = period === '12months' ? 12 : 6;
    const months: { month: string; income: number; expense: number; net: number }[] = [];
    for (let i = count - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const start = format(startOfMonth(date), 'yyyy-MM-dd');
      const end = format(endOfMonth(date), 'yyyy-MM-dd');
      const monthTx = transactions.filter(t => t.date >= start && t.date <= end);
      const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const expense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
      months.push({ month: format(date, 'MMM yy'), income, expense, net: income - expense });
    }
    return months;
  }, [transactions, period]);

  const categoryData = useMemo(() => {
    const map = new Map<string, { name: string; value: number; color: string }>();
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const name = t.categories?.name || 'Uncategorized';
      const color = t.categories?.color || '#6b7280';
      const existing = map.get(name);
      map.set(name, { name, value: (existing?.value || 0) + Number(t.amount), color });
    });
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const incomeCategories = useMemo(() => {
    const map = new Map<string, { name: string; value: number; color: string }>();
    transactions.filter(t => t.type === 'income').forEach(t => {
      const name = t.categories?.name || 'Uncategorized';
      const color = t.categories?.color || '#6b7280';
      const existing = map.get(name);
      map.set(name, { name, value: (existing?.value || 0) + Number(t.amount), color });
    });
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const exportPDF = () => {
    const doc = new jsPDF();
    const now = format(new Date(), 'MMMM d, yyyy');

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FinanceFlow Report', 14, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Generated on ${now}`, 14, 30);

    // Summary
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, 44);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total Income: ${fmt(totalIncome)}`, 14, 52);
    doc.text(`Total Expenses: ${fmt(totalExpense)}`, 14, 58);
    doc.text(`Net Balance: ${fmt(balance)}`, 14, 64);

    // Monthly breakdown table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Monthly Breakdown', 14, 78);

    autoTable(doc, {
      startY: 82,
      head: [['Month', 'Income', 'Expenses', 'Net']],
      body: monthlyData.map(m => [m.month, fmt(m.income), fmt(m.expense), fmt(m.net)]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });

    // Transactions table
    const finalY = (doc as any).lastAutoTable?.finalY || 120;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Transactions', 14, finalY + 14);

    autoTable(doc, {
      startY: finalY + 18,
      head: [['Date', 'Type', 'Category', 'Description', 'Amount']],
      body: transactions.map(t => [
        t.date,
        t.type,
        t.categories?.name || '-',
        t.description || '-',
        fmt(Number(t.amount)),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8 },
    });

    doc.save(`financeflow-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Reports</h1>
            <p className="text-muted-foreground mt-1">Visual breakdown of your finances</p>
          </div>
          <div className="flex gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="12months">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportPDF}>
              <Download className="h-4 w-4 mr-2" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Income vs Expense Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Income vs Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="hsl(160, 60%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expense" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="net" stroke="hsl(220, 70%, 50%)" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {categoryData.length === 0 ? (
                  <p className="text-muted-foreground text-center pt-20">No expense data</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {categoryData.map((entry, i) => <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Income Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {incomeCategories.length === 0 ? (
                  <p className="text-muted-foreground text-center pt-20">No income data</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={incomeCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {incomeCategories.map((entry, i) => <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
