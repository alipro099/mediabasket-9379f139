import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CoinsStore {
  balance: number;
  isLoading: boolean;
  fetchBalance: () => Promise<void>;
  addCoins: (amount: number, reason: string) => Promise<void>;
  spendCoins: (amount: number, reason: string) => Promise<boolean>;
}

export const useCoinsStore = create<CoinsStore>((set, get) => ({
  balance: 0,
  isLoading: false,

  fetchBalance: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      set({ balance: data?.balance || 0 });
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addCoins: async (amount: number, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'earn',
          amount,
          reason,
        });

      if (error) throw error;

      set((state) => ({ balance: state.balance + amount }));
      toast.success(`+${amount} коинов`, { description: reason });
    } catch (error) {
      console.error('Error adding coins:', error);
      toast.error('Ошибка начисления коинов');
    }
  },

  spendCoins: async (amount: number, reason: string) => {
    const currentBalance = get().balance;
    if (currentBalance < amount) {
      toast.error('Недостаточно коинов');
      return false;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'spend',
          amount,
          reason,
        });

      if (error) throw error;

      set((state) => ({ balance: state.balance - amount }));
      toast.success(`-${amount} коинов`, { description: reason });
      return true;
    } catch (error) {
      console.error('Error spending coins:', error);
      toast.error('Ошибка списания коинов');
      return false;
    }
  },
}));