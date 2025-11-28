import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { AIAssistant } from './components/AIAssistant';
import { MOCK_PERMITS, MOCK_CONDITIONS, MOCK_EVIDENCE } from './constants';
import { Permit, Condition, Status, RiskLevel, Evidence, UserProfile } from './types';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Plus, 
  Upload, 
  Download, 
  Filter, 
  ChevronRight,
  MoreVertical,
  Calendar,
  Eye,
  Trash2,
  BarChart3,
  CheckSquare,
  User,
  Loader2,
  Sparkles,
  X,
  Paperclip,
  Bell,
  Shield,
  Save,
  Mail,
  Smartphone,
  LogOut,
  Printer,
  Stamp,
  ArrowRight,
  Terminal,
  Activity,
  Pencil,
  FileDown
} from 'lucide-react';

// --- Page Components ---

// Edit Permit Modal Component
const EditPermitModal: React.FC<{
    permit: Permit;
    onSave: (p: Permit) => void;
    onCancel: () => void;
}> = ({ permit, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Permit>(permit);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden ring-1 ring-slate-900/5">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800">Edit Permit Record</h3>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Permit Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal outline-none text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-medium text-slate-500 mb-1">Project</label>
                             <input name="project" value={formData.project} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal outline-none text-sm" />
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-slate-500 mb-1">Jurisdiction</label>
                             <input name="jurisdiction" value={formData.jurisdiction} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal outline-none text-sm" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-medium text-slate-500 mb-1">Expiration Date</label>
                             <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal outline-none text-sm" />
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                             <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal outline-none text-sm">
                                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                             </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Owner</label>
                        <input name="owner" value={formData.owner} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal outline-none text-sm" />
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                        <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal outline-none text-sm resize-none" />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-fcs-teal text-white rounded-lg hover:bg-teal-700 text-sm shadow-md">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Document Viewer Component (Moved to top so DashboardPage can use it)
const DocumentViewer: React.FC<{
    permit: Permit;
    onClose: () => void;
}> = ({ permit, onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white/95 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/20">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white/50 backdrop-blur shrink-0">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-100 rounded-lg text-slate-600 shadow-sm border border-slate-200">
                             <FileText className="w-5 h-5" />
                         </div>
                         <div>
                             <h3 className="font-semibold text-slate-800">{permit.documentName || 'Official Permit Record'}</h3>
                             <p className="text-xs text-slate-500">Ref: {permit.id} • {permit.jurisdiction}</p>
                         </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title="Print">
                             <Printer size={20} />
                         </button>
                         {permit.documentUrl && (
                             <a href={permit.documentUrl} download={permit.documentName} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title="Download">
                                 <Download size={20} />
                             </a>
                         )}
                         <div className="w-px h-6 bg-slate-200 mx-1"></div>
                         <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                             <X size={20} />
                         </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-slate-100/50 p-6 overflow-y-auto relative flex justify-center custom-scrollbar">
                    {permit.documentUrl ? (
                        <iframe src={permit.documentUrl} className="w-full h-full max-w-4xl rounded shadow-lg bg-white" title="Document Viewer" />
                    ) : (
                        // Realistic Mock Permit View
                        <div className="bg-white w-full max-w-[800px] shadow-2xl p-12 min-h-[1000px] text-slate-900 relative ring-1 ring-slate-900/5">
                            {/* Watermark/Status Stamp */}
                            <div className={`absolute top-16 right-16 border-4 text-lg font-bold uppercase px-4 py-2 transform rotate-[-15deg] opacity-20 rounded select-none pointer-events-none mix-blend-multiply ${
                                permit.status === Status.ON_TRACK || permit.status === Status.COMPLIANT ? 'border-green-600 text-green-600' :
                                permit.status === Status.OVERDUE ? 'border-red-600 text-red-600' :
                                'border-slate-800 text-slate-800'
                            }`}>
                                {permit.status === Status.ON_TRACK ? 'ACTIVE' : permit.status}
                            </div>

                            {/* Header */}
                            <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center">
                                <div className="flex justify-center mb-4">
                                    <Shield size={48} className="text-slate-900" />
                                </div>
                                <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-slate-900 mb-1">{permit.jurisdiction}</h1>
                                <p className="text-sm uppercase tracking-wide text-slate-500 font-semibold">Department of Regulatory Compliance</p>
                            </div>

                            {/* Title Section */}
                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">{permit.name}</h2>
                                <p className="text-lg italic text-slate-600">Permit No. {permit.id}</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-10 text-sm">
                                <div className="border-b border-slate-200 pb-2">
                                    <p className="text-xs uppercase text-slate-500 font-bold mb-1">Issued To</p>
                                    <p className="font-semibold text-slate-900">FirstCarbon Solutions</p>
                                    <p className="text-slate-600">Attn: {permit.owner}</p>
                                </div>
                                <div className="border-b border-slate-200 pb-2">
                                    <p className="text-xs uppercase text-slate-500 font-bold mb-1">Project Site</p>
                                    <p className="font-semibold text-slate-900">{permit.project}</p>
                                </div>
                                <div className="border-b border-slate-200 pb-2">
                                    <p className="text-xs uppercase text-slate-500 font-bold mb-1">Effective Date</p>
                                    <p className="font-semibold text-slate-900">{permit.effectiveDate}</p>
                                </div>
                                <div className="border-b border-slate-200 pb-2">
                                    <p className="text-xs uppercase text-slate-500 font-bold mb-1">Expiration Date</p>
                                    <p className="font-semibold text-slate-900">{permit.expirationDate}</p>
                                </div>
                            </div>

                            {/* Body Text */}
                            <div className="prose prose-slate max-w-none text-sm text-justify leading-relaxed mb-12">
                                <p className="mb-4">
                                    <strong>WHEREAS</strong>, the applicant has submitted an application for the project described above, and has demonstrated compliance with all applicable regulations and standards required by the {permit.jurisdiction}.
                                </p>
                                <p className="mb-4">
                                    <strong>THEREFORE</strong>, this Permit is hereby granted to FirstCarbon Solutions, authorizing the activities described in the submitted plans, subject to the following General and Specific Conditions:
                                </p>
                                <div className="pl-6 space-y-2 mb-6">
                                    <ol className="list-decimal space-y-2 marker:font-bold">
                                        <li>This permit must be kept on site at all times during operations.</li>
                                        <li>The permittee shall notify the {permit.jurisdiction} at least 48 hours prior to commencement of work.</li>
                                        <li>All activities must be conducted in accordance with the approved plans and specifications.</li>
                                        <li>
                                            {permit.description || 'Compliance with all specific conditions attached hereto is mandatory.'}
                                        </li>
                                    </ol>
                                </div>
                                <p>
                                    Failure to comply with any of the conditions of this permit may result in revocation, suspension, or civil penalties. This permit is non-transferable without prior written approval.
                                </p>
                            </div>

                            {/* Signature Block */}
                            <div className="flex justify-between items-end mt-20 pt-8">
                                <div className="text-center">
                                    <div className="mb-2 font-handwriting text-2xl text-blue-900 italic" style={{fontFamily: 'cursive'}}>Electronic Signature Verified</div>
                                    <div className="w-64 border-t border-slate-400 pt-2">
                                        <p className="text-xs uppercase font-bold text-slate-500">Authorized Signature</p>
                                        <p className="text-xs text-slate-400">Chief Compliance Officer</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="w-24 h-24 border-4 border-double border-slate-300 rounded-full flex items-center justify-center rotate-[-12deg] opacity-50 mix-blend-multiply">
                                        <div className="text-center">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Official</div>
                                            <div className="text-xs font-bold text-slate-400">SEAL</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Footer */}
                            <div className="absolute bottom-6 left-12 right-12 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                                This is a system-generated representation of the original permit record. • ID: {permit.id} • Generated: {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    )}
                </div>
             </div>
        </div>
    )
};

const DashboardPage: React.FC<{ 
    permits: Permit[], 
    conditions: Condition[], 
    onDeletePermit: (id: string) => void,
    onUpdatePermit: (p: Permit) => void
}> = ({ permits, conditions, onDeletePermit, onUpdatePermit }) => {
  const [viewingPermit, setViewingPermit] = useState<Permit | null>(null);
  const [editingPermit, setEditingPermit] = useState<Permit | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter State
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filters, setFilters] = useState({
      status: 'All',
      owner: 'All',
      project: 'All'
  });

  const activePermits = permits.length;
  const conditionsDue30 = conditions.filter(c => {
    const due = new Date(c.dueDate);
    const now = new Date('2024-05-15'); // Mock 'today'
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  }).length;
  
  const overdueConditions = conditions.filter(c => c.status === Status.OVERDUE).length;
  const missingEvidence = conditions.filter(c => c.evidenceRequired && !c.evidenceUploaded).length;

  // Filter lists
  const uniqueOwners = Array.from(new Set(permits.map(p => p.owner))).sort();
  const uniqueProjects = Array.from(new Set(permits.map(p => p.project))).sort();

  // Apply Filters
  const filteredPermits = permits.filter(p => {
      if (filters.status !== 'All' && p.status !== filters.status) return false;
      if (filters.owner !== 'All' && p.owner !== filters.owner) return false;
      if (filters.project !== 'All' && p.project !== filters.project) return false;
      return true;
  });

  const handleDownload = (permit: Permit) => {
    let url = permit.documentUrl;
    let filename = permit.documentName || `Permit_${permit.id}.pdf`;

    if (!url) {
        // Generate mock file content for download if no real file exists
        const content = `
OFFICIAL PERMIT RECORD
----------------------
ID: ${permit.id}
Name: ${permit.name}
Project: ${permit.project}
Jurisdiction: ${permit.jurisdiction}
Status: ${permit.status}
Expiration: ${permit.expirationDate}
Owner: ${permit.owner}

Description:
${permit.description || 'No specific description provided.'}

TERMS AND CONDITIONS:
1. This permit must be kept on site.
2. Compliance with all environmental regulations is mandatory.
3. Notify the jurisdiction 48 hours before commencement.

Generated by FCS AI Permit Tracker
${new Date().toLocaleString()}
        `;
        const blob = new Blob([content], { type: 'text/plain' });
        url = URL.createObjectURL(blob);
        filename = `Permit_${permit.id}_Record.txt`;
    }

    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup if it was a generated blob
    if (!permit.documentUrl) {
        setTimeout(() => URL.revokeObjectURL(url!), 100);
    }
    
    setOpenMenuId(null);
  };

  const handleExport = () => {
    // Generate CSV content using filtered permits to match view
    const headers = ['ID', 'Name', 'Project', 'Jurisdiction', 'Type', 'Status', 'Expiration Date', 'Owner'];
    const rows = filteredPermits.map(p => [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`, // Escape quotes
        `"${p.project.replace(/"/g, '""')}"`,
        `"${p.jurisdiction.replace(/"/g, '""')}"`,
        p.type,
        p.status,
        p.expirationDate,
        p.owner
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FCS_Permits_Export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Permits', value: activePermits, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50/80', border: 'border-blue-100', glow: 'from-blue-400 to-cyan-300' },
          { label: 'Due in 30 Days', value: conditionsDue30, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50/80', border: 'border-yellow-100', glow: 'from-yellow-400 to-orange-300' },
          { label: 'Overdue Conditions', value: overdueConditions, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50/80', border: 'border-red-100', glow: 'from-red-400 to-pink-300' },
          { label: 'Missing Evidence', value: missingEvidence, icon: Upload, color: 'text-orange-600', bg: 'bg-orange-50/80', border: 'border-orange-100', glow: 'from-orange-400 to-amber-300' },
        ].map((kpi, i) => (
          <div key={i} className="relative group bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-white/40 p-6 flex items-start justify-between hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
            {/* 3D Glow Backsplash on Hover */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${kpi.glow} opacity-0 group-hover:opacity-20 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150`}></div>
            
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-500 mb-1">{kpi.label}</p>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{kpi.value}</h3>
            </div>
            <div className={`relative z-10 p-3 rounded-xl ${kpi.bg} border ${kpi.border} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 overflow-hidden">
        <div className="p-6 border-b border-slate-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Permit Status Overview</h2>
            <div className="flex gap-2 relative">
                <div className="relative">
                    <button 
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        className={`flex items-center px-3 py-2 text-sm rounded-lg border shadow-sm transition-all ${showFilterMenu ? 'bg-slate-100 text-fcs-teal border-fcs-teal' : 'text-slate-600 bg-white/50 hover:bg-white border-slate-200/60'}`}
                    >
                        <Filter size={16} className="mr-2" /> Filter
                    </button>
                    {/* Filter Dropdown */}
                    {showFilterMenu && (
                         <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-20 p-4 animate-in fade-in zoom-in-95 duration-200">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Filter Records</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                                        <select 
                                            value={filters.status}
                                            onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                                            className="w-full p-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal focus:border-transparent outline-none"
                                        >
                                            <option value="All">All Statuses</option>
                                            {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Owner</label>
                                        <select 
                                            value={filters.owner}
                                            onChange={(e) => setFilters(prev => ({...prev, owner: e.target.value}))}
                                            className="w-full p-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal focus:border-transparent outline-none"
                                        >
                                            <option value="All">All Owners</option>
                                            {uniqueOwners.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Project</label>
                                        <select 
                                            value={filters.project}
                                            onChange={(e) => setFilters(prev => ({...prev, project: e.target.value}))}
                                            className="w-full p-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal focus:border-transparent outline-none"
                                        >
                                            <option value="All">All Projects</option>
                                            {uniqueProjects.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div className="pt-2 flex justify-between gap-2">
                                        <button 
                                            onClick={() => {
                                                setFilters({status: 'All', owner: 'All', project: 'All'});
                                            }}
                                            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
                                        >
                                            Reset
                                        </button>
                                        <button 
                                            onClick={() => setShowFilterMenu(false)}
                                            className="bg-fcs-teal text-white text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <button 
                    onClick={handleExport}
                    className="flex items-center px-3 py-2 text-sm text-white bg-fcs-teal hover:bg-teal-700 rounded-lg shadow-lg shadow-teal-500/20 transition-colors"
                >
                    <Download size={16} className="mr-2" /> Export
                </button>
            </div>
        </div>
        <div className="overflow-visible min-h-[300px]">
          <table className="w-full">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 text-left">Project / Permit</th>
                <th className="px-6 py-4 text-left">Jurisdiction</th>
                <th className="px-6 py-4 text-left">Next Milestone</th>
                <th className="px-6 py-4 text-left">Owner</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {filteredPermits.length > 0 ? (
                  filteredPermits.map((permit) => (
                    <tr key={permit.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-sm">{permit.project}</p>
                        <p className="text-xs text-slate-500">{permit.name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{permit.jurisdiction}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center">
                            <Calendar size={14} className="mr-1.5 text-slate-400" />
                            {permit.expirationDate}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 ring-2 ring-white">
                                {permit.owner.split(' ').map(n=>n[0]).join('')}
                            </div>
                            {permit.owner}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            permit.status === Status.ON_TRACK ? 'bg-green-100/50 text-green-700 border-green-200' :
                            permit.status === Status.AT_RISK ? 'bg-yellow-100/50 text-yellow-700 border-yellow-200' :
                            permit.status === Status.OVERDUE ? 'bg-red-100/50 text-red-700 border-red-200' :
                            'bg-slate-100/50 text-slate-700 border-slate-200'
                        }`}>
                        {permit.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 relative">
                            <button 
                                onClick={() => setViewingPermit(permit)}
                                className="text-fcs-teal hover:text-teal-700 p-1.5 hover:bg-teal-50 rounded-lg transition-colors border border-transparent hover:border-teal-100"
                                title="View Full Permit"
                            >
                                <Eye size={18} />
                            </button>
                            
                            <div className="relative">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === permit.id ? null : permit.id);
                                    }}
                                    className={`p-1.5 rounded-lg transition-colors ${openMenuId === permit.id ? 'bg-slate-100 text-fcs-teal' : 'text-slate-400 hover:text-fcs-teal hover:bg-slate-100'}`}
                                >
                                    <MoreVertical size={18} />
                                </button>
                                
                                {/* Action Dropdown Menu */}
                                {openMenuId === permit.id && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
                                            <div className="py-1">
                                                <button 
                                                    onClick={() => { setViewingPermit(permit); setOpenMenuId(null); }}
                                                    className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-fcs-teal transition-colors text-left"
                                                >
                                                    <Eye size={16} className="mr-2" />
                                                    View Details
                                                </button>
                                                <button 
                                                    onClick={() => { setEditingPermit(permit); setOpenMenuId(null); }}
                                                    className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-fcs-teal transition-colors text-left"
                                                >
                                                    <Pencil size={16} className="mr-2" />
                                                    Edit Record
                                                </button>
                                                <button 
                                                    onClick={() => handleDownload(permit)}
                                                    className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-fcs-teal transition-colors text-left"
                                                >
                                                    <FileDown size={16} className="mr-2" />
                                                    Download PDF
                                                </button>
                                                <div className="h-px bg-slate-100 my-1"></div>
                                                <button 
                                                    onClick={() => { onDeletePermit(permit.id); setOpenMenuId(null); }}
                                                    className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                                                >
                                                    <Trash2 size={16} className="mr-2" />
                                                    Delete Permit
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </td>
                    </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center">
                            <Filter size={32} className="mb-2 opacity-50" />
                            <p>No permits match the selected filters.</p>
                            <button 
                                onClick={() => setFilters({status: 'All', owner: 'All', project: 'All'})}
                                className="mt-2 text-sm text-fcs-teal hover:underline"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {viewingPermit && (
        <DocumentViewer permit={viewingPermit} onClose={() => setViewingPermit(null)} />
      )}
      
      {editingPermit && (
        <EditPermitModal 
            permit={editingPermit} 
            onSave={(updatedPermit) => {
                onUpdatePermit(updatedPermit);
                setEditingPermit(null);
            }} 
            onCancel={() => setEditingPermit(null)} 
        />
      )}
    </div>
  );
};

const PermitsPage: React.FC<{ permits: Permit[], onAdd: (p: Permit) => void }> = ({ permits, onAdd }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [newPermit, setNewPermit] = useState<Partial<Permit>>({});
    const [viewingPermit, setViewingPermit] = useState<Permit | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadedFile(file);
            setIsAnalyzing(true);
            const fileName = file.name;
            // Simulate AI analysis delay
            setTimeout(() => {
                setNewPermit({
                    name: "NPDES Stormwater General Permit",
                    project: "North Creek Expansion",
                    jurisdiction: "State Water Resources Control Board",
                    type: "Water Quality",
                    effectiveDate: "2024-06-01",
                    expirationDate: "2029-06-01",
                    description: `Extracted from ${fileName}`
                });
                setIsAnalyzing(false);
                setActiveTab('manual'); // Switch to form for review
            }, 2500);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Create an object URL for the uploaded file if it exists
        const documentUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : undefined;

        const p: Permit = {
            id: `P-${Math.floor(Math.random() * 1000)}`,
            project: newPermit.project || 'New Project',
            name: newPermit.name || 'New Permit',
            jurisdiction: newPermit.jurisdiction || 'Agency',
            type: newPermit.type || 'General',
            effectiveDate: newPermit.effectiveDate || '2024-01-01',
            expirationDate: newPermit.expirationDate || '2025-01-01',
            owner: 'Current User',
            status: Status.PENDING,
            description: newPermit.description,
            documentUrl: documentUrl,
            documentName: uploadedFile ? uploadedFile.name : undefined
        };
        onAdd(p);
        setIsAdding(false);
        setNewPermit({});
        setUploadedFile(null);
        setActiveTab('upload');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Permit Library</h2>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-white/60 border border-slate-300 text-slate-700 rounded-lg hover:bg-white text-sm font-medium backdrop-blur-sm transition-all shadow-sm">
                        Import CSV
                    </button>
                    <button onClick={() => setIsAdding(true)} className="px-4 py-2 bg-fcs-teal text-white rounded-lg hover:bg-teal-700 shadow-lg shadow-teal-500/20 text-sm font-medium flex items-center transition-all">
                        <Plus size={16} className="mr-2" /> Add Permit
                    </button>
                </div>
            </div>

            {isAdding && (
                <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-200/60 animate-in fade-in slide-in-from-top-4 mb-6 ring-1 ring-slate-900/5">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-800">Add New Permit</h3>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button onClick={() => setActiveTab('upload')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'upload' ? 'bg-white shadow text-fcs-teal' : 'text-slate-500 hover:text-slate-700'}`}>Upload File</button>
                            <button onClick={() => setActiveTab('manual')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'manual' ? 'bg-white shadow text-fcs-teal' : 'text-slate-500 hover:text-slate-700'}`}>Manual Entry</button>
                        </div>
                    </div>

                    {activeTab === 'upload' ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center bg-slate-50/50 hover:bg-slate-100/50 transition-colors relative group backdrop-blur-sm">
                            {isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center py-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-fcs-teal/20 rounded-full animate-ping"></div>
                                        <div className="relative bg-white p-3 rounded-full shadow-sm mb-4">
                                            <Sparkles className="text-fcs-teal animate-pulse" size={32} />
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Analyzing Document...</h4>
                                    <p className="text-sm text-slate-500">Extracting jurisdiction, dates, and requirements.</p>
                                </div>
                            ) : (
                                <>
                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileUpload} accept=".pdf,.docx,.doc,application/pdf" />
                                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 text-fcs-teal group-hover:scale-110 transition-transform shadow-sm border border-blue-100">
                                        <Upload size={32} />
                                    </div>
                                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Upload Permit Document</h4>
                                    <p className="text-sm text-slate-500 max-w-xs mx-auto">Drag and drop your PDF permit file here, or click to browse. Our AI will extract the details for you.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2 bg-blue-50/60 border border-blue-100 rounded-lg p-3 flex items-start gap-3 mb-2">
                                <Sparkles size={16} className="text-blue-600 mt-0.5" />
                                <p className="text-xs text-blue-800">Review the details below. We've pre-filled this form based on your document.</p>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Permit Name</label>
                                <input className="input-field bg-white/50" placeholder="Permit Name" required value={newPermit.name || ''} onChange={e => setNewPermit({...newPermit, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Project</label>
                                <input className="input-field bg-white/50" placeholder="Project" required value={newPermit.project || ''} onChange={e => setNewPermit({...newPermit, project: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Jurisdiction</label>
                                <input className="input-field bg-white/50" placeholder="Jurisdiction" value={newPermit.jurisdiction || ''} onChange={e => setNewPermit({...newPermit, jurisdiction: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                                <input className="input-field bg-white/50" placeholder="Type" value={newPermit.type || ''} onChange={e => setNewPermit({...newPermit, type: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Effective Date</label>
                                <input type="date" className="input-field bg-white/50" value={newPermit.effectiveDate || ''} onChange={e => setNewPermit({...newPermit, effectiveDate: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Expiration Date</label>
                                <input type="date" className="input-field bg-white/50" value={newPermit.expirationDate || ''} onChange={e => setNewPermit({...newPermit, expirationDate: e.target.value})} />
                            </div>
                            
                            <div className="flex gap-2 col-span-2 justify-end mt-4">
                                    <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-fcs-teal text-white rounded-lg hover:bg-teal-700 text-sm shadow-md transition-all">Save Permit</button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {permits.map(p => (
                    <div key={p.id} className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/50 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center group">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">{p.id}</span>
                                <h3 className="font-semibold text-slate-800 group-hover:text-fcs-teal transition-colors">{p.name}</h3>
                            </div>
                            <p className="text-sm text-slate-500">{p.project} • {p.jurisdiction}</p>
                            {p.documentName && (
                                <div className="flex items-center mt-2 text-xs text-slate-400">
                                    <FileText size={12} className="mr-1" />
                                    {p.documentName}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-slate-400 uppercase tracking-wide">Expires</p>
                                <p className="text-sm font-medium text-slate-700">{p.expirationDate}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                p.status === Status.ON_TRACK ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                                {p.status}
                            </span>
                            
                            <button 
                                onClick={() => setViewingPermit(p)}
                                className="flex items-center px-3 py-1.5 text-xs font-medium text-fcs-teal bg-teal-50/50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-100"
                            >
                                <Eye size={14} className="mr-1.5" />
                                View
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {viewingPermit && (
                <DocumentViewer permit={viewingPermit} onClose={() => setViewingPermit(null)} />
            )}
        </div>
    );
};

const ConditionsPage: React.FC<{
  conditions: Condition[];
  permits: Permit[];
  onAdd: (c: Condition) => void;
  onUploadEvidence: (conditionId: string, file: File) => void;
}> = ({ conditions, permits, onAdd, onUploadEvidence }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newCondition, setNewCondition] = useState<Partial<Condition>>({
    riskLevel: RiskLevel.LOW,
    status: Status.PENDING,
    evidenceRequired: true
  });
  
  // File Upload Logic
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null);

  const handleUploadClick = (id: string) => {
    setSelectedConditionId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedConditionId) {
        onUploadEvidence(selectedConditionId, e.target.files[0]);
        // Reset
        setSelectedConditionId(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Filter logic
  const filteredConditions = conditions.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c: Condition = {
       id: `C-${Math.floor(Math.random() * 10000)}`,
       permitId: newCondition.permitId || permits[0]?.id || '',
       description: newCondition.description || 'New Condition',
       dueDate: newCondition.dueDate || new Date().toISOString().split('T')[0],
       status: newCondition.status || Status.PENDING,
       riskLevel: newCondition.riskLevel || RiskLevel.LOW,
       evidenceRequired: newCondition.evidenceRequired ?? true,
       evidenceUploaded: false,
       owner: newCondition.owner || 'Unassigned'
    };
    onAdd(c);
    setIsAdding(false);
    setNewCondition({ riskLevel: RiskLevel.LOW, status: Status.PENDING, evidenceRequired: true });
  };

  return (
    <div className="space-y-6">
       {/* Hidden File Input */}
       <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
       />

       {/* Header & Controls */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Condition Tracking</h2>
            <p className="text-slate-500 text-sm">Monitor and manage compliance requirements across all permits.</p>
          </div>
          <div className="flex space-x-3">
             {/* Simple Tabs for filtering */}
             <div className="flex bg-slate-100/50 backdrop-blur-sm p-1 rounded-lg border border-slate-200">
                {['all', Status.AT_RISK, Status.OVERDUE].map(s => (
                   <button
                     key={s}
                     onClick={() => setFilterStatus(s)}
                     className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                       filterStatus === s ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                     }`}
                   >
                     {s === 'all' ? 'All Conditions' : s}
                   </button>
                ))}
             </div>
             <button onClick={() => setIsAdding(true)} className="px-4 py-2 bg-fcs-teal text-white rounded-lg hover:bg-teal-700 shadow-lg shadow-teal-500/20 text-sm font-medium flex items-center transition-all">
                 <Plus size={16} className="mr-2" /> Add Condition
             </button>
          </div>
       </div>

       {/* Add Modal (Inline for simplicity) */}
       {isAdding && (
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-200/60 animate-in fade-in slide-in-from-top-4 ring-1 ring-slate-900/5">
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Add New Condition</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                    <input className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal focus:border-transparent outline-none text-sm bg-white/50" placeholder="e.g. Submit Quarterly Report" required onChange={e => setNewCondition({...newCondition, description: e.target.value})} />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Permit</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal outline-none text-sm bg-white/50" 
                        onChange={e => setNewCondition({...newCondition, permitId: e.target.value})}>
                        <option value="">Select Permit...</option>
                        {permits.map(p => <option key={p.id} value={p.id}>{p.name} ({p.project})</option>)}
                    </select>
                  </div>

                  <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">Due Date</label>
                     <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal outline-none text-sm bg-white/50" required onChange={e => setNewCondition({...newCondition, dueDate: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Risk Level</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal outline-none text-sm bg-white/50"
                        onChange={e => setNewCondition({...newCondition, riskLevel: e.target.value as RiskLevel})}>
                        {Object.values(RiskLevel).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Owner</label>
                    <input className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fcs-teal outline-none text-sm bg-white/50" placeholder="Assigned Person" onChange={e => setNewCondition({...newCondition, owner: e.target.value})} />
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                      <input type="checkbox" id="evReq" className="w-4 h-4 text-fcs-teal rounded border-slate-300 focus:ring-fcs-teal" checked={newCondition.evidenceRequired} onChange={e => setNewCondition({...newCondition, evidenceRequired: e.target.checked})} />
                      <label htmlFor="evReq" className="text-sm text-slate-700">Evidence Required</label>
                  </div>

                  <div className="col-span-2 flex justify-end gap-2 mt-2">
                        <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-fcs-teal text-white rounded-lg hover:bg-teal-700 text-sm shadow-md">Save Condition</button>
                  </div>
              </form>
          </div>
       )}

       {/* Table */}
       <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100/50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Condition</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Permit</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Risk</th>
                 <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Evid. Req.</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Evidence</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                 <th className="px-6 py-3 text-right"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
               {filteredConditions.map(c => {
                 const permit = permits.find(p => p.id === c.permitId);
                 return (
                   <tr key={c.id} className="hover:bg-slate-50/50 group transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-start gap-3">
                            <span className="text-xs font-mono text-slate-400 mt-1">{c.id}</span>
                            <p className="text-sm font-medium text-slate-700 line-clamp-2">{c.description}</p>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="text-xs text-slate-600 font-medium">{permit?.name || c.permitId}</div>
                         <div className="text-[10px] text-slate-400">{permit?.project}</div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center text-sm text-slate-600">
                             <Calendar size={14} className="mr-2 text-slate-400" />
                             {c.dueDate}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                             c.riskLevel === RiskLevel.HIGH ? 'bg-red-50 text-red-700 border-red-100' :
                             c.riskLevel === RiskLevel.MEDIUM ? 'bg-orange-50 text-orange-700 border-orange-100' :
                             'bg-blue-50 text-blue-700 border-blue-100'
                         }`}>
                             {c.riskLevel}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         {c.evidenceRequired ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">YES</span>
                         ) : (
                            <span className="text-slate-300 text-xs">—</span>
                         )}
                      </td>
                      <td className="px-6 py-4">
                         {c.evidenceRequired ? (
                            c.evidenceUploaded ? (
                                <div className="flex items-center text-green-600 text-xs font-medium">
                                    <CheckCircle size={14} className="mr-1.5" /> 
                                    <span>Uploaded</span>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleUploadClick(c.id)}
                                    className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-md text-xs font-medium transition-colors border border-blue-100"
                                >
                                    <Upload size={14} className="mr-1.5" /> Upload Evidence
                                </button>
                            )
                         ) : (
                            <span className="text-xs text-slate-400 italic">Not Required</span>
                         )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            c.status === Status.ON_TRACK ? 'bg-green-100/50 text-green-800 border-green-200' :
                            c.status === Status.AT_RISK ? 'bg-yellow-100/50 text-yellow-800 border-yellow-200' :
                            c.status === Status.OVERDUE ? 'bg-red-100/50 text-red-800 border-red-200' :
                            c.status === Status.COMPLIANT ? 'bg-green-100/50 text-green-800 border-green-200' :
                            'bg-slate-100/50 text-slate-800 border-slate-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100/50 rounded">
                            <MoreVertical size={16} />
                         </button>
                      </td>
                   </tr>
                 );
               })}
            </tbody>
          </table>
          {filteredConditions.length === 0 && (
              <div className="p-10 text-center text-slate-400">
                  <CheckSquare size={32} className="mx-auto mb-2 opacity-20" />
                  <p>No conditions found matching your filters.</p>
              </div>
          )}
       </div>
    </div>
  );
};

const EvidencePage: React.FC<{ evidence: Evidence[] }> = ({ evidence }) => {
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Evidence Locker</h2>
                <button className="px-4 py-2 bg-fcs-teal text-white rounded-lg hover:bg-teal-700 shadow-lg shadow-teal-500/20 text-sm font-medium flex items-center transition-all">
                    <Upload size={16} className="mr-2" /> Upload New
                </button>
            </div>

            {/* Upload Zone Mock */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-white/50 hover:bg-white hover:border-fcs-teal transition-all cursor-pointer group backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-50 group-hover:text-fcs-teal transition-colors border border-slate-200">
                    <UploadCloudIcon className="w-6 h-6 text-slate-400 group-hover:text-fcs-teal" />
                </div>
                <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50/50 border-b border-slate-100/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Condition ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Uploaded By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tags</th>
                            <th className="px-6 py-3 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                        {evidence.map(e => (
                            <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <FileText size={16} className="text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700">{e.fileName}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{e.conditionId}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{e.uploadedBy}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{e.uploadDate}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1">
                                        {e.tags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">{tag}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button className="p-1 text-slate-400 hover:text-fcs-teal"><Eye size={16} /></button>
                                    <button className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Helper for icon
const UploadCloudIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
)

const SystemLogsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const logs = [
        { id: 'L-9921', time: '2024-05-15 11:45:22', level: 'INFO', source: 'AuthService', message: 'User S. Jenkins logged in successfully.' },
        { id: 'L-9922', time: '2024-05-15 11:46:05', level: 'INFO', source: 'PermitIndexer', message: 'Re-indexing permit library. 4 documents processed.' },
        { id: 'L-9923', time: '2024-05-15 11:50:12', level: 'SUCCESS', source: 'AI_Engine', message: 'Context embeddings updated for Project: Vista Grande.' },
        { id: 'L-9924', time: '2024-05-15 12:00:00', level: 'INFO', source: 'Scheduler', message: 'Running scheduled task: Daily_Compliance_Check.' },
        { id: 'L-9925', time: '2024-05-15 12:00:02', level: 'WARN', source: 'ComplianceEngine', message: 'Condition C-102-A is OVERDUE. Triggering alert flow.' },
        { id: 'L-9926', time: '2024-05-15 12:00:03', level: 'INFO', source: 'NotificationService', message: 'Email dispatched to m.ross@firstcarbonsolutions.com' },
        { id: 'L-9927', time: '2024-05-15 12:00:05', level: 'SUCCESS', source: 'Scheduler', message: 'Task Daily_Compliance_Check completed in 450ms.' },
        { id: 'L-9928', time: '2024-05-15 13:15:10', level: 'INFO', source: 'EvidenceStore', message: 'New file upload: Q1_2024_Emissions.pdf (2.4MB).' },
        { id: 'L-9929', time: '2024-05-15 13:15:15', level: 'SUCCESS', source: 'VirusScan', message: 'Scan completed. No threats found.' },
        { id: 'L-9930', time: '2024-05-15 13:15:18', level: 'SUCCESS', source: 'ComplianceEngine', message: 'Condition C-101-A status updated to COMPLIANT.' },
    ];

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-slate-950 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-800 ring-1 ring-white/10">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/80 backdrop-blur shrink-0">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-900 rounded-lg text-fcs-teal border border-slate-800">
                             <Terminal className="w-5 h-5" />
                         </div>
                         <div>
                             <h3 className="font-semibold text-slate-100 font-mono">System Logs</h3>
                             <p className="text-xs text-slate-500 font-mono">/var/log/fcs-compliance-engine.log</p>
                         </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-slate-950/90 p-0 overflow-y-auto font-mono text-sm max-h-[60vh] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900/50 text-slate-500 text-xs sticky top-0 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-2 font-medium">Timestamp</th>
                                <th className="px-6 py-2 font-medium">Level</th>
                                <th className="px-6 py-2 font-medium">Source</th>
                                <th className="px-6 py-2 font-medium w-full">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-slate-300">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                                    <td className="px-6 py-2 whitespace-nowrap text-slate-500 text-xs">{log.time}</td>
                                    <td className="px-6 py-2 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                            log.level === 'ERROR' ? 'bg-red-900/30 text-red-500' :
                                            log.level === 'WARN' ? 'bg-yellow-900/30 text-yellow-500' :
                                            log.level === 'SUCCESS' ? 'bg-green-900/30 text-green-500' :
                                            'bg-blue-900/30 text-blue-500'
                                        }`}>
                                            {log.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap text-slate-400">{log.source}</td>
                                    <td className="px-6 py-2 text-slate-300">{log.message}</td>
                                </tr>
                            ))}
                            {/* Live typing effect mock */}
                            <tr className="animate-pulse">
                                <td className="px-6 py-2 text-slate-600 text-xs">...</td>
                                <td className="px-6 py-2"></td>
                                <td className="px-6 py-2"></td>
                                <td className="px-6 py-2 text-fcs-teal">_</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <Activity size={14} className="text-green-500" />
                        <span>Live Stream Active</span>
                    </div>
                    <span>Showing last 10 events</span>
                </div>
             </div>
        </div>
    );
};

const ReportsPage: React.FC<{ permits: Permit[], conditions: Condition[] }> = ({ permits, conditions }) => {
    const [activeReport, setActiveReport] = useState<'weekly' | 'monthly' | 'gap' | null>(null);
    const [showLogs, setShowLogs] = useState(false);
    
    // State for Alert Configuration
    const [alertsEnabled, setAlertsEnabled] = useState(true);
    const [alertConfig, setAlertConfig] = useState({
        remind30: true,
        remind7: true,
        weeklyDigest: true
    });

    const toggleAlert = (key: keyof typeof alertConfig) => {
        if (!alertsEnabled) return; // Disable interaction if master switch is off
        setAlertConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Mock Date consistent with Dashboard
    const MOCK_TODAY = new Date('2024-05-15');

    // Report Generation Logic
    const renderReportContent = () => {
        if (!activeReport) return null;

        if (activeReport === 'weekly') {
            // Logic: Conditions due in next 7 days, grouped by Owner
            const nextWeek = new Date(MOCK_TODAY);
            nextWeek.setDate(MOCK_TODAY.getDate() + 7);

            const upcomingConditions = conditions.filter(c => {
                const due = new Date(c.dueDate);
                return due >= MOCK_TODAY && due <= nextWeek;
            });

            return (
                <div className="animate-in fade-in slide-in-from-top-4">
                    <div className="bg-slate-50/50 backdrop-blur-sm p-4 rounded-t-xl border border-b-0 border-slate-200 flex justify-between items-center">
                        <div>
                             <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <User className="text-fcs-teal" size={18} />
                                Weekly Owner Digest
                             </h3>
                             <p className="text-xs text-slate-500">Tasks due between {MOCK_TODAY.toLocaleDateString()} and {nextWeek.toLocaleDateString()}</p>
                        </div>
                        <button className="text-xs bg-white border border-slate-300 px-3 py-1 rounded hover:bg-slate-50 flex items-center">
                            <Download size={14} className="mr-1" /> Export CSV
                        </button>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
                        {upcomingConditions.length > 0 ? (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/50 text-slate-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Owner</th>
                                        <th className="px-6 py-3">Condition</th>
                                        <th className="px-6 py-3">Due Date</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50">
                                    {upcomingConditions.map(c => (
                                        <tr key={c.id}>
                                            <td className="px-6 py-3 font-medium text-slate-700">{c.owner}</td>
                                            <td className="px-6 py-3 text-slate-600">{c.description}</td>
                                            <td className="px-6 py-3 text-slate-600">{c.dueDate}</td>
                                            <td className="px-6 py-3">
                                                 <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                                     c.status === Status.AT_RISK ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                                                 }`}>
                                                     {c.status}
                                                 </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                <CheckCircle size={32} className="mx-auto mb-2 text-green-500 opacity-50" />
                                <p>No immediate tasks due this week. Good job!</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (activeReport === 'monthly') {
            // Logic: All items due in current month (May 2024)
            const currentMonth = MOCK_TODAY.getMonth();
            const currentYear = MOCK_TODAY.getFullYear();

            const monthlyItems = conditions.filter(c => {
                const d = new Date(c.dueDate);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            });

            const onTrack = monthlyItems.filter(i => i.status === Status.ON_TRACK || i.status === Status.COMPLIANT).length;
            const atRisk = monthlyItems.filter(i => i.status === Status.AT_RISK).length;
            const overdue = monthlyItems.filter(i => i.status === Status.OVERDUE).length;

            return (
                <div className="animate-in fade-in slide-in-from-top-4">
                     <div className="bg-slate-50/50 backdrop-blur-sm p-4 rounded-t-xl border border-b-0 border-slate-200 flex justify-between items-center">
                        <div>
                             <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <CheckSquare className="text-fcs-teal" size={18} />
                                Monthly Compliance Rollup
                             </h3>
                             <p className="text-xs text-slate-500">Activity for May 2024</p>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-b-xl p-6 shadow-sm">
                        {/* Mini Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-green-50/60 border border-green-100 rounded-lg text-center backdrop-blur-sm">
                                <p className="text-2xl font-bold text-green-700">{onTrack}</p>
                                <p className="text-xs text-green-600 font-medium uppercase">On Track</p>
                            </div>
                            <div className="p-4 bg-yellow-50/60 border border-yellow-100 rounded-lg text-center backdrop-blur-sm">
                                <p className="text-2xl font-bold text-yellow-700">{atRisk}</p>
                                <p className="text-xs text-yellow-600 font-medium uppercase">At Risk</p>
                            </div>
                            <div className="p-4 bg-red-50/60 border border-red-100 rounded-lg text-center backdrop-blur-sm">
                                <p className="text-2xl font-bold text-red-700">{overdue}</p>
                                <p className="text-xs text-red-600 font-medium uppercase">Overdue</p>
                            </div>
                        </div>

                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Detailed Item List</h4>
                         <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/50 text-slate-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Description</th>
                                        <th className="px-4 py-2">Due Date</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50">
                                    {monthlyItems.map(c => (
                                        <tr key={c.id}>
                                            <td className="px-4 py-2 font-mono text-xs text-slate-500">{c.id}</td>
                                            <td className="px-4 py-2 text-slate-700">{c.description}</td>
                                            <td className="px-4 py-2 text-slate-600">{c.dueDate}</td>
                                            <td className="px-4 py-2">
                                                 <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                                                     c.status === Status.OVERDUE ? 'bg-red-50 text-red-700 border-red-100' : 
                                                     c.status === Status.AT_RISK ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                     'bg-green-50 text-green-700 border-green-100'
                                                 }`}>
                                                     {c.status}
                                                 </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    </div>
                </div>
            );
        }

        if (activeReport === 'gap') {
            // Logic: Conditions needing evidence but not uploaded
            const gapItems = conditions.filter(c => c.evidenceRequired && !c.evidenceUploaded);

            return (
                <div className="animate-in fade-in slide-in-from-top-4">
                     <div className="bg-slate-50/50 backdrop-blur-sm p-4 rounded-t-xl border border-b-0 border-slate-200 flex justify-between items-center">
                        <div>
                             <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <AlertTriangle className="text-fcs-teal" size={18} />
                                Evidence Gap Analysis
                             </h3>
                             <p className="text-xs text-slate-500">Items requiring immediate attention</p>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
                        {gapItems.length > 0 ? (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/50 text-slate-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Risk</th>
                                        <th className="px-6 py-3">Condition</th>
                                        <th className="px-6 py-3">Permit</th>
                                        <th className="px-6 py-3">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50">
                                    {gapItems.map(c => {
                                        const permit = permits.find(p => p.id === c.permitId);
                                        return (
                                        <tr key={c.id}>
                                            <td className="px-6 py-3">
                                                 <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                                     c.riskLevel === RiskLevel.HIGH ? 'bg-red-50 text-red-700 border-red-100' :
                                                     c.riskLevel === RiskLevel.MEDIUM ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                     'bg-blue-50 text-blue-700 border-blue-100'
                                                 }`}>
                                                     {c.riskLevel}
                                                 </span>
                                            </td>
                                            <td className="px-6 py-3 font-medium text-slate-700">{c.description}</td>
                                            <td className="px-6 py-3 text-slate-500 text-xs">{permit?.name}</td>
                                            <td className="px-6 py-3 text-slate-600">{c.dueDate}</td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                <CheckCircle size={32} className="mx-auto mb-2 text-green-500 opacity-50" />
                                <p>All required evidence has been submitted!</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/50 text-center shadow-lg ring-1 ring-slate-900/5">
                <div className="inline-flex p-3 rounded-full bg-teal-50 mb-4 ring-1 ring-fcs-teal/20">
                    <BarChart3 className="w-8 h-8 text-fcs-teal" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Automated Reports</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">Generate compliance summaries, executive briefs, and evidence gaps instantly.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <button 
                        onClick={() => setActiveReport('weekly')}
                        className={`relative isolate flex flex-col items-center p-6 rounded-2xl transition-all duration-500 group overflow-hidden border ${
                            activeReport === 'weekly' 
                            ? 'border-fcs-teal bg-white shadow-xl scale-[1.02] ring-1 ring-fcs-teal/20' 
                            : 'border-white/40 bg-white/40 hover:border-white/60 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-md'
                        }`}
                    >
                         {/* 3D Color Backsplash Effect */}
                         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-fcs-teal to-cyan-300 rounded-full blur-[50px] opacity-40 group-hover:scale-125 transition-transform duration-700 ease-out"></div>
                            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full blur-[50px] opacity-40 group-hover:scale-125 transition-transform duration-700 ease-out delay-75"></div>
                         </div>
                         
                        <div className={`relative z-10 p-2 rounded-lg shadow-sm mb-3 transition-transform duration-300 group-hover:scale-110 ${
                            activeReport === 'weekly' ? 'bg-fcs-teal text-white' : 'bg-white text-slate-500 group-hover:text-fcs-teal shadow-inner'
                        }`}>
                            <User className="w-5 h-5" />
                        </div>
                        <span className={`relative z-10 text-sm font-semibold transition-colors ${activeReport === 'weekly' ? 'text-fcs-teal' : 'text-slate-700 group-hover:text-fcs-teal'}`}>Weekly Owner Digest</span>
                    </button>

                    <button 
                        onClick={() => setActiveReport('monthly')}
                        className={`relative isolate flex flex-col items-center p-6 rounded-2xl transition-all duration-500 group overflow-hidden border ${
                            activeReport === 'monthly' 
                            ? 'border-fcs-teal bg-white shadow-xl scale-[1.02] ring-1 ring-fcs-teal/20' 
                            : 'border-white/40 bg-white/40 hover:border-white/60 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-md'
                        }`}
                    >
                         {/* 3D Color Backsplash Effect */}
                         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-300 rounded-full blur-[50px] opacity-40 group-hover:scale-125 transition-transform duration-700 ease-out"></div>
                            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-fcs-teal to-emerald-300 rounded-full blur-[50px] opacity-40 group-hover:scale-125 transition-transform duration-700 ease-out delay-75"></div>
                         </div>

                        <div className={`relative z-10 p-2 rounded-lg shadow-sm mb-3 transition-transform duration-300 group-hover:scale-110 ${
                            activeReport === 'monthly' ? 'bg-fcs-teal text-white' : 'bg-white text-slate-500 group-hover:text-fcs-teal shadow-inner'
                        }`}>
                            <CheckSquare className="w-5 h-5" />
                        </div>
                        <span className={`relative z-10 text-sm font-semibold transition-colors ${activeReport === 'monthly' ? 'text-fcs-teal' : 'text-slate-700 group-hover:text-fcs-teal'}`}>Monthly Compliance Rollup</span>
                    </button>

                    <button 
                        onClick={() => setActiveReport('gap')}
                        className={`relative isolate flex flex-col items-center p-6 rounded-2xl transition-all duration-500 group overflow-hidden border ${
                            activeReport === 'gap' 
                            ? 'border-fcs-teal bg-white shadow-xl scale-[1.02] ring-1 ring-fcs-teal/20' 
                            : 'border-white/40 bg-white/40 hover:border-white/60 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-md'
                        }`}
                    >
                         {/* 3D Color Backsplash Effect */}
                         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-full blur-[50px] opacity-40 group-hover:scale-125 transition-transform duration-700 ease-out"></div>
                            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-red-400 to-pink-400 rounded-full blur-[50px] opacity-40 group-hover:scale-125 transition-transform duration-700 ease-out delay-75"></div>
                         </div>

                        <div className={`relative z-10 p-2 rounded-lg shadow-sm mb-3 transition-transform duration-300 group-hover:scale-110 ${
                            activeReport === 'gap' ? 'bg-fcs-teal text-white' : 'bg-white text-slate-500 group-hover:text-fcs-teal shadow-inner'
                        }`}>
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <span className={`relative z-10 text-sm font-semibold transition-colors ${activeReport === 'gap' ? 'text-fcs-teal' : 'text-slate-700 group-hover:text-fcs-teal'}`}>Evidence Gap Analysis</span>
                    </button>
                </div>
            </div>

            {/* Dynamic Report Content Area */}
            {activeReport && (
                <div className="max-w-4xl mx-auto">
                    {renderReportContent()}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200/50">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/50 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-semibold text-slate-800">Alert Configuration</h3>
                        <p className="text-xs text-slate-500">Manage automated email notifications</p>
                    </div>
                    {/* Master Switch */}
                    <button 
                        onClick={() => setAlertsEnabled(!alertsEnabled)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shadow-inner ${alertsEnabled ? 'bg-fcs-teal' : 'bg-slate-300'}`}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${alertsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>
                
                <div className={`space-y-5 transition-opacity duration-300 ${alertsEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shadow-sm border border-blue-100">
                                <Calendar size={18} />
                             </div>
                             <span className="text-sm font-medium text-slate-700">30-Day Warning</span>
                        </div>
                        <button 
                            onClick={() => toggleAlert('remind30')}
                            className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-200 shadow-inner ${alertConfig.remind30 ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <div className={`bg-white w-3 h-3 rounded-full shadow transform transition-transform duration-200 ${alertConfig.remind30 ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shadow-sm border border-orange-100">
                                <Clock size={18} />
                             </div>
                             <span className="text-sm font-medium text-slate-700">7-Day Urgent Reminder</span>
                        </div>
                        <button 
                            onClick={() => toggleAlert('remind7')}
                            className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-200 shadow-inner ${alertConfig.remind7 ? 'bg-orange-500' : 'bg-slate-200'}`}
                        >
                            <div className={`bg-white w-3 h-3 rounded-full shadow transform transition-transform duration-200 ${alertConfig.remind7 ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shadow-sm border border-purple-100">
                                <Mail size={18} />
                             </div>
                             <span className="text-sm font-medium text-slate-700">Weekly Owner Digest</span>
                        </div>
                        <button 
                            onClick={() => toggleAlert('weeklyDigest')}
                            className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-200 shadow-inner ${alertConfig.weeklyDigest ? 'bg-purple-600' : 'bg-slate-200'}`}
                        >
                            <div className={`bg-white w-3 h-3 rounded-full shadow transform transition-transform duration-200 ${alertConfig.weeklyDigest ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Added a second card for balance as the layout was a grid-cols-2 but only had 1 child before */}
             <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-fcs-teal/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-fcs-teal/20 transition-colors duration-500"></div>
                
                <div className="relative z-10">
                    <h3 className="font-semibold text-lg mb-2">System Status</h3>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                        <span className="text-xs text-slate-300">All systems operational</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Next Scheduled Scan</span>
                            <span>Today, 11:00 PM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Queued Notifications</span>
                            <span>12 Pending</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setShowLogs(true)}
                    className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors border border-white/10 relative z-10 backdrop-blur-md"
                >
                    View System Logs
                </button>
            </div>
        </div>
        
        {/* Render System Logs Modal */}
        {showLogs && <SystemLogsModal onClose={() => setShowLogs(false)} />}
        </div>
    );
};

// Settings Page Component
const SettingsPage: React.FC<{ user: UserProfile, onUpdate: (u: UserProfile) => void }> = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState<UserProfile>(user);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            // Check if it's a notification nested field
            if (['email', 'push', 'digest'].includes(name)) {
                setFormData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, [name]: checked }
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            onUpdate(formData);
            setIsSaving(false);
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Account Settings</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
                {/* Profile Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-6 ring-1 ring-slate-900/5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-slate-800">
                            <User className="text-fcs-teal" size={20} />
                            <h3 className="font-semibold text-lg">Personal Profile</h3>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center space-y-3">
                            <div className="relative group cursor-pointer">
                                <img src={formData.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md transition-transform duration-300 group-hover:scale-105" />
                                <button type="button" className="absolute bottom-0 right-0 p-2 bg-fcs-teal text-white rounded-full shadow-lg hover:bg-teal-700 transition-colors border-2 border-white">
                                    <Upload size={14} />
                                </button>
                            </div>
                            <span className="text-xs text-slate-500">JPG or PNG, max 1MB</span>
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="input-field bg-white/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Job Title</label>
                                <input name="role" value={formData.role} onChange={handleChange} className="input-field bg-white/50" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Work Email</label>
                                <input name="email" value={formData.email} onChange={handleChange} className="input-field bg-slate-50/50" readOnly />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-6 ring-1 ring-slate-900/5">
                    <div className="flex items-center gap-2 text-slate-800 mb-6">
                        <Bell className="text-fcs-teal" size={20} />
                        <h3 className="font-semibold text-lg">Notifications</h3>
                    </div>

                    <div className="space-y-4 divide-y divide-slate-100/50">
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shadow-sm border border-blue-100"><Mail size={18} /></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Email Alerts</p>
                                    <p className="text-xs text-slate-500">Receive emails for deadlines and risks.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="email" checked={formData.notifications.email} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fcs-teal shadow-inner"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shadow-sm border border-purple-100"><Smartphone size={18} /></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Push Notifications</p>
                                    <p className="text-xs text-slate-500">Browser alerts for immediate updates.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="push" checked={formData.notifications.push} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fcs-teal shadow-inner"></div>
                            </label>
                        </div>
                        
                         <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shadow-sm border border-orange-100"><FileText size={18} /></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Weekly Digest</p>
                                    <p className="text-xs text-slate-500">Summary of team activity every Monday.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="digest" checked={formData.notifications.digest} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fcs-teal shadow-inner"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Save Bar */}
                <div className="flex justify-end pt-4">
                     <button type="submit" disabled={isSaving} className="flex items-center px-6 py-2.5 bg-fcs-teal text-white rounded-lg hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSaving ? (
                            <>
                                <Loader2 size={18} className="animate-spin mr-2" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" /> Save Changes
                            </>
                        )}
                     </button>
                </div>
            </form>
            
            <div className="border-t border-slate-200/50 pt-6 mt-8">
                 <button className="flex items-center text-red-500 text-sm hover:text-red-700 font-medium p-2 hover:bg-red-50 rounded-lg transition-colors">
                     <LogOut size={16} className="mr-2" /> Sign Out
                 </button>
            </div>
        </div>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAIOpen, setIsAIOpen] = useState(false);
  
  // State management for mock data
  const [permits, setPermits] = useState<Permit[]>(MOCK_PERMITS);
  const [conditions, setConditions] = useState<Condition[]>(MOCK_CONDITIONS);
  const [evidence, setEvidence] = useState<Evidence[]>(MOCK_EVIDENCE);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Sarah Jenkins',
    role: 'Senior Project Manager',
    email: 's.jenkins@firstcarbonsolutions.com',
    avatarUrl: 'https://picsum.photos/id/64/100/100', // Better mock image
    notifications: {
        email: true,
        push: false,
        digest: true
    }
  });

  const handleAddPermit = (newPermit: Permit) => {
    setPermits([newPermit, ...permits]);
  };

  const handleDeletePermit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this permit record? This action cannot be undone.')) {
        setPermits(prev => prev.filter(p => p.id !== id));
        // Also remove associated conditions to keep data clean
        setConditions(prev => prev.filter(c => c.permitId !== id));
    }
  };

  const handleUpdatePermit = (updatedPermit: Permit) => {
      setPermits(prev => prev.map(p => p.id === updatedPermit.id ? updatedPermit : p));
  };

  const handleAddCondition = (newCondition: Condition) => {
    setConditions([newCondition, ...conditions]);
  };

  const handleUploadEvidence = (conditionId: string, file: File) => {
    // 1. Add to Evidence Store
    const newEvidence: Evidence = {
        id: `E-${Date.now()}`,
        conditionId: conditionId,
        fileName: file.name,
        uploadedBy: userProfile.name,
        uploadDate: new Date().toISOString().split('T')[0],
        tags: ['uploaded', 'condition-compliance']
    };
    setEvidence([newEvidence, ...evidence]);

    // 2. Update Condition Status
    setConditions(conditions.map(c => {
        if (c.id === conditionId) {
            return {
                ...c,
                evidenceUploaded: true,
                status: Status.COMPLIANT,
                riskLevel: RiskLevel.LOW
            };
        }
        return c;
    }));
  };

  const renderContent = () => {
    switch(currentPage) {
        case 'dashboard': return <DashboardPage permits={permits} conditions={conditions} onDeletePermit={handleDeletePermit} onUpdatePermit={handleUpdatePermit} />;
        case 'permits': return <PermitsPage permits={permits} onAdd={handleAddPermit} />;
        case 'conditions': return <ConditionsPage conditions={conditions} permits={permits} onAdd={handleAddCondition} onUploadEvidence={handleUploadEvidence} />;
        case 'evidence': return <EvidencePage evidence={evidence} />;
        case 'reports': return <ReportsPage permits={permits} conditions={conditions} />;
        case 'settings': return <SettingsPage user={userProfile} onUpdate={setUserProfile} />;
        default: return <div className="p-8 text-center text-slate-500">Page under construction</div>;
    }
  };

  return (
    <Layout 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        toggleAI={() => setIsAIOpen(!isAIOpen)}
        isAIArgs={isAIOpen}
        user={userProfile}
    >
      {renderContent()}
      <AIAssistant 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
        permits={permits}
        conditions={conditions}
      />
    </Layout>
  );
};

export default App;