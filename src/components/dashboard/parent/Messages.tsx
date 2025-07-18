import React, { useState } from 'react';
import { Send, MessageSquare, Clock } from 'lucide-react';

const Messages: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'teacher',
      senderName: 'Mrs. Johnson',
      content: 'Emma has shown excellent progress in her reading comprehension this week. She\'s actively participating in class discussions and asking thoughtful questions.',
      timestamp: '2025-01-10T10:30:00Z',
      read: true
    },
    {
      id: 2,
      sender: 'parent',
      senderName: 'You',
      content: 'Thank you for the update! Emma has been very excited about the current book. She talks about it at dinner every night.',
      timestamp: '2025-01-10T14:15:00Z',
      read: true
    },
    {
      id: 3,
      sender: 'teacher',
      senderName: 'Mrs. Johnson',
      content: 'I wanted to let you know that Emma\'s essay on character development was outstanding. She demonstrated a deep understanding of the themes and used excellent textual evidence.',
      timestamp: '2025-01-08T16:45:00Z',
      read: true
    },
    {
      id: 4,
      sender: 'teacher',
      senderName: 'Mrs. Johnson',
      content: 'Reminder: The next assignment is due January 15th. Please ensure Emma has access to the required reading materials.',
      timestamp: '2025-01-07T09:00:00Z',
      read: false
    }
  ];

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

      {/* Message Thread */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Conversation with Mrs. Johnson</h2>
          <p className="text-sm text-gray-600">English Literature Teacher</p>
        </div>
        
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'parent' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.sender === 'parent' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      message.sender === 'parent' ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {message.senderName}
                    </span>
                    <span className={`text-xs ${
                      message.sender === 'parent' ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Unread Messages Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">New Assignment Posted</h4>
              <p className="text-sm text-gray-600">Mrs. Johnson posted a new reading assignment</p>
              <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Assignment Graded</h4>
              <p className="text-sm text-gray-600">Emma's essay has been graded and feedback is available</p>
              <p className="text-xs text-green-600 mt-1">Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;