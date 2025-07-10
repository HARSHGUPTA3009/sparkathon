
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send, Leaf } from 'lucide-react';

const EcoBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 🌱 I'm EcoBot, your friendly environmental companion. Ask me anything about your eco-impact or need some green inspiration!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const ecoFacts = [
    "🌍 Did you know? Skipping one meat meal saves about 0.45kg of CO₂ - that's like not driving 3.5km!",
    "🌱 Food waste accounts for 8-10% of global greenhouse gas emissions. Every meal you don't waste counts!",
    "🚗 Your weekly opt-outs could save enough CO₂ to power a smartphone for 6 months!",
    "🌳 If everyone in your mess opted out once a week, you'd collectively plant the equivalent of 50 trees annually!",
    "💚 You're part of a growing movement! 73% of people want to live more sustainably.",
    "♻️ Small changes make big differences. Your consistent choices inspire others around you!",
    "🌟 Every sustainable choice you make creates a ripple effect in your community.",
    "🐝 By reducing food waste, you're also helping protect pollinators and biodiversity!"
  ];

  const responses = [
    "That's a great question! Here's what I know: ",
    "I love your curiosity about the environment! ",
    "Eco-fact time! ",
    "You're making such a positive impact! Here's something cool: ",
    "Keep up the amazing work! Did you know: "
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    // Generate bot response
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const randomFact = ecoFacts[Math.floor(Math.random() * ecoFacts.length)];
    
    const botMessage = {
      id: messages.length + 2,
      text: randomResponse + randomFact,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        size="icon"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 w-80 h-96 bg-slate-800/95 backdrop-blur-md border-slate-700/50 shadow-2xl z-50 flex flex-col transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-sm">EcoBot 🌱</CardTitle>
                  <CardDescription className="text-xs text-emerald-300">
                    Your eco-companion
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-3 min-h-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700/50 text-slate-100'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 flex-shrink-0">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about eco-tips..."
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 text-sm"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                className="bg-emerald-600 hover:bg-emerald-700 w-8 h-8 flex-shrink-0"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default EcoBot;
