import React, { useEffect, useState } from 'react';
import API from '../../api';
import { useRouter } from 'next/router';
import { useModal } from '../../context/ModalContext';

export default function VolunteerDashboard() {
  const { logout } = useModal();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drives, setDrives] = useState([]);
  const [skillFilter, setSkillFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Default');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'volunteer') {
      localStorage.clear();
      router.push('/login');
    } else {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/volunteers/profile');
      setProfile(res.data);
      if (res.data.status === 'Approved') {
        fetchDrives();
      }
      setLoading(false);
    } catch (err) {
      handleLogout();
    }
  };

  const fetchDrives = async () => {
    try {
      const res = await API.get('/drives');
      setDrives(res.data);
    } catch (err) {
      console.error('Error fetching drives:', err);
    }
  };

  const handleJoinDrive = async (driveId) => {
    try {
      const response = await API.post(`/drives/${driveId}/join`);
      if (response.data.success) {
        setDrives(drives.map(d => d._id === driveId ? response.data.data : d));
        alert('Thank you for volunteering! Your participation has been recorded.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to volunteer for this drive.');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-350">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-850 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-medium">Loading Volunteer Profile...</p>
        </div>
      </div>
    );
  }

  const getStatusCard = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <div className="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-2xl shadow-sm text-emerald-300 space-y-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              🎉 Application Approved
            </h3>
            <p className="text-sm text-emerald-400/90 leading-relaxed">
              Congratulations! Your application has been approved. You are now an active volunteer at NayePankh Foundation. Our city coordinators will get in touch with you shortly via Email or WhatsApp to invite you to upcoming community drives.
            </p>
          </div>
        );
      case 'Rejected':
        return (
          <div className="bg-rose-950/20 border border-rose-900/50 p-6 rounded-2xl shadow-sm text-rose-300 space-y-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              ⚠️ Application Status Update
            </h3>
            <p className="text-sm text-rose-400/90 leading-relaxed">
              Thank you for applying. We regret to inform you that we cannot proceed with your profile at this time due to high volume or regional coordinator constraints. We appreciate your support and interest in NayePankh Foundation.
            </p>
          </div>
        );
      default:
        return (
          <div className="bg-amber-950/20 border border-amber-900/50 p-6 rounded-2xl shadow-sm text-amber-300 space-y-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              ⏳ Review In Progress
            </h3>
            <p className="text-sm text-amber-400/90 leading-relaxed">
              Your application is currently under review by our operations team. We are verifying your details and alignment with local campaigns. You will receive an email update once your application status changes.
            </p>
          </div>
        );
    }
  };

  const getMatchScore = (driveSkills) => {
    if (!profile || !profile.skills) return 0;
    const matching = driveSkills.filter(skill => profile.skills.includes(skill));
    return matching.length;
  };

  const filteredDrives = drives.filter(drive => {
    if (skillFilter === 'All') return true;
    return drive.skills.includes(skillFilter);
  });

  const sortedDrives = [...filteredDrives].sort((a, b) => {
    if (sortOption === 'Best Match') {
      return getMatchScore(b.skills) - getMatchScore(a.skills);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-350">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Volunteer Portal</h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back, <span className="font-semibold text-slate-300">{profile?.name}</span>
          </p>
        </div>
        <button 
          onClick={handleLogout} 
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shadow-md hover:shadow-rose-500/10 transition-all text-sm w-full sm:w-auto"
        >
          Logout
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Status Area - Left (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <h2 className="text-xl font-bold text-slate-100 border-b border-slate-900 pb-3">Application Status</h2>
          {profile && getStatusCard(profile.status)}

          {profile?.status === 'Approved' && (
            <div className="space-y-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-3">
                <h2 className="text-xl font-bold text-slate-100">Participate in Ongoing Drives</h2>
                <div className="flex items-center gap-2">
                  <select 
                    value={skillFilter} 
                    onChange={(e) => setSkillFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="All">All Skills</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Event Management">Event Management</option>
                    <option value="Fundraising">Fundraising</option>
                    <option value="Graphic Design">Graphic Design</option>
                  </select>
                  <select 
                    value={sortOption} 
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Default">Default Sort</option>
                    <option value="Best Match">Best Match</option>
                  </select>
                </div>
              </div>

              {sortedDrives.length === 0 ? (
                <div className="bg-slate-900/40 border border-slate-850 p-8 rounded-2xl text-center text-slate-500 text-sm">
                  No active drives match the selected skill filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {sortedDrives.map(drive => {
                    const matchCount = getMatchScore(drive.skills);
                    const hasVolunteered = drive.volunteers && drive.volunteers.some(v => {
                      const vId = typeof v === 'object' && v !== null ? v._id : v;
                      return vId === profile?._id;
                    });
                    return (
                      <div 
                        key={drive._id}
                        className={`p-5 rounded-2xl border-2 border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all duration-200 relative ${
                          matchCount > 0 && sortOption === 'Best Match' ? 'ring-2 ring-emerald-500/20' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{drive.icon || '🍲'}</span>
                            <div>
                              <h3 className="font-bold text-slate-100 text-base">{drive.title}</h3>
                              <span className="text-[10px] text-slate-500">Category: {drive.tag}</span>
                            </div>
                          </div>
                          
                          {matchCount > 0 && (
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                              Matches {matchCount} Skill{matchCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                          {drive.description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-850">
                          {/* Required Skills list */}
                          <div className="flex flex-wrap gap-1.5 flex-1">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1 mt-1">Required Skills:</span>
                            {drive.skills.map(skill => {
                              const isUserSkill = profile?.skills.includes(skill);
                              return (
                                <span 
                                  key={skill}
                                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${
                                    isUserSkill 
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                      : 'bg-slate-950 text-slate-500 border-slate-850'
                                  }`}
                                >
                                  {skill} {isUserSkill && '✓'}
                                </span>
                              );
                            })}
                          </div>
                          
                          {/* Participation Button */}
                          <div className="shrink-0 mt-2 sm:mt-0">
                            {hasVolunteered ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-450 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                ✓ Registered
                              </span>
                            ) : (
                              <button
                                onClick={() => handleJoinDrive(drive._id)}
                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl shadow hover:shadow-emerald-500/10 transition-all cursor-pointer border-0"
                              >
                                Volunteer for Drive
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h4 className="font-bold text-slate-200 text-sm">🗓️ General Guidelines:</h4>
            <ul className="text-slate-400 text-xs space-y-2 list-disc list-inside">
              <li>Ensure your phone number is active on WhatsApp for coordinator updates.</li>
              <li>You can update your profile skills by contacting support.</li>
              <li>Volunteering certificates will be issued post-drive validation.</li>
            </ul>
          </div>
        </div>

        {/* Profile Card - Right (5 cols) */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-100 border-b border-slate-850 pb-3">Registered Profile</h3>
          
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-500 block uppercase tracking-wider font-bold">Full Name</span>
              <span className="text-slate-200 text-sm font-semibold block mt-0.5">{profile?.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider font-bold">Email Address</span>
              <span className="text-slate-200 text-sm font-semibold block mt-0.5">{profile?.email}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider font-bold">Phone Number</span>
              <span className="text-slate-200 text-sm font-semibold block mt-0.5">{profile?.phone}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider font-bold">Availability</span>
              <span className="text-slate-200 text-sm font-semibold block mt-0.5">{profile?.availability}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider font-bold mb-1.5">Identified Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {profile?.skills.map(s => (
                  <span 
                    key={s} 
                    className="bg-slate-950 text-slate-400 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border border-slate-850"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
