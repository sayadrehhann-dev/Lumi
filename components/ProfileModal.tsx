import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSubmit: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSubmit, initialProfile }) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [educationLevel, setEducationLevel] = useState(initialProfile?.educationLevel || '');
  const [majorSubject, setMajorSubject] = useState(initialProfile?.majorSubject || '');
  const [learningGoal, setLearningGoal] = useState(initialProfile?.learningGoal || 'Understand Deeply');
  const [difficultyLevel, setDifficultyLevel] = useState(initialProfile?.difficultyLevel || 'Beginner');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && educationLevel && majorSubject && difficultyLevel) {
      onSubmit({ name, educationLevel, majorSubject, learningGoal, difficultyLevel });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xl z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-100 dark:border-white/10 animate-fade-in">
        <div className="bg-mint-500 px-8 py-10 text-center">
          <h2 className="text-slate-950 text-3xl font-black uppercase italic tracking-tight">My Profile</h2>
          <p className="text-slate-950/60 text-[10px] font-black uppercase tracking-widest mt-1">Update your learning settings</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          <div className="space-y-4">
            <FormGroup label="Your Name">
              <input type="text" required className="modal-input" placeholder="Alex" value={name} onChange={e => setName(e.target.value)} />
            </FormGroup>

            <div className="grid grid-cols-2 gap-4">
              <FormGroup label="School Level">
                <select className="modal-input" value={educationLevel} onChange={e => setEducationLevel(e.target.value)}>
                  <option value="Middle School">Middle School</option>
                  <option value="High School">High School</option>
                  <option value="College">College</option>
                  <option value="Expert">Advanced</option>
                </select>
              </FormGroup>
              <FormGroup label="Difficulty">
                <select className="modal-input" value={difficultyLevel} onChange={e => setDifficultyLevel(e.target.value)}>
                  <option value="Beginner">Easy</option>
                  <option value="Intermediate">Normal</option>
                  <option value="Advanced">Hard</option>
                </select>
              </FormGroup>
            </div>

            <FormGroup label="What are you studying?">
              <input type="text" required className="modal-input" placeholder="e.g. Science" value={majorSubject} onChange={e => setMajorSubject(e.target.value)} />
            </FormGroup>

            <FormGroup label="Main Goal">
              <select className="modal-input" value={learningGoal} onChange={e => setLearningGoal(e.target.value)}>
                <option value="Understand Deeply">Understand Deeply</option>
                <option value="Prepare for Exams">Prepare for Exams</option>
                <option value="Quick Review">Quick Review</option>
                <option value="Master the Topic">Master the Topic</option>
              </select>
            </FormGroup>
          </div>

          <div className="flex gap-4 pt-4">
            {onClose && (
              <button type="button" onClick={onClose} className="flex-1 px-6 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                Cancel
              </button>
            )}
            <button type="submit" className="flex-[2] bg-mint-500 hover:bg-mint-400 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-[10px]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .modal-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          outline: none;
          font-weight: 700;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        .dark .modal-input {
          background: #020617;
          border-color: #1e293b;
          color: white;
        }
        .modal-input:focus {
          border-color: #10b981;
        }
      `}</style>
    </div>
  );
};

const FormGroup = ({ label, children }: any) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {children}
  </div>
);

export default ProfileModal;