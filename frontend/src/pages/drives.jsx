import React, { useState, useEffect } from 'react';
import API from '../api';
import Link from 'next/link';
import { useModal } from '../context/ModalContext';

export default function DrivesPage() {
  const { openLogin } = useModal();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    skills: [],
    availability: 'Weekends'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [drives, setDrives] = useState([]);

  const skillOptions = ["Teaching", "Social Media", "Event Management", "Fundraising", "Graphic Design"];

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await API.get('/drives');
      setDrives(response.data);
    } catch (err) {
      console.error('Error fetching drives:', err);
    }
  };

  const activeDrivesMock = [
    {
      id: "food",
      title: "Slum Nutritious Food Drive",
      description: "Distributing hot, freshly prepared nutritious meals to homeless families and children in local slums.",
      icon: "🍲",
      color: "border-amber-500/30 bg-slate-900 text-amber-300",
      textColor: "text-amber-400 border-amber-500/20",
      tag: "Food Security"
    },
    {
      id: "pads",
      title: "Pad Kranti Sanitary Drive",
      description: "Distributing eco-friendly sanitary pads to women in rural areas and conducting menstrual hygiene awareness camps.",
      icon: "🌸",
      color: "border-rose-500/30 bg-slate-900 text-rose-300",
      textColor: "text-rose-400 border-rose-500/20",
      tag: "Women Health"
    },
    {
      id: "edu",
      title: "Pathshala Education Program",
      description: "Conducting weekend basic literacy classes and providing books, bags, and writing materials to underprivileged children.",
      icon: "📚",
      color: "border-emerald-500/30 bg-slate-900 text-emerald-300",
      textColor: "text-emerald-400 border-emerald-500/20",
      tag: "Education"
    },
    {
      id: "clothes",
      title: "Winter Shield Clothing Drive",
      description: "Collecting and distributing sweaters, blankets, and clean clothes to street dwellers before winter peaks.",
      icon: "🧥",
      color: "border-sky-500/30 bg-slate-900 text-sky-300",
      textColor: "text-sky-400 border-sky-500/20",
      tag: "Basic Needs"
    }
  ];

  const activeDrives = drives.length > 0 ? drives.map(d => ({
    id: d._id,
    title: d.title,
    description: d.description,
    icon: d.icon || '🍲',
    tag: d.tag,
    color: d.colorTheme === 'amber' ? 'border-amber-500/30 bg-slate-900 text-amber-300' :
           d.colorTheme === 'rose' ? 'border-rose-500/30 bg-slate-900 text-rose-300' :
           d.colorTheme === 'sky' ? 'border-sky-500/30 bg-slate-900 text-sky-300' :
           'border-emerald-500/30 bg-slate-900 text-emerald-300',
    textColor: d.colorTheme === 'amber' ? 'text-amber-400 border-amber-500/20' :
               d.colorTheme === 'rose' ? 'text-rose-400 border-rose-500/20' :
               d.colorTheme === 'sky' ? 'text-sky-400 border-sky-500/20' :
               'text-emerald-400 border-emerald-500/20'
  })) : activeDrivesMock;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (skill) => {
    const updatedSkills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      setLoading(false);
      return;
    }

    if (formData.skills.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one core skill.' });
      setLoading(false);
      return;
    }

    try {
      const response = await API.post('/volunteers/register', formData);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Application submitted successfully! Welcome to NayePankh.' });
        setFormData({ name: '', email: '', password: '', phone: '', skills: [], availability: 'Weekends' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Something went wrong. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-300">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">Volunteer Portal</span>
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight mt-3">Active Volunteer Drives</h1>
        <p className="text-slate-450 mt-3 text-base text-slate-400">
          NayePankh Foundation conducts regular drives to uplift rural and slum communities. Join us as a volunteer in one of our core initiatives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Drives Grid - Left (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-900 pb-3">Our Ongoing Campaigns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeDrives.map((drive) => (
              <div 
                key={drive.id} 
                className={`p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/[0.02] hover:border-slate-700 ${drive.color}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-3xl">{drive.icon}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/60 border ${drive.textColor}`}>
                    {drive.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mt-4">{drive.title}</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">{drive.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl mt-4">
            <h4 className="font-bold text-slate-200 text-sm">💡 How Volunteering Works:</h4>
            <ul className="text-slate-400 text-xs space-y-2.5 mt-3 list-disc list-inside">
              <li>Fill out the registration form on the right.</li>
              <li>Select your core skill set so we can align you with the right drive.</li>
              <li>Our team will verify your application and send joining invites.</li>
              <li>Attend briefings and participate in drives on weekends or weekdays based on your availability.</li>
            </ul>
          </div>
        </div>

        {/* Registration Form Card - Right (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden sticky top-24">
          <div className="bg-slate-950 px-6 py-5 flex justify-between items-center border-b border-slate-850">
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">Register as a Volunteer</h3>
              <p className="text-slate-500 text-xs mt-0.5">Start your journey with us</p>
            </div>
            <button 
              type="button"
              onClick={openLogin}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/25 hover:border-emerald-500 px-3 py-1.5 rounded-lg whitespace-nowrap bg-transparent cursor-pointer"
            >
              Portal Login →
            </button>
          </div>

          <div className="p-6">
            {message.text && (
              <div className={`p-4 mb-5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                message.type === 'success' 
                  ? 'bg-emerald-950/30 text-emerald-300 border-l-4 border-emerald-500' 
                  : 'bg-rose-950/30 text-rose-300 border-l-4 border-rose-500'
              }`}>
                {message.type === 'success' ? '🏆 ' : '⚠️ '}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-1 text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs text-slate-100 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-1 text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="johndoe@example.com"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs text-slate-100 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-1 text-slate-400">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="•••••••• (Min. 6 characters)"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs text-slate-100 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-1 text-slate-400">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs text-slate-100 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-1 text-slate-400">Core Skills</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {skillOptions.map(skill => {
                    const isSelected = formData.skills.includes(skill);
                    return (
                      <label 
                        key={skill} 
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer select-none transition-all ${
                          isSelected 
                            ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 font-semibold' 
                            : 'bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-400'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected} 
                          onChange={() => handleCheckboxChange(skill)}
                          className="w-3.5 h-3.5 rounded text-emerald-550 border-slate-700 focus:ring-emerald-500 accent-emerald-500"
                        />
                        <span className="text-[11px]">{skill}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-1 text-slate-400">Availability Profile</label>
                <select 
                  name="availability" 
                  value={formData.availability} 
                  onChange={handleInputChange} 
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs text-slate-100"
                >
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2.5 mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md hover:shadow-emerald-500/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
