import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminUsers() {
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_roles').select('*');
      if (error) throw error;
      return data;
    },
  });

  const getUserRole = (userId: string) => {
    const role = roles.find(r => r.user_id === userId);
    return role?.role || 'user';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">View and manage system users</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">All Users ({profiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : profiles.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No users found</p>
            ) : (
              <div className="space-y-3">
                {profiles.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{p.full_name || 'No name'}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getUserRole(p.user_id) === 'admin' ? 'default' : 'secondary'}>
                        {getUserRole(p.user_id)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(p.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
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
