import React, { useEffect, useState } from 'react';
import API from '../../api';
import { useRouter } from 'next/router';
import { useModal } from '../../context/ModalContext';

export default function DashboardPage() {
  const { logout } = useModal();
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' or 'campaigns'
  const [volunteers, setVolunteers] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [drives, setDrives] = useState([]);
  const [driveForm, setDriveForm] = useState({
    title: '',
    description: '',
    skills: [],
    tag: 'Food Security',
    icon: '🍲',
    colorTheme: 'emerald'
  });
  const [editingDriveId, setEditingDriveId] = useState(null);
  const [driveMessage, setDriveMessage] = useState('');
  const router = useRouter();

  const skillOptions = ["Teaching", "Social Media", "Event Management", "Fundraising", "Graphic Design"];

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const name = localStorage.getItem('adminName');
    if (!token) {
      router.push('/login');
    } else {
      setAdminName(name || 'Admin');
      fetchVolunteers();
      fetchDrives();
    }
  }, []);

  const fetchVolunteers = async () => {
    try {
      const res = await API.get('/volunteers');
      setVolunteers(res.data);
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

  const handleDriveSubmit = async (e) => {
    e.preventDefault();
    setDriveMessage('');
    try {
      if (editingDriveId) {
        const res = await API.put(`/drives/${editingDriveId}`, driveForm);
        setDrives(drives.map(d => d._id === editingDriveId ? res.data.data : d));
        setDriveMessage('Campaign updated successfully!');
        setEditingDriveId(null);
      } else {
        const res = await API.post('/drives', driveForm);
        setDrives([res.data.data, ...drives]);
        setDriveMessage('Campaign created successfully!');
      }
      setDriveForm({
        title: '',
        description: '',
        skills: [],
        tag: 'Food Security',
        icon: '🍲',
        colorTheme: 'emerald'
      });
    } catch (err) {
      setDriveMessage(err.response?.data?.message || 'Failed to save campaign');
    }
  };

  const handleDriveCheckboxChange = (skill) => {
    const updatedSkills = driveForm.skills.includes(skill)
      ? driveForm.skills.filter(s => s !== skill)
      : [...driveForm.skills, skill];
    setDriveForm({ ...driveForm, skills: updatedSkills });
  };

  const handleEditDrive = (drive) => {
    setEditingDriveId(drive._id);
    setDriveForm({
      title: drive.title,
      description: drive.description,
      skills: drive.skills || [],
      tag: drive.tag,
      icon: drive.icon || '🍲',
      colorTheme: drive.colorTheme || 'emerald'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDrive = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await API.delete(`/drives/${id}`);
      setDrives(drives.filter(d => d._id !== id));
    } catch (err) {
      alert('Failed to delete campaign');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const confirmMessage = newStatus === 'Approved'
      ? 'Are you sure you want to approve this volunteer application?'
      : 'Are you sure you want to reject this volunteer application?';
    if (!window.confirm(confirmMessage)) return;

    try {
      await API.put(`/volunteers/${id}`, { status: newStatus });
      setVolunteers(volunteers.map(v => v._id === id ? { ...v, status: newStatus } : v));
    } catch (err) {
      alert('Failed to execute status update operation.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to completely erase this record?')) return;
    try {
      await API.delete(`/volunteers/${id}`);
      setVolunteers(volunteers.filter(v => v._id !== id));
    } catch (err) {
      alert('Failed executing record purge pipeline.');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const downloadCSVReport = () => {
    if (volunteers.length === 0) return alert('No volunteer data available to export!');
    
    const headers = ['Full Name', 'Email', 'Phone', 'Skills Identified', 'Availability Profile', 'Review Status', 'Applied On Date'];
    const rows = volunteers.map(v => [
      `"${v.name}"`,
      `"${v.email}"`,
      `"${v.phone}"`,
      `"${v.skills.join(', ')}"`,
      `"${v.availability}"`,
      `"${v.status}"`,
      `"${new Date(v.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NayePankh_Volunteers_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metric Helpers
  const totalCount = volunteers.length;
  const pendingCount = volunteers.filter(v => v.status === 'Pending').length;
  const approvedCount = volunteers.filter(v => v.status === 'Approved').length;
  const rejectedCount = volunteers.filter(v => v.status === 'Rejected').length;

  // Filter & Search Logic
  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-300">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-850 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-medium">Loading NayePankh Registry Grid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-slate-300">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Volunteer Intake Registry</h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back, <span className="font-semibold text-slate-300">{adminName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadCSVReport} 
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-md hover:shadow-emerald-500/10 transition-all text-sm"
          >
            📥 Generate CSV Report
          </button>
          <button 
            onClick={handleLogout} 
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shadow-md hover:shadow-rose-500/10 transition-all text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-900 mb-8 gap-6 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('registry')}
          className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'registry' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          📋 Volunteer Registry
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'campaigns' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          🍲 Manage Campaign Drives
        </button>
      </div>

      {activeTab === 'registry' ? (
        <>
          {/* Metrics Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Applicants</span>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">{totalCount}</h3>
            </div>
            <div className="bg-amber-950/20 border border-amber-900/40 p-5 rounded-2xl shadow-sm">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Pending Review</span>
              <h3 className="text-3xl font-extrabold text-amber-300 mt-1">{pendingCount}</h3>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-900/40 p-5 rounded-2xl shadow-sm">
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Approved Volunteers</span>
              <h3 className="text-3xl font-extrabold text-emerald-300 mt-1">{approvedCount}</h3>
            </div>
            <div className="bg-rose-950/20 border border-rose-900/40 p-5 rounded-2xl shadow-sm">
              <span className="text-rose-400 text-xs font-bold uppercase tracking-wider">Rejected Applications</span>
              <h3 className="text-3xl font-extrabold text-rose-300 mt-1">{rejectedCount}</h3>
            </div>
          </div>

          {/* Filters & Control Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search by name, email, or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-200 placeholder-slate-500"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === status 
                      ? 'bg-emerald-600 border-emerald-550 text-white shadow-sm' 
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Database Applicants Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-350 text-xs font-bold uppercase tracking-wider border-b border-slate-850">
                    <th className="p-4 pl-6">Applicant Name</th>
                    <th className="p-4">Contact Details</th>
                    <th className="p-4">Target Skills</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredVolunteers.map(v => (
                    <tr 
                      key={v._id} 
                      className={`hover:bg-slate-800/40 transition-colors ${
                        v.status === 'Approved' 
                          ? 'bg-emerald-950/[0.04]' 
                          : v.status === 'Rejected' 
                            ? 'bg-rose-950/[0.04]' 
                            : 'bg-slate-900'
                      }`}
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-850 flex items-center justify-center font-bold text-slate-300 uppercase border border-slate-800">
                            {v.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-200">{v.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs space-y-1">
                        <div className="text-slate-400 flex items-center gap-1.5">
                          <span>📧</span> 
                          <a href={`mailto:${v.email}`} className="hover:text-emerald-400 underline transition-colors">{v.email}</a>
                        </div>
                        <div className="text-slate-400 flex items-center gap-1.5">
                          <span>📞</span> 
                          <a href={`tel:${v.phone}`} className="hover:text-emerald-400 underline transition-colors">{v.phone}</a>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {v.skills.map(s => (
                            <span 
                              key={s} 
                              className="bg-slate-950 text-slate-400 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border border-slate-850"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-400 font-medium">{v.availability}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none border ${
                          v.status === 'Approved' 
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' 
                            : v.status === 'Rejected' 
                              ? 'bg-rose-950/40 text-rose-400 border-rose-900/30' 
                              : 'bg-amber-950/40 text-amber-400 border-amber-900/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            v.status === 'Approved' 
                              ? 'bg-emerald-400' 
                              : v.status === 'Rejected' 
                                ? 'bg-rose-400' 
                                : 'bg-amber-400'
                          }`}></span>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center gap-2 justify-center">
                          <button 
                            onClick={() => handleStatusChange(v._id, 'Approved')} 
                            disabled={v.status === 'Approved'} 
                            className="px-3 py-1.5 bg-emerald-650 hover:bg-emerald-550 disabled:opacity-30 disabled:hover:bg-emerald-650 text-white rounded text-xs font-bold transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatusChange(v._id, 'Rejected')} 
                            disabled={v.status === 'Rejected'} 
                            className="px-3 py-1.5 bg-rose-650 hover:bg-rose-550 disabled:opacity-30 disabled:hover:bg-rose-650 text-white rounded text-xs font-bold transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleDelete(v._id)} 
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900/30 rounded transition-all cursor-pointer"
                            title="Delete record permanently"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredVolunteers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-500 text-sm font-medium">
                        No matching candidate records found within the registry.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Campaign Form (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 border-b border-slate-850 pb-2">
              {editingDriveId ? '✏️ Edit Campaign' : '➕ Add New Campaign'}
            </h3>
            
            {driveMessage && (
              <div className="p-3 text-xs font-semibold rounded-lg bg-emerald-950/30 text-emerald-300 border-l-4 border-emerald-500">
                {driveMessage}
              </div>
            )}

            <form onSubmit={handleDriveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Campaign Title</label>
                <input 
                  type="text" 
                  value={driveForm.title}
                  onChange={(e) => setDriveForm({ ...driveForm, title: e.target.value })}
                  required
                  placeholder="e.g. Weekend Pathshala Drive"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Description</label>
                <textarea 
                  value={driveForm.description}
                  onChange={(e) => setDriveForm({ ...driveForm, description: e.target.value })}
                  required
                  rows="4"
                  placeholder="Describe the campaign objectives, timings, and location..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Category Tag</label>
                <select 
                  value={driveForm.tag}
                  onChange={(e) => setDriveForm({ ...driveForm, tag: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
                >
                  <option value="Food Security">Food Security</option>
                  <option value="Women Health">Women Health</option>
                  <option value="Education">Education</option>
                  <option value="Basic Needs">Basic Needs</option>
                  <option value="Community Support">Community Support</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Representative Icon</label>
                  <select 
                    value={driveForm.icon}
                    onChange={(e) => setDriveForm({ ...driveForm, icon: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
                  >
                    <option value="🍲">🍲 Meal Bowl</option>
                    <option value="🌸">🌸 Sanitary Flower</option>
                    <option value="📚">📚 Books</option>
                    <option value="🧥">🧥 Clothes</option>
                    <option value="📢">📢 Megaphone</option>
                    <option value="💻">💻 Laptop/Tech</option>
                    <option value="✨">✨ Sparkles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Color Theme</label>
                  <select 
                    value={driveForm.colorTheme}
                    onChange={(e) => setDriveForm({ ...driveForm, colorTheme: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200"
                  >
                    <option value="emerald">Emerald (Green)</option>
                    <option value="amber">Amber (Yellow/Orange)</option>
                    <option value="rose">Rose (Red/Pink)</option>
                    <option value="sky">Sky (Blue)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Required Skills</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {skillOptions.map(skill => {
                    const isSelected = driveForm.skills.includes(skill);
                    return (
                      <label 
                        key={skill} 
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer select-none transition-all ${
                          isSelected 
                            ? 'bg-emerald-950/20 border-emerald-500 text-emerald-300 font-semibold' 
                            : 'bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-500'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected} 
                          onChange={() => handleDriveCheckboxChange(skill)}
                          className="w-3.5 h-3.5 rounded text-emerald-555 border-slate-700 focus:ring-emerald-500 accent-emerald-500"
                        />
                        <span className="text-[10px]">{skill}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md hover:shadow-emerald-500/10 transition-all cursor-pointer border-0"
                >
                  {editingDriveId ? 'Update Campaign' : 'Create Campaign'}
                </button>
                {editingDriveId && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingDriveId(null);
                      setDriveForm({
                        title: '',
                        description: '',
                        skills: [],
                        tag: 'Food Security',
                        icon: '🍲',
                        colorTheme: 'emerald'
                      });
                    }}
                    className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800 font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Campaign list (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 border-b border-slate-900 pb-2">
              Active Campaigns ({drives.length})
            </h3>

            {drives.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-sm font-medium">
                No active campaign drives found. Use the form on the left to add one!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {drives.map(drive => (
                  <div 
                    key={drive._id}
                    className="p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors flex justify-between gap-4 items-start text-xs"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{drive.icon || '🍲'}</span>
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm">{drive.title}</h4>
                          <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-0.5 bg-slate-950 border border-slate-800 text-slate-400`}>
                            {drive.tag}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-400 text-xs leading-relaxed">{drive.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {drive.skills.map(skill => (
                          <span 
                            key={skill}
                            className="bg-slate-950 text-slate-400 border border-slate-850 px-2 py-0.5 rounded-full text-[9px] font-semibold text-slate-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Volunteers Roster */}
                      <div className="mt-4 pt-3 border-t border-slate-850 space-y-1.5 w-full">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                          🙋 Signed Up Volunteers ({drive.volunteers?.length || 0})
                        </span>
                        {drive.volunteers && drive.volunteers.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2 mt-1.5">
                            {drive.volunteers.map(v => (
                              <div key={v._id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-850/60 flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 text-[11px] text-slate-400">
                                <div>
                                  <strong className="text-slate-200">{v.name}</strong>
                                  <span className="text-[10px] text-slate-500 ml-1.5">({v.availability})</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-[10px]">
                                  <span>📧 {v.email}</span>
                                  <span>📞 {v.phone}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500 italic mt-1">No volunteers have registered for this drive yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        onClick={() => handleEditDrive(drive)}
                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/20 border border-slate-800 hover:border-emerald-900/30 rounded-lg transition-all cursor-pointer"
                        title="Edit Campaign"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteDrive(drive._id)}
                        className="p-2 text-slate-400 hover:text-rose-455 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/30 rounded-lg transition-all cursor-pointer"
                        title="Delete Campaign"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}