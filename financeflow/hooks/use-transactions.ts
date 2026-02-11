import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  type: string;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
  updated_at: string;
  categories?: { name: string; icon: string; color: string } | null;
}

export function useTransactions(filters?: { startDate?: string; endDate?: string; type?: string; categoryId?: string; search?: string }) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*, categories(name, icon, color)')
        .eq('user_id', user!.id)
        .order('date', { ascending: false });

      if (filters?.startDate) query = query.gte('date', filters.startDate);
      if (filters?.endDate) query = query.lte('date', filters.endDate);
      if (filters?.type) query = query.eq('type', filters.type);
      if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
      if (filters?.search) query = query.ilike('description', `%${filters.search}%`);

      const { data, error } = await query;
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (tx: { type: string; amount: number; description?: string; date: string; category_id?: string }) => {
      const { error } = await supabase.from('transactions').insert({ ...tx, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...tx }: { id: string; type?: string; amount?: number; description?: string; date?: string; category_id?: string | null }) => {
      const { error } = await supabase.from('transactions').update(tx).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}
