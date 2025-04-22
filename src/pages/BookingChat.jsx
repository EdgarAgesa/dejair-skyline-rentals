import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, ArrowLeft } from 'lucide-react';
import chatService from '../services/chatService';
import bookingService from '../services/bookingService';
import authService from '../services/authService';

const BookingChat = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get current user info
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        
        // Fetch booking details
        const bookingData = await bookingService.getBooking(bookingId);
        setBooking(bookingData);
        
        // Fetch chat messages
        const response = await chatService.getChatMessages(bookingId);
        // Extract the messages array from the response
        setMessages(response.messages || []);
        
        // Mark messages as read
        await chatService.markMessagesAsRead(bookingId);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to load chat",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookingId, toast]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await chatService.sendChatMessage(bookingId, newMessage);
      // Add the new message to the messages array
      if (response && response.chat_message) {
        setMessages(prev => [...prev, response.chat_message]);
      }
      setNewMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    }
  };

  // Helper function to get the display name for a message
  const getDisplayName = (message) => {
    // If the message is from the current user, show "You"
    if (currentUser && message.sender_id === currentUser.id) {
      return "You";
    }
    
    // For other messages, use sender_name and role
    if (message.sender_name) {
      // If it's an admin message, show role and name
      if (message.sender_type === 'admin') {
        return `${message.sender_role}: ${message.sender_name}`;
      }
      return message.sender_name;
    }
    
    // Fallback if no name is available
    return message.sender_role || (message.sender_type === 'admin' ? 'Admin' : 'Client');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading chat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chat - Booking #{bookingId}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
              {messages && messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.sender_id === currentUser?.id ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.sender_id === currentUser?.id
                          ? 'bg-dejair-600 text-white'
                          : 'bg-white border'
                      }`}
                    >
                      <div className="text-xs font-semibold mb-1">
                        {getDisplayName(message)}
                      </div>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No messages yet. Start the conversation!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingChat; 