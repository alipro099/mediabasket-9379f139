import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  city: string | null;
  fav_team: string | null;
  avatar_url: string | null;
  dating_on: boolean;
  tg_id: string | null;
}

interface Wallet {
  balance: number;
}

interface UserState {
  profile: Profile | null;
  wallet: Wallet | null;
  isLoading: boolean;
  fetchProfile: (userId: string) => Promise<void>;
  fetchWallet: (userId: string) => Promise<void>;
  updateBalance: (newBalance: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  wallet: null,
  isLoading: false,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      set({ profile: data as Profile });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchWallet: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      set({ wallet: data as Wallet });
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  },

  updateBalance: (newBalance: number) => {
    set({ wallet: { balance: newBalance } });
  },
}));
