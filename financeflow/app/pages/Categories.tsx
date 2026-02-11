import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useCategories, useCreateCategory, useDeleteCategory, Category } from '@/hooks/use-categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories();
  const createCat = useCreateCategory();
  const deleteCat = useDeleteCategory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [color, setColor] = useState('#6366f1');

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCat.mutateAsync({ name, type, color });
      toast({ title: 'Category created' });
      setDialogOpen(false);
      setName('');
    } catch {
      toast({ title: 'Error creating category', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCat.mutateAsync(id);
      toast({ title: 'Category deleted' });
    } catch {
      toast({ title: 'Error deleting category', variant: 'destructive' });
    }
  };

  const renderList = (title: string, items: Category[]) => (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No categories</p>
        ) : (
          <div className="space-y-2">
            {items.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-sm font-medium">{c.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Categories</h1>
            <p className="text-muted-foreground mt-1">Organize your transactions</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderList('Income Categories', incomeCategories)}
          {renderList('Expense Categories', expenseCategories)}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Category name" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Input type="color" value={color} onChange={e => setColor(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={createCat.isPending}>
              Create Category
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
