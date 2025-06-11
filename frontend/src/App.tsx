import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User, AlertTriangle, } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
}

interface ApiResponse {
  answer?: string;
  error?: string;
  message?: string;
  success?: boolean;
  details?: string;
}

const Agent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = 'https://qnabot-1.onrender.com:4000';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (type: 'user' | 'assistant' | 'error', content: string) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    const question = inputValue.trim();
    setInputValue('');
    setConnectionError(null);
    
    // Add user message
    addMessage('user', question);
    setIsLoading(true);

    try {
      console.log('Sending request to:', `${API_BASE_URL}/api/ask`);
      console.log('Question:', question);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);//to abort

      const response = await fetch(`${API_BASE_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question,
          maxLength: 200 
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const data: ApiResponse = await response.json();
      console.log('Response data:', data);
      
      if (data.error) {
        throw new Error(data.error + (data.message ? `: ${data.message}` : ''));
      }

      if (!data.answer || data.answer.trim() === '') {
        throw new Error('Received empty response from server');
      }

      addMessage('assistant', data.answer);
      
    } catch (err) {
      console.error('Request failed:', err);
      
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. The server took too long to respond.';
        } else if (err.message.includes('fetch')) {
          errorMessage = 'Cannot connect to server. Make sure the backend is running on port 4000.';
          setConnectionError(errorMessage);
        } else {
          errorMessage = err.message;
        }
      }

      addMessage('error', `Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    if (content.includes('{') && content.includes('}')) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);//regex
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          const beforeJson = content.substring(0, content.indexOf(jsonMatch[0]));
          const afterJson = content.substring(content.indexOf(jsonMatch[0]) + jsonMatch[0].length);
          
          return (
            <div>
              {beforeJson && <div className="mb-3">{beforeJson}</div>}
              <div className="bg-slate-900 p-4 rounded-lg border text-sm font-mono overflow-x-auto">
                <pre className="text-green-400 whitespace-pre-wrap">{JSON.stringify(jsonData, null, 2)}</pre>
              </div>
              {afterJson && <div className="mt-3">{afterJson}</div>}
            </div>
          );
        }
      } catch (e) {
      }
    }

    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-white-900 to-slate-900">
 
      <div className="relative z-10 container mx-auto max-w-4xl p-4">
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white bg-clip-text ">
                QnA Agent Assistant
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-gray-200 text-sm font-medium">AI-Powered</span>
              </div>
            </div>
          </div>
          <p className="text-slate-300 text-lg">
            Your intelligent companion for movies, programming, books, and more!
          </p>
       
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="text-center text-slate-300 mt-16">
                <div className="relative mb-8">
                  <MessageCircle className="w-16 h-16 mx-auto text-slate-400/50" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Ready to help you explore!</h3>
                
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {(message.type === 'assistant' || message.type === 'error') && (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      message.type === 'error' 
                        ? 'bg-red-500/20 border border-red-500/30' 
                        : 'bg-gray-800 '
                    }`}>
                      {message.type === 'error' ? (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      ) : (
                        <Bot className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  )}
                  
                  <div
                    className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-slate-800 text-slate-100 border border-white/20 backdrop-blur-sm '
                        : message.type === 'error'
                        ? 'bg-red-900/30 text-red-200 border border-red-500/30 backdrop-blur-sm'
                        : 'bg-slate-800 text-slate-100 border border-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <div className="text-sm leading-relaxed">
                      {formatMessage(message.content)}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' 
                        ? 'text-purple-200' 
                        : message.type === 'error'
                        ? 'text-red-300'
                        : 'text-slate-400'
                    }`}>
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className=" backdrop-blur-sm p-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask me anything about movies, programming, or general topics..."
                className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg "
                disabled={isLoading || !!connectionError}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !inputValue.trim() || !!connectionError}
                className="px-6 py-3 bg-gray-200  rounded-xl hover:bg-gray-300"
              >
                <Send className="w-4 h-4" />
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Agent;
