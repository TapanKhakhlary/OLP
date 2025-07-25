import React, { useState, useEffect } from 'react';
import { Video, Users, Calendar, Play, Square, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../../lib/queryClient';
import { useAuth } from '../../../contexts/AuthContext';

interface LiveSession {
  id: string;
  classId: string;
  meetingUrl?: string;
  isActive: boolean;
  startedAt?: string;
  endedAt?: string;
  platform: 'jitsi' | 'custom';
}

const LiveClassManager: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [classesData, sessionsData] = await Promise.all([
        apiRequest('/classes'),
        apiRequest('/live-sessions')
      ]);
      
      setClasses(Array.isArray(classesData) ? classesData : []);
      setLiveSessions(Array.isArray(sessionsData) ? sessionsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateJitsiUrl = (classId: string, className: string) => {
    const roomName = `litplatform-${classId}-${Date.now()}`;
    const encodedRoomName = encodeURIComponent(roomName);
    return `https://meet.jit.si/${encodedRoomName}`;
  };

  const handleStartLiveClass = async () => {
    if (!selectedClass) return;
    
    setIsStartingSession(true);
    try {
      const selectedClassData = classes.find(c => c.id === selectedClass);
      const meetingUrl = generateJitsiUrl(selectedClass, selectedClassData?.name || 'Class');
      
      const session = await apiRequest('/live-sessions', {
        method: 'POST',
        body: JSON.stringify({
          classId: selectedClass,
          meetingUrl,
          platform: 'jitsi'
        })
      });

      setLiveSessions(prev => [...prev, session]);
      
      // Open meeting in new tab
      window.open(meetingUrl, '_blank');
      
      // Notify students (would need WebSocket implementation)
      await notifyStudents(selectedClass, meetingUrl);
      
    } catch (error) {
      console.error('Error starting live class:', error);
      alert('Failed to start live class. Please try again.');
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleEndLiveClass = async (sessionId: string) => {
    try {
      await apiRequest(`/live-sessions/${sessionId}/end`, {
        method: 'PUT'
      });
      
      setLiveSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, isActive: false, endedAt: new Date().toISOString() }
            : session
        )
      );
    } catch (error) {
      console.error('Error ending live class:', error);
      alert('Failed to end live class. Please try again.');
    }
  };

  const notifyStudents = async (classId: string, meetingUrl: string) => {
    try {
      // Create announcement about live class
      await apiRequest('/announcements', {
        method: 'POST',
        body: JSON.stringify({
          classId,
          content: `🔴 LIVE CLASS STARTED! Join now: ${meetingUrl}`,
          type: 'live_class'
        })
      });
    } catch (error) {
      console.error('Error notifying students:', error);
    }
  };

  const getActiveSessions = () => liveSessions.filter(session => session.isActive);
  const getRecentSessions = () => liveSessions.filter(session => !session.isActive).slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Classes</h1>
        <p className="text-gray-600">Start and manage live video sessions with your students</p>
      </div>

      {/* Start New Live Class */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Start Live Class</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a class...</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.subject})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
              Jitsi Meet (Free)
            </div>
          </div>
          
          <button
            onClick={handleStartLiveClass}
            disabled={!selectedClass || isStartingSession}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Play className="h-5 w-5" />
            <span>{isStartingSession ? 'Starting...' : 'Start Live Class'}</span>
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• A Jitsi Meet room will be created automatically</li>
                <li>• Students will receive a notification with the meeting link</li>
                <li>• The meeting will open in a new tab for you to moderate</li>
                <li>• Remember to end the session when class is finished</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      {getActiveSessions().length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span>Active Live Classes</span>
          </h2>
          
          <div className="space-y-4">
            {getActiveSessions().map(session => {
              const sessionClass = classes.find(c => c.id === session.classId);
              return (
                <div key={session.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {sessionClass?.name || 'Unknown Class'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Started: {new Date(session.startedAt!).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{sessionClass?.studentCount || 0} students</span>
                        </div>
                      </div>
                      
                      {session.meetingUrl && (
                        <a
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Open Meeting</span>
                        </a>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleEndLiveClass(session.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                    >
                      <Square className="h-4 w-4" />
                      <span>End Class</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Live Classes</h2>
        
        {getRecentSessions().length === 0 ? (
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No live classes yet</h3>
            <p className="text-gray-600">Start your first live class with your students</p>
          </div>
        ) : (
          <div className="space-y-4">
            {getRecentSessions().map(session => {
              const sessionClass = classes.find(c => c.id === session.classId);
              const duration = session.endedAt && session.startedAt 
                ? Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)
                : 0;
              
              return (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {sessionClass?.name || 'Unknown Class'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(session.startedAt!).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{duration} minutes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Video className="h-4 w-4" />
                          <span>{session.platform}</span>
                        </div>
                      </div>
                    </div>
                    
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      Completed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClassManager;