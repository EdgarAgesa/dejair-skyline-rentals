
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from 'lucide-react';
import authService from '../services/authService';
import chatService from '../services/chatService';

const ChatMessages = ({ bookingId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef(null);
  const currentUser = authService.getCurrentUser();
  
  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await chatService.getChatMessages(bookingId);
      setMessages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load messages on component mount
  useEffect(() => {
    fetchMessages();
    // Set up interval to check for new messages
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [bookingId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      await chatService.sendChatMessage(bookingId, newMessage);
      setNewMessage('');
      // Fetch updated messages immediately
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 overflow-y-auto mb-4 p-4 border rounded-md">
          {loading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No messages yet</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                  msg.sender_id === currentUser?.id 
                    ? 'ml-auto bg-dejair-600 text-white' 
                    : 'bg-gray-100'
                }`}
              >
                <div className="text-xs mb-1">
                  {msg.sender_name || 'User'} • {new Date(msg.timestamp).toLocaleString()}
                </div>
                <div>{msg.message}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4 mr-1" />
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatMessages;
