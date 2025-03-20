import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Clock, Moon, Sun, Sunrise } from 'lucide-react';

const sessions = [
  {
    id: '1',
    title: 'Morning Mindfulness',
    duration: 10,
    icon: Sunrise,
    description: 'Start your day with clarity and purpose',
    recommendedAge: [18, 35],
    suitable: ['male', 'female', 'other'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '2',
    title: 'Afternoon Reset',
    duration: 15,
    icon: Sun,
    description: 'Recharge your energy mid-day',
    recommendedAge: [25, 50],
    suitable: ['male', 'female', 'other'],
    imageUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '3',
    title: 'Evening Calm',
    duration: 20,
    icon: Moon,
    description: 'Peaceful transition into night',
    recommendedAge: [20, 65],
    suitable: ['male', 'female', 'other'],
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000',
  },
];

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const [activeSession, setActiveSession] = React.useState<string | null>(null);
  const [timer, setTimer] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    let interval: number;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const startSession = (sessionId: string, duration: number) => {
    setActiveSession(sessionId);
    setTimer(duration * 60);
    setIsRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.email}</h1>
          <p className="text-gray-600">Choose your meditation session</p>
        </div>

        {activeSession ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <Clock className="w-16 h-16 text-indigo-600 mx-auto" />
              <div className="text-6xl font-bold mt-4">{formatTime(timer)}</div>
            </div>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => setActiveSession(null)}
              className="ml-4 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              End Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => {
              const Icon = session.icon;
              const isRecommended = 
                user &&
                user.age >= session.recommendedAge[0] &&
                user.age <= session.recommendedAge[1] &&
                session.suitable.includes(user.gender);

              return (
                <div
                  key={session.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 ${
                    isRecommended ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <img
                    src={session.imageUrl}
                    alt={session.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-500">
                        {session.duration} mins
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {session.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{session.description}</p>
                    <button
                      onClick={() => startSession(session.id, session.duration)}
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      Start Session
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}