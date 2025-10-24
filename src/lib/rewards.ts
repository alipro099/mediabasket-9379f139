export type RewardType = 'coins' | 'ticket' | 'merch';

export interface Reward {
  type: RewardType;
  amount?: number;
  item?: string;
}

export function generateReward(baseAmount: number): Reward {
  const random = Math.random();
  
  if (random < 0.70) {
    // 70% chance - coins
    return {
      type: 'coins',
      amount: baseAmount,
    };
  } else if (random < 0.90) {
    // 20% chance - ticket
    return {
      type: 'ticket',
      item: 'Билет на матч Media Basket',
    };
  } else {
    // 10% chance - merch
    const merchItems = ['Футболка Media Basket', 'Кепка Media Basket', 'Мяч Media Basket'];
    return {
      type: 'merch',
      item: merchItems[Math.floor(Math.random() * merchItems.length)],
    };
  }
}
