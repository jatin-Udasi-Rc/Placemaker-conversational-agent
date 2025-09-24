'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';
import { formatResponseText } from '../utils/textFormatter';

interface Product {
  id: string;
  title: string;
  description: string;
  product_url: string;
  image_url: string;
  availability: boolean;
  unit_of_measure: string;
  keywords: string[];
  delivery_options: string[];
  categories: Array<Array<{ name: string; id: string }>>;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  confidence?: number;
  products?: Product[];
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your PlaceMakers assistant powered by Google Dialogflow. How can I help you with your building and home improvement needs today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call the Dialogflow API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      console.log('API response data:', data);
      console.log('Products received:', data.products);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'bot',
        timestamp: new Date(),
        intent: data.intent,
        confidence: data.confidence,
        products: data.products || []
      };

      console.log('Bot message created:', botMessage);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling chat API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m sorry, I\'m having trouble processing your request right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">PlaceMakers Assistant</h2>
            <p className="text-sm text-gray-500">Powered by Google Dialogflow • Online now</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-primary' : 'bg-accent'
                    }`}
                >
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-3 rounded-lg ${message.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                  >
                    {message.sender === 'bot' ? (
                      <div className="text-sm">
                        {formatResponseText(message.text)}
                      </div>
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )}
                  </div>
                  
                  {/* Show intent and confidence for bot messages in development */}
                  {message.sender === 'bot' && message.intent && process.env.NODE_ENV === 'development' && (
                    <div className="mt-1 ml-2">
                      <p className="text-xs text-gray-500">
                        Intent: {message.intent} 
                        {message.confidence && ` (${Math.round(message.confidence * 100)}%)`}
                      </p>
                    </div>
                  )}
                  
                  <p
                    className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right text-blue-100' : 'text-gray-500'
                      }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Cards */}
            {message.sender === 'bot' && message.products && message.products.length > 0 && (
              <div className="mt-4 ml-8 max-w-4xl">
                <div className="text-sm text-gray-700 font-medium mb-3">
                  Found {message.products.length} product{message.products.length > 1 ? 's' : ''} that might interest you:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {message.products.map((product) => {
                    console.log('Rendering product card for:', product);
                    return <ProductCard key={product.id} product={product} />;
                  })}
                </div>
              </div>
            )}
            {/* Debug: Show when no products */}
            {message.sender === 'bot' && (!message.products || message.products.length === 0) && (
              <div className="mt-2 ml-8 text-xs text-gray-400">
                No products in this response (products: {message.products ? message.products.length : 'undefined'})
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about building materials, tools, or home improvement projects..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-accent hover:bg-[#0099D4] disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line • Powered by Google Dialogflow
        </p>
      </div>
    </div>
  );
}
