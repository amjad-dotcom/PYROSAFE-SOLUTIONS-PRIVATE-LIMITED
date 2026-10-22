import React from 'react';
import { Plus, Receipt, FileText, ChevronRight, MoreVertical, Layout, CheckCircle2, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/crm-utils';
import { PageProps } from '../types';

export default function Quotes({ navigateTo }: PageProps) {
  const quotes = [
    { id: '1', client: 'Acme Corp', number: 'Q-2024-081', contact: 'Rajesh Kumar', status: 'Sent', hsn: '998311', amount: 85000, date: '12 Oct 2023' },
    { id: '2', client: 'Global Tech Solutions', number: 'Q-2024-078', contact: 'Sarah Chen', status: 'Accepted', hsn: '998713', amount: 240000, date: '08 Oct 2023' },
    { id: '3', client: 'Zylker Media Group', number: 'Q-2024-085', contact: 'Amit Singh', status: 'Draft', hsn: '998312', amount: 45200, date: '14 Oct 2023' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Quotations & Proformas</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage early-stage financial commitments</p>
        </div>
        <button 
          onClick={() => navigateTo('new-invoice')}
          className="flex items-center px-6 py-2.5 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-md hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Quote
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm flex flex-col justify-between group hover:border-red-200 transition-colors">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Total Sent Analysis</p>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-black text-slate-900 tracking-tight">₹ 4,20,000.00</p>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Active</span>
          </div>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-1 shadow-xl shadow-slate-200 flex flex-col justify-between group flex-none">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Pipeline Accepted</p>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-black text-white tracking-tight">₹ 12,80,000.00</p>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 overflow-x-auto scrollbar-hide">
        {['All Quotes', 'Sent', 'Draft', 'Accepted'].map((tab, i) => (
          <button 
            key={i}
            className={cn(
              "whitespace-nowrap px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded transition-all border",
              i === 0 
                ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                : "bg-white text-slate-400 border-slate-200 hover:text-slate-600 hover:border-slate-300 shadow-sm"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Quote Grid */}
      <div className="grid grid-cols-1 gap-4">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:border-red-300 transition-all">
            <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center">
              <div className="flex-1 space-y-1">
                <div className="flex items-baseline gap-2">
                  <h4 className="font-bold text-slate-800 tracking-tight group-hover:text-red-600 transition-colors">{quote.client}</h4>
                  <span className="text-xs font-mono text-slate-400">{quote.number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-slate-300" />
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">POC: {quote.contact}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:flex md:items-center md:gap-12 flex-shrink-0">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
                  <span className={cn(
                    "px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-[0.15em] inline-block mt-1",
                    quote.status === 'Accepted' ? "bg-green-100 text-green-700" :
                    quote.status === 'Sent' ? "bg-red-100 text-red-700" :
                    "bg-slate-100 text-slate-500"
                  )}>
                    {quote.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Gross Value</p>
                  <p className={cn(
                    "text-lg font-black tracking-tight mt-1",
                    quote.status === 'Accepted' ? "text-green-600" : "text-slate-900"
                  )}>
                    {formatCurrency(quote.amount)}
                  </p>
                </div>
              </div>

              <div className="md:border-l border-slate-100 md:pl-6 flex gap-3">
                {quote.status !== 'Draft' ? (
                  <button 
                    onClick={() => navigateTo('new-invoice')}
                    className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-red-700 transition-all shadow-md shadow-red-100"
                  >
                    <Receipt className="w-3.5 h-3.5 mr-2" />
                    Finalize Invoice
                  </button>
                ) : (
                  <button className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-50 transition-all">
                    Edit Draft
                  </button>
                )}
                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors border border-slate-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-slate-50/50 px-6 py-2 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <span>HSN Code: {quote.hsn}</span>
              <span>Created on {quote.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
