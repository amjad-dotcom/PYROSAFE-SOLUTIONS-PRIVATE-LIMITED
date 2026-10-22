import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  History, 
  Mail, 
  Bell, 
  TrendingUp, 
  ExternalLink, 
  Code2, 
  Moon, 
  LogOut,
  ChevronRight,
  Database,
  Flame,
  CheckCircle2,
  Lock,
  RefreshCw,
  Server,
  Building2,
  Phone,
  MapPin,
  Edit3
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PageProps } from '../types';
import { authService } from '../services/authService';
import { invoiceService, MongoDbStatus } from '../services/invoiceService';
import { getCompanyProfile, saveCompanyProfile, DEFAULT_COMPANY_PROFILE, CompanyProfile } from '../lib/companyProfile';

export default function Settings({ navigateTo }: PageProps) {
  const [dbStatus, setDbStatus] = useState<MongoDbStatus | null>(null);
  const [customUri, setCustomUri] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const currentUser = authService.getCurrentUser();

  // Company Profile State
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(getCompanyProfile());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<CompanyProfile>(getCompanyProfile());

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveCompanyProfile(profileForm);
    setCompanyProfile(updated);
    setIsEditingProfile(false);
  };

  const loadStatus = async () => {
    try {
      const status = await invoiceService.getDbStatus();
      setDbStatus(status);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUri.trim()) return;
    setIsConnecting(true);
    setMessage(null);
    try {
      const res = await invoiceService.connectCustomMongo(customUri.trim());
      if (res.success) {
        setMessage({ text: 'MongoDB cluster connected and authenticated successfully!', isError: false });
        await loadStatus();
      } else {
        setMessage({ text: res.error || 'Connection failed.', isError: true });
      }
    } catch {
      setMessage({ text: 'Error connecting to database.', isError: true });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">System & Account Settings</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Pyrosafe Solutions Pvt Ltd • Infrastructure & Authentication
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-red-500/20 shrink-0">
          <Flame className="w-8 h-8" />
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Ravi (Super Admin)</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Authenticated
              </span>
            </div>
            <p className="text-xs font-mono text-slate-300 mt-1">pyrosafesolutions2026@gmail.com</p>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
              Pyrosafe Solutions Pvt Ltd • Master Admin Authority
            </p>
          </div>
        </div>
      </div>

      {/* Company Business Profile Card */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 tracking-tight">Registered Business Profile</h4>
              <p className="text-xs text-slate-500">Official GSTIN, legal registered office & billing entity details</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditingProfile ? 'Cancel Editing' : 'Edit Company Info'}
          </button>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Company Legal Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Contact Number</label>
                <input
                  type="text"
                  value={profileForm.contactNo}
                  onChange={(e) => setProfileForm({ ...profileForm, contactNo: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">GSTIN / Tax ID</label>
                <input
                  type="text"
                  value={profileForm.gstin}
                  onChange={(e) => setProfileForm({ ...profileForm, gstin: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Building No. / Flat No.</label>
                <input
                  type="text"
                  value={profileForm.buildingNo}
                  onChange={(e) => setProfileForm({ ...profileForm, buildingNo: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Name of Premises / Building</label>
                <input
                  type="text"
                  value={profileForm.premisesName}
                  onChange={(e) => setProfileForm({ ...profileForm, premisesName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Locality / Sub Locality</label>
                <input
                  type="text"
                  value={profileForm.locality}
                  onChange={(e) => setProfileForm({ ...profileForm, locality: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">State (Tax Code 04)</label>
                <input
                  type="text"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">PIN Code</label>
                <input
                  type="text"
                  value={profileForm.pinCode}
                  onChange={(e) => setProfileForm({ ...profileForm, pinCode: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProfileForm(DEFAULT_COMPANY_PROFILE)}
                className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Reset to Official Defaults
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Save Business Profile
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Legal Company Name</span>
                </div>
                <p className="font-bold text-slate-900 text-sm">{companyProfile.name}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-2">
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                  <span className="font-bold text-slate-800">Contact: {companyProfile.contactNo}</span>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  <span>GSTIN & Tax Registration</span>
                </div>
                <p className="font-mono font-black text-slate-900 text-base">{companyProfile.gstin}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                    Active GST State: {companyProfile.state} (04)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Registered Office Address</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Building No./Flat No.:</span>{' '}
                  <span className="font-bold text-slate-800">{companyProfile.buildingNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Name of Premises/Building:</span>{' '}
                  <span className="font-bold text-slate-800">{companyProfile.premisesName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Locality/Sub Locality:</span>{' '}
                  <span className="font-bold text-slate-800">{companyProfile.locality}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium">State & PIN:</span>{' '}
                  <span className="font-bold text-slate-800">{companyProfile.state}, PIN Code: {companyProfile.pinCode}</span>
                </div>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-200 text-xs font-mono text-slate-700">
                {companyProfile.fullAddress}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* MongoDB Database Configuration Section */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">MongoDB Invoice Database</h4>
              <p className="text-xs text-slate-500">Persistent storage & retrieval for tax invoices & billing records</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {dbStatus?.connected ? 'Cluster Live' : 'Active Store'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400">Database Name</span>
            <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">pyrosafe_db</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400">Target Collection</span>
            <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">invoices</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400">Access Point Security</span>
            <p className="font-semibold text-emerald-700 text-sm mt-0.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              Bearer Token Guarded
            </p>
          </div>
        </div>

        <form onSubmit={handleConnect} className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-700">
            MongoDB Connection URI (Atlas / Local Server)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customUri}
              onChange={(e) => setCustomUri(e.target.value)}
              placeholder="mongodb+srv://admin:pass@cluster.mongodb.net/pyrosafe_db"
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isConnecting || !customUri.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isConnecting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Testing...
                </>
              ) : (
                'Connect'
              )}
            </button>
          </div>
          {message && (
            <p className={cn("text-xs font-medium", message.isError ? "text-rose-600" : "text-emerald-600")}>
              {message.text}
            </p>
          )}
        </form>
      </section>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Team & Permissions */}
        <section className="space-y-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Governance & Team</h4>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            <SettingRow icon={Users} label="Collaborators & Engineers" subtitle="Field inspection crew & technician accounts" />
            <SettingRow icon={ShieldCheck} label="Access Permissions" subtitle="Granular role matrices & signing rights" />
            <SettingRow icon={History} label="Audit Journals" subtitle="MongoDB access & invoice modification logs" />
          </div>
        </section>

        {/* Infrastructure */}
        <section className="space-y-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Compliance & Infrastructure</h4>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            <SettingRow icon={ExternalLink} label="GST Portal Sync" subtitle="State 04 (Chandigarh) e-Invoice gateway • GSTIN: 04AAQCP8028G1Z7" isExternal />
            <SettingRow icon={Code2} label="API Token Keys" subtitle="HMAC SHA-256 tokens for automated sync" />
          </div>
        </section>

        {/* Terminate Session Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-4 text-rose-600 font-bold text-xs uppercase tracking-widest bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all active:scale-[0.99] shadow-sm cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out of Pyrosafe Admin Portal
        </button>
      </div>
    </div>
  );
}

function SettingRow({ icon: Icon, label, subtitle, isExternal }: any) {
  return (
    <div className="p-4 flex items-center gap-4 hover:bg-slate-50/80 cursor-pointer transition-all group">
      <div className={cn(
        "p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 transition-all shadow-sm",
        "group-hover:text-red-600 group-hover:border-red-100 group-hover:bg-red-50/50",
        isExternal && "text-blue-500"
      )}>
        <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-800 tracking-tight transition-colors group-hover:text-red-700">{label}</p>
        {subtitle && <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">{subtitle}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-red-500 transition-all group-hover:translate-x-1" />
    </div>
  );
}
