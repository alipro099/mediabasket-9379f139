import { useEffect, useState, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { hapticFeedback } from '@/lib/telegram';
import { CoinsDisplay } from '@/components/CoinsDisplay';

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  profiles?: {
    username: string | null;
    favorite_team: string | null;
  } | null;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles!chat_messages_user_id_fkey (username, favorite_team)
      `)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data as any || []);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        async (payload) => {
          const { data } = await supabase
            .from('chat_messages')
            .select(`
              *,
              profiles!chat_messages_user_id_fkey (username, favorite_team)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data as any]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    if (messageText.length > 500) {
      toast.error('Сообщение слишком длинное (максимум 500 символов)');
      return;
    }

    setIsLoading(true);
    hapticFeedback.light();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Необходимо войти');
        return;
      }

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: messageText,
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Ошибка отправки сообщения');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Трибуна</h1>
                <p className="text-sm text-muted-foreground">
                  {messages.length} сообщений
                </p>
              </div>
            </div>
            <CoinsDisplay />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <ScrollArea className="h-[calc(100vh-280px)] p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
                <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                <p>Пока нет сообщений</p>
                <p className="text-sm mt-2">Будьте первым!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm">
                        {msg.profiles?.username || 'Аноним'}
                      </span>
                      {msg.profiles?.favorite_team && (
                        <span className="text-xs text-primary">
                          {msg.profiles.favorite_team}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-foreground bg-secondary/30 rounded-lg px-3 py-2">
                      {msg.message}
                    </p>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="mt-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Напишите сообщение..."
              maxLength={500}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {newMessage.length}/500
          </p>
        </form>
      </div>
    </div>
  );
}