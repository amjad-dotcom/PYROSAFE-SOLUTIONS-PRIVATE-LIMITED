import React, { useState } from 'react';
import { ArrowLeft, Building2, Globe, Tag, User, Mail, Phone, IndianRupee, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { PageProps } from '../types';

export default function NewClient({ navigateTo }: PageProps) {
  return (
    <div className="space-y-10 max-w-2xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('clients')} className="p-2 -ml-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Onboard New Client</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Register new entity in agency CRM</p>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Company Info */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Corporate Profile</h3>
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Company Name" placeholder="e.g. Acme Corp" icon={<Building2 className="w-4 h-4" />} />
              <FormField label="GSTIN / VAT ID" placeholder="04AAACR1234A1Z1" icon="GST" />
              <FormField label="Website" placeholder="https://example.com" icon={<Globe className="w-4 h-4" />} />
              <FormField label="Industry Selector" placeholder="e.g. Software, Real Estate" icon={<Tag className="w-4 h-4" />} />
            </div>
          </div>
        </section>

        {/* Primary Contact */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Governance & POC</h3>
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormField label="Full Name of Primary Representative" placeholder="John Doe" icon={<User className="w-4 h-4" />} />
              </div>
              <FormField label="Official Email" placeholder="john@company.com" icon={<Mail className="w-4 h-4" />} />
              <FormField label="Contact Support" placeholder="+91 90000 00000" icon={<Phone className="w-4 h-4" />} />
            </div>
          </div>
        </section>

        {/* Financial Context */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Financial Potential</h3>
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Anticipated Annual Value" placeholder="₹ 0.00" icon={<IndianRupee className="w-4 h-4" />} />
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Initial Pipeline Phase</label>
                <div className="relative">
                  <select className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium appearance-none shadow-sm">
                    <option>Discovery / Lead</option>
                    <option>Qualification</option>
                    <option>Proposal Generation</option>
                    <option>Active Negotiation</option>
                    <option>Onboarded (Closed Won)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="space-y-4 pt-6">
          <button 
            onClick={() => navigateTo('clients')}
            className="w-full py-4 bg-blue-600 text-white rounded-md text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:translate-y-0"
          >
            Finalize Client Registration
          </button>
          <button 
            onClick={() => navigateTo('clients')}
            className="w-full py-4 bg-transparent text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Discard Registration Draft
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, placeholder, icon }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          {typeof icon === 'string' ? <span className="text-[10px] font-black font-mono">{icon}</span> : icon}
        </span>
        <input 
          type="text" 
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium outline-none shadow-sm"
        />
      </div>
    </div>
  );
}
