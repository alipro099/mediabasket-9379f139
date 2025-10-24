-- Create fantasy_teams table for storing user fantasy team data
CREATE TABLE IF NOT EXISTS public.fantasy_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_ids JSONB DEFAULT '[]'::jsonb,
  points INTEGER DEFAULT 0,
  season_id UUID REFERENCES public.seasons(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, season_id)
);

ALTER TABLE public.fantasy_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own fantasy team"
ON public.fantasy_teams FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fantasy team"
ON public.fantasy_teams FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fantasy team"
ON public.fantasy_teams FOR UPDATE
USING (auth.uid() = user_id);

-- Create chat_messages table for public chat
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat messages are viewable by everyone"
ON public.chat_messages FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert chat messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create private_messages table for 1:1 dating chats
CREATE TABLE IF NOT EXISTS public.private_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.dating_matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their matches"
ON public.private_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.dating_matches
    WHERE id = private_messages.match_id
    AND (user_a = auth.uid() OR user_b = auth.uid())
  )
);

CREATE POLICY "Users can insert messages to their matches"
ON public.private_messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.dating_matches
    WHERE id = match_id
    AND (user_a = auth.uid() OR user_b = auth.uid())
  )
);

-- Add swipes_available column to profiles for dating feature
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS swipes_available INTEGER DEFAULT 10;

-- Add favorite_team column if not exists
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS favorite_team TEXT;

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_messages;