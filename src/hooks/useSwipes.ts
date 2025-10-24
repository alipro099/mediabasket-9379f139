import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCoinsStore } from '@/stores/coinsStore';
import { toast } from 'sonner';

const SWIPE_COST = 100;
const SWIPES_PER_PURCHASE = 10;

export function useSwipes() {
  const [swipesAvailable, setSwipesAvailable] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const { balance, spendCoins } = useCoinsStore();

  const fetchSwipes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('swipes_available')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setSwipesAvailable(data?.swipes_available ?? 5);
    } catch (error) {
      console.error('Error fetching swipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const useSwipe = async () => {
    if (swipesAvailable <= 0) {
      toast.error('Нет доступных свайпов', {
        description: 'Купите свайпы за коины',
      });
      return false;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('profiles')
        .update({ swipes_available: swipesAvailable - 1 })
        .eq('user_id', user.id);

      if (error) throw error;

      setSwipesAvailable(prev => prev - 1);
      return true;
    } catch (error) {
      console.error('Error using swipe:', error);
      return false;
    }
  };

  const buySwipes = async () => {
    if (balance < SWIPE_COST) {
      toast.error('Недостаточно коинов', {
        description: `Нужно ${SWIPE_COST} коинов`,
      });
      return false;
    }

    try {
      const success = await spendCoins(SWIPE_COST, 'buy_swipes');
      if (!success) return false;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('profiles')
        .update({ swipes_available: swipesAvailable + SWIPES_PER_PURCHASE })
        .eq('user_id', user.id);

      if (error) throw error;

      setSwipesAvailable(prev => prev + SWIPES_PER_PURCHASE);
      toast.success(`Куплено ${SWIPES_PER_PURCHASE} свайпов!`);
      return true;
    } catch (error) {
      console.error('Error buying swipes:', error);
      toast.error('Ошибка покупки свайпов');
      return false;
    }
  };

  useEffect(() => {
    fetchSwipes();
  }, []);

  return {
    swipesAvailable,
    isLoading,
    useSwipe,
    buySwipes,
    canBuySwipes: balance >= SWIPE_COST,
  };
}
