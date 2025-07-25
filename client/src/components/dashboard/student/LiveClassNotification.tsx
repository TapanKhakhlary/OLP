import React, { useState, useEffect } from 'react';
import { Video, ExternalLink, Clock, X, Volume2 } from 'lucide-react';
import { apiRequest } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

interface LiveClassNotificationProps {
  onClose: () => void;
}

const LiveClassNotification: React.FC<LiveClassNotificationProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActiveLiveClasses();
      
      // Poll for active live classes every 30 seconds
      const interval = setInterval(fetchActiveLiveClasses, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchActiveLiveClasses = async () => {
    try {
      // Get student's enrolled classes first
      const enrollments = await apiRequest('/student/classes');
      const classIds = enrollments.map((e: any) => e.classId);
      
      if (classIds.length === 0) {
        setLoading(false);
        return;
      }

      // Check for active live sessions in enrolled classes
      const sessions = await apiRequest('/live-sessions/active');
      const activeSessions = Array.isArray(sessions) 
        ? sessions.filter((session: any) => classIds.includes(session.classId))
        : [];
      
      setLiveClasses(activeSessions);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = (meetingUrl: string) => {
    window.open(meetingUrl, '_blank');
    onClose();
  };

  const playNotificationSound = () => {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Play sound when new live class appears
  useEffect(() => {
    if (liveClasses.length > 0 && !loading) {
      playNotificationSound();
    }
  }, [liveClasses.length, loading]);

  if (loading || liveClasses.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {liveClasses.map((session, index) => (
        <div
          key={session.id}
          className="bg-white border-l-4 border-red-500 rounded-lg shadow-lg p-4 mb-4 animate-pulse"
          style={{ animationDuration: '2s' }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-red-100 rounded-full">
                <Video className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-sm font-semibold text-red-600">LIVE CLASS</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-1">
              {session.class?.name || 'Live Class'}
            </h3>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              <span>Started: {new Date(session.startedAt).toLocaleTimeString()}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Your teacher has started a live class session
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleJoinClass(session.meetingUrl)}
              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center space-x-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Join Now</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Later
            </button>
          </div>

          {index === 0 && (
            <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500">
              <Volume2 className="h-3 w-3" />
              <span>Click the speaker icon in your browser to enable sound notifications</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LiveClassNotification;