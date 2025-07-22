import React, { useState } from 'react';
import { Send, MessageSquare, Users, User, Bell } from 'lucide-react';

const MessageCenter: React.FC = () => {
  const [messageForm, setMessageForm] = useState({
    recipient: 'all-students',
    subject: '',
    message: '',
    type: 'message' // 'message', 'announcement', 'notification'
  });

  const [messages] = useState([
    {
      id: 1,
      type: 'sent',
      recipient: 'All Students - Math 101',
      subject: 'Assignment Due Tomorrow',
      message: 'Reminder: Your essay on Shakespeare is due tomorrow at 11:59 PM.',
      timestamp: '2 hours ago',
      read: true
    },
    {
      id: 2,
      type: 'received',
      sender: 'Parent - Sarah Johnson',
      subject: 'Question about homework',
      message: 'Hi, I wanted to ask about the reading assignment for this week.',
      timestamp: '1 day ago',
      read: false
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.subject.trim() || !messageForm.message.trim()) return;

    // In a real app, this would send the message
    console.log('Sending message:', messageForm);
    alert('Message sent successfully!');
    
    setMessageForm({
      recipient: 'all-students',
      subject: '',
      message: '',
      type: 'message'
    });
  };

  const sendParentUpdate = (studentName: string, update: string) => {
    // In a real app, this would send an update to parents
    console.log(`Sending update about ${studentName}: ${update}`);
    alert(`Update sent to ${studentName}'s parents!`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Message Center</h1>
        <p className="text-gray-600">Communicate with students and parents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send Message */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Send className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Send Message</h2>
          </div>
          
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Type
              </label>
              <select
                value={messageForm.type}
                onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="message">Regular Message</option>
                <option value="announcement">Class Announcement</option>
                <option value="notification">Important Notification</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients
              </label>
              <select
                value={messageForm.recipient}
                onChange={(e) => setMessageForm({ ...messageForm, recipient: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all-students">All Students</option>
                <option value="all-parents">All Parents</option>
                <option value="class-math101">Math 101 Class</option>
                <option value="class-eng102">English 102 Class</option>
                <option value="individual">Individual Student/Parent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={messageForm.subject}
                onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Message subject"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={messageForm.message}
                onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Type your message here..."
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
          </div>
          
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 border rounded-lg ${
                  message.read ? 'border-gray-200' : 'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {message.type === 'sent' ? (
                      <Users className="h-4 w-4 text-blue-600" />
                    ) : (
                      <User className="h-4 w-4 text-green-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {message.type === 'sent' ? message.recipient : message.sender}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{message.subject}</h4>
                <p className="text-sm text-gray-600">{message.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parent Updates Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Bell className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Quick Parent Updates</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sample students for parent updates */}
          {[
            { name: 'Emma Wilson', status: 'excellent', note: 'Great participation in class discussions' },
            { name: 'James Smith', status: 'concern', note: 'Missing recent assignments' },
            { name: 'Sofia Garcia', status: 'good', note: 'Showing improvement in reading comprehension' }
          ].map((student, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">{student.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{student.note}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => sendParentUpdate(student.name, 'Positive update: ' + student.note)}
                  className="flex-1 bg-green-100 text-green-700 py-1 px-2 rounded text-xs hover:bg-green-200 transition-colors"
                >
                  Share Good News
                </button>
                <button
                  onClick={() => sendParentUpdate(student.name, 'Concern: ' + student.note)}
                  className="flex-1 bg-yellow-100 text-yellow-700 py-1 px-2 rounded text-xs hover:bg-yellow-200 transition-colors"
                >
                  Share Concern
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;