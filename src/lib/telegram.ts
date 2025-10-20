import WebApp from '@twa-dev/sdk';

export const initTelegram = () => {
  if (typeof window !== 'undefined') {
    WebApp.ready();
    WebApp.expand();
    WebApp.enableClosingConfirmation();
    
    // Применяем цветовую схему из Telegram
    if (WebApp.themeParams) {
      document.documentElement.style.setProperty('--tg-theme-bg-color', WebApp.themeParams.bg_color || '#1a1f2e');
      document.documentElement.style.setProperty('--tg-theme-text-color', WebApp.themeParams.text_color || '#ffffff');
    }
  }
};

export const hapticFeedback = {
  light: () => WebApp.HapticFeedback.impactOccurred('light'),
  medium: () => WebApp.HapticFeedback.impactOccurred('medium'),
  heavy: () => WebApp.HapticFeedback.impactOccurred('heavy'),
  success: () => WebApp.HapticFeedback.notificationOccurred('success'),
  warning: () => WebApp.HapticFeedback.notificationOccurred('warning'),
  error: () => WebApp.HapticFeedback.notificationOccurred('error'),
};

export const getTelegramUser = () => {
  return WebApp.initDataUnsafe?.user || null;
};

export { WebApp };
