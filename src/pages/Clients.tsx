import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronRight, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/crm-utils';
import { PageProps } from '../types';

export default function Clients({ navigateTo }: PageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    { id: '1', gstin: '27AAACR1234J1Z2', name: 'Acme Solutions', email: 'billing@acme.co', status: 'Active', paymentStatus: 'Paid', ltv: 12400 },
    { id: '2', gstin: '29AAACI4567K2Z5', name: 'Global Tech Ltd', email: 'contact@globaltech.io', status: 'Pending', paymentStatus: 'Pending', ltv: 8200 },
    { id: '3', gstin: '27AAACT9876M1Z0', name: 'NextWave Creative', email: 'hello@nextwave.com', status: 'Active', paymentStatus: 'Overdue', ltv: 45000 },
    { id: '4', gstin: '24AAACA2345L1Z1', name: 'Blue Port Logistics', email: 'ops@blueport.net', status: 'Inactive', paymentStatus: 'Paid', ltv: 2100 },
  ];

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Clients Database</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage corporate & retail relationships</p>
        </div>
        <button 
          onClick={() => navigateTo('new-client')}
          className="flex items-center px-6 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-md hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          Register Client
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total active clients', value: '1,284', icon: TrendingUp, color: 'text-blue-600' },
          { label: 'Recurring Revenue', value: formatCurrency(245000), icon: TrendingUp, color: 'text-green-600' },
          { label: 'Pending Registrations', value: '12', icon: TrendingUp, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-4">
              {stat.label}
            </span>
            <div className="flex items-baseline justify-between">
              <span className={cn("text-2xl font-bold tracking-tight text-slate-900")}>
                {stat.value}
              </span>
              <stat.icon className={cn("w-4 h-4 opacity-30", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Action Bar */}
      <div className="flex gap-4 p-1">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text"
            placeholder="Search by company name, email or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium shadow-sm"
          />
        </div>
        <button className="px-4 bg-white border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 transition-colors shadow-sm flex items-center">
          <Filter className="w-4 h-4 mr-2 opacity-60" />
          <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
        </button>
      </div>

      {/* Client Data Grid */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-black bg-slate-50/50">
                <th className="px-6 py-4">Client Identification</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4">Financial Status</th>
                <th className="px-6 py-4 text-right">LTV Gross</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {filteredClients.map((client) => (
                <tr 
                  key={client.id}
                  onClick={() => navigateTo('client-detail', client.id)}
                  className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{client.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{client.gstin}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[11px] font-medium text-slate-600">{client.email}</div>
                    <div className="mt-1 flex items-center">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter",
                        client.status === 'Active' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                      )}>
                        {client.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center space-x-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                      client.paymentStatus === 'Paid' ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"
                    )}>
                      <div className={cn("w-1 h-1 rounded-full", client.paymentStatus === 'Paid' ? "bg-green-500" : "bg-rose-500")} />
                      <span>{client.paymentStatus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-black text-slate-900 tracking-tight">{formatCurrency(client.ltv)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-4 h-4 ml-auto text-slate-200 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span>Records up to date as of today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
