import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import TransactionDialog from '@/components/TransactionDialog';
import { useTransactions, useDeleteTransaction, Transaction } from '@/hooks/use-transactions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export default function Transactions() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTx = useDeleteTransaction();

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const handleEdit = (tx: Transaction) => {
    setEditTx(tx);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTx.mutateAsync(id);
      toast({ title: 'Transaction deleted' });
    } catch {
      toast({ title: 'Error deleting', variant: 'destructive' });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Transactions</h1>
            <p className="text-muted-foreground mt-1">Manage your income and expenses</p>
          </div>
          <Button onClick={() => { setEditTx(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Transaction
          </Button>
        </div>

        {/* Transaction List */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No transactions found</p>
                <Button variant="outline" onClick={() => { setEditTx(null); setDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add your first transaction
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tx.categories?.color || (tx.type === 'income' ? 'hsl(160, 60%, 45%)' : 'hsl(0, 72%, 51%)') }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{tx.description || tx.categories?.name || 'Transaction'}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(tx.date), 'MMM d, yyyy')} · {tx.categories?.name || 'Uncategorized'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm whitespace-nowrap ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {tx.type === 'income' ? '+' : '-'}{fmt(Number(tx.amount))}
                      </span>
                      <div className="hidden group-hover:flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(tx)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(tx.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} editTransaction={editTx} />
    </AppLayout>
  );
}
