import React, { useState } from 'react';
import { Send, MessageSquare, Clock } from 'lucide-react';

const Messages: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');

  const messages: any[] = [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // In a real app, this would send the message to the server
      console.log('Sending message:', newMessage);
      setNewMessage('');
      alert('Message sent successfully!');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Communicate with your child's teacher</p>
      </div>

      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
        <p className="text-gray-600">Messages with your child's teacher will appear here</p>
      </div>
    </div>
  );
};

export default Messages;