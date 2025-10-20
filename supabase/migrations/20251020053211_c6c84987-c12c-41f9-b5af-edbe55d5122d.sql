-- Создание типов для приложения
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE public.tx_type AS ENUM ('earn', 'spend', 'adjust');
CREATE TYPE public.swipe_dir AS ENUM ('left', 'right');
CREATE TYPE public.chest_kind AS ENUM ('small', 'medium', 'large');
CREATE TYPE public.reward_kind AS ENUM ('coins', 'promo', 'boost', 'ticket');
CREATE TYPE public.partner_kind AS ENUM ('bank', 'bookmaker', 'delivery', 'media');
CREATE TYPE public.task_type AS ENUM ('follow', 'register', 'bet', 'order', 'watch_video', 'watch_stream');
CREATE TYPE public.verify_mode AS ENUM ('instant', 'webhook', 'manual');
CREATE TYPE public.task_status AS ENUM ('pending', 'verified', 'rejected', 'paid');
CREATE TYPE public.product_type AS ENUM ('ticket', 'promo', 'boost', 'dating_privilege');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved');

-- Таблица ролей пользователей (для безопасности)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Функция проверки ролей (security definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Профили пользователей
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username TEXT,
  city TEXT,
  fav_team TEXT,
  avatar_url TEXT,
  dating_on BOOLEAN DEFAULT true,
  tg_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Кошельки
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet"
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id);

-- Транзакции
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type tx_type NOT NULL,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
  action_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Сезоны
CREATE TABLE public.seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT false
);

ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seasons viewable by all"
  ON public.seasons FOR SELECT USING (true);

-- Команды
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams viewable by all"
  ON public.teams FOR SELECT USING (true);

-- Игроки
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT,
  team_id UUID REFERENCES public.teams(id),
  stats JSONB,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players viewable by all"
  ON public.players FOR SELECT USING (true);

-- Матчи
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team_id UUID REFERENCES public.teams(id) NOT NULL,
  away_team_id UUID REFERENCES public.teams(id) NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  venue TEXT,
  media JSONB,
  score_home INT,
  score_away INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matches viewable by all"
  ON public.matches FOR SELECT USING (true);

-- Результаты игр (мини-игра)
CREATE TABLE public.game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INT NOT NULL,
  reward_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game results"
  ON public.game_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game results"
  ON public.game_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Сундуки с наградами
CREATE TABLE public.chests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind chest_kind NOT NULL,
  payload JSONB NOT NULL
);

ALTER TABLE public.chests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chests viewable by all"
  ON public.chests FOR SELECT USING (true);

-- Награды
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kind reward_kind NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewards"
  ON public.rewards FOR SELECT
  USING (auth.uid() = user_id);

-- Партнеры
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  kind partner_kind NOT NULL,
  meta JSONB,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners viewable by all"
  ON public.partners FOR SELECT USING (true);

-- Задания
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id),
  title TEXT NOT NULL,
  description TEXT,
  type task_type NOT NULL,
  reward JSONB NOT NULL,
  verify_mode verify_mode NOT NULL DEFAULT 'manual',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active tasks viewable by all"
  ON public.tasks FOR SELECT
  USING (active = true);

-- Логи выполнения заданий
CREATE TABLE public.task_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks(id) NOT NULL,
  status task_status NOT NULL DEFAULT 'pending',
  proof JSONB,
  action_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.task_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task logs"
  ON public.task_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task logs"
  ON public.task_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Товары в магазине
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type product_type NOT NULL,
  price_coins INT NOT NULL,
  stock INT,
  meta JSONB,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active products viewable by all"
  ON public.products FOR SELECT
  USING (active = true);

-- Покупки/активации
CREATE TABLE public.redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own redemptions"
  ON public.redemptions FOR SELECT
  USING (auth.uid() = user_id);

-- Свайпы (знакомства)
CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  direction swipe_dir NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, target_user_id)
);

ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own swipes"
  ON public.swipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own swipes"
  ON public.swipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Мэтчи (знакомства)
CREATE TABLE public.dating_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_b UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_a, user_b)
);

ALTER TABLE public.dating_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own matches"
  ON public.dating_matches FOR SELECT
  USING (auth.uid() = user_a OR auth.uid() = user_b);

-- Тикеты поддержки
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Триггер для автоматического создания профиля и кошелька
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, tg_id)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'tg_id');
  
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 1000);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Функция обновления баланса
CREATE OR REPLACE FUNCTION public.update_wallet_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.type = 'earn' THEN
    UPDATE public.wallets
    SET balance = balance + NEW.amount, updated_at = now()
    WHERE user_id = NEW.user_id;
  ELSIF NEW.type = 'spend' THEN
    UPDATE public.wallets
    SET balance = balance - NEW.amount, updated_at = now()
    WHERE user_id = NEW.user_id;
  ELSIF NEW.type = 'adjust' THEN
    UPDATE public.wallets
    SET balance = NEW.amount, updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_transaction_created
  AFTER INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_wallet_balance();