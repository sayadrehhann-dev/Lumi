import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onSubmit: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onSubmit, initialProfile }) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [educationLevel, setEducationLevel] = useState(initialProfile?.educationLevel || '');
  const [majorSubject, setMajorSubject] = useState(initialProfile?.majorSubject || '');
  const [learningGoal, setLearningGoal] = useState(initialProfile?.learningGoal || '');
  const [difficultyLevel, setDifficultyLevel] = useState(initialProfile?.difficultyLevel || 'Beginner');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && educationLevel && majorSubject && difficultyLevel) {
      onSubmit({ name, educationLevel, majorSubject, learningGoal, difficultyLevel });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-white text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.516 51.33 51.33 0 00-2.658.813m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
            Student Profile
          </h2>
          <p className="text-indigo-100 text-sm mt-1">Help me tailor my teaching to your needs.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="e.g. Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
              >
                <option value="">Select Level</option>
                <option value="Middle School">Middle School</option>
                <option value="High School">High School / GCSE</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject of Interest / Major</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="e.g. Computer Science, History, Physics"
              value={majorSubject}
              onChange={(e) => setMajorSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Learning Goal (Optional)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="e.g. Prepare for finals, Learn intuitively"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md active:transform active:scale-[0.98]"
          >
            Start Learning Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
