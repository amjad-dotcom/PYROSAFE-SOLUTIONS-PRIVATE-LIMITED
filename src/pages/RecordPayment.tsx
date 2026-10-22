import React, { useState } from 'react';
import { ArrowLeft, CreditCard, DollarSign, Calendar, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { PageProps } from '../types';

export default function RecordPayment({ navigateTo }: PageProps) {
  const [method, setMethod] = useState('Credit Card');
  const [status, setStatus] = useState('Paid');

  return (
    <div className="space-y-8 max-w-xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('dashboard')} className="p-2 -ml-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Record Payment</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manual collection override</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-xl shadow-slate-200">
          <CreditCard className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <FormField label="Client Name" defaultValue="Acme Corp Design System" icon="@" />
        <FormField label="Amount Recieved (INR)" placeholder="0.00" icon="₹" type="number" />
        <FormField label="Payment Date" defaultValue="Oct 24, 2024" icon={<Calendar className="w-4 h-4" />} />

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment Method</label>
          <div className="relative">
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium appearance-none"
            >
              <option>Credit Card</option>
              <option>Bank Transfer</option>
              <option>Cash</option>
              <option>UPI / QR Scan</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verification Status</label>
          <div className="grid grid-cols-2 gap-4">
            {['Paid', 'Pending'].map((s) => (
              <button 
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "px-4 py-3 rounded-md border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm",
                  status === s 
                    ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200" 
                    : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
                )}
              >
                {status === s && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl flex gap-5">
        <Info className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-[11px] text-blue-800 font-medium leading-relaxed uppercase tracking-tight">
          Recording this payment will update the client's <span className="font-black">LTV</span> and mark the associated invoice as <span className="font-black">Settled</span> in the tax ledger.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="w-full py-4 bg-blue-600 text-white rounded-md text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:translate-y-0"
        >
          Confirm Payment Record
        </button>
        <button 
          onClick={() => navigateTo('dashboard')}
          className="w-full py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-all"
        >
          Discard Entry
        </button>
      </div>
    </div>
  );
}

function FormField({ label, placeholder, defaultValue, icon, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          {typeof icon === 'string' ? <span className="text-xs font-bold font-mono">{icon}</span> : icon}
        </span>
        <input 
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium outline-none shadow-sm"
        />
      </div>
    </div>
  );
}
