import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/use-categories';
import { useCreateTransaction, useUpdateTransaction, Transaction } from '@/hooks/use-transactions';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTransaction?: Transaction | null;
}

export default function TransactionDialog({ open, onOpenChange, editTransaction }: Props) {
  const [type, setType] = useState<string>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState<string>('');

  const { data: categories = [] } = useCategories(type);
  const createTx = useCreateTransaction();
  const updateTx = useUpdateTransaction();

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(String(editTransaction.amount));
      setDescription(editTransaction.description || '');
      setDate(editTransaction.date);
      setCategoryId(editTransaction.category_id || '');
    } else {
      setType('expense');
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategoryId('');
    }
  }, [editTransaction, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      type,
      amount: parseFloat(amount),
      description: description || undefined,
      date,
      category_id: categoryId || undefined,
    };

    try {
      if (editTransaction) {
        await updateTx.mutateAsync({ id: editTransaction.id, ...payload });
        toast({ title: 'Transaction updated' });
      } else {
        await createTx.mutateAsync(payload);
        toast({ title: 'Transaction added' });
      }
      onOpenChange(false);
    } catch {
      toast({ title: 'Error saving transaction', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{editTransaction ? 'Edit' : 'Add'} Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant={type === 'income' ? 'default' : 'outline'} onClick={() => setType('income')} className={type === 'income' ? 'gradient-income border-0' : ''}>
              Income
            </Button>
            <Button type="button" variant={type === 'expense' ? 'default' : 'outline'} onClick={() => setType('expense')} className={type === 'expense' ? 'gradient-expense border-0' : ''}>
              Expense
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input type="number" step="0.01" min="0.01" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={createTx.isPending || updateTx.isPending}>
            {editTransaction ? 'Update' : 'Add'} Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
