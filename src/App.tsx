import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Game from "./pages/Game";
import Fantasy from "./pages/Fantasy";
import Dating from "./pages/Dating";
import Tasks from "./pages/Tasks";
import Chat from "./pages/Chat";
import { Navigation } from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <div className="pb-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game" element={<Game />} />
            <Route path="/fantasy" element={<Fantasy />} />
            <Route path="/dating" element={<Dating />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/chat" element={<Chat />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Navigation />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
