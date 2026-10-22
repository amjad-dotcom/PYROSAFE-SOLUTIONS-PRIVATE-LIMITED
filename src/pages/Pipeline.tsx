import React from 'react';
import { Plus, MoreVertical, Clock, User, BarChart3, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/crm-utils';
import { PageProps } from '../types';

export default function Pipeline({ navigateTo }: PageProps) {
  const stages = [
    { 
      id: 'leads', 
      title: 'Incoming Leads', 
      count: 4, 
      color: 'bg-blue-600', 
      deals: [
        { company: 'Starlight Media', contact: 'Sarah Jenkins', value: 12000, active: '2d ago', owner: 'JD' },
        { company: 'Urban Outfitters', contact: 'Marcus Chen', value: 8500, active: '5h ago', owner: 'AM' },
        { company: 'Velocity SaaS', contact: 'Elena Rodriguez', value: 24000, active: '1d ago', owner: 'JD' },
      ]
    },
    { 
      id: 'proposal', 
      title: 'Proposal Drafted', 
      count: 2, 
      color: 'bg-indigo-500', 
      deals: [
        { company: 'Blue Chip Co', contact: 'David Wright', value: 45000, active: '12h ago', owner: 'AM' },
        { company: 'Nexus Design', contact: 'Lisa Wong', value: 15600, active: '2d ago', owner: 'JD' },
      ]
    },
    { 
      id: 'negotiation', 
      title: 'Negotiation', 
      count: 1, 
      color: 'bg-slate-700', 
      deals: [
        { company: 'Global Logistics', contact: 'Kevin Hart', value: 120000, active: '1h ago', owner: 'SK' },
      ]
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Sales Pipeline</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time revenue forecasting & tracking</p>
        </div>
        <button className="flex items-center px-6 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-md hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95">
          <Plus className="w-4 h-4 mr-2" />
          Add Opportunity
        </button>
      </div>

      {/* Tabs / Filters */}
      <div className="flex items-center gap-2 p-1">
        {['Active Deals', 'Archived', 'Reports'].map((tab, i) => (
          <button 
            key={i}
            className={cn(
              "whitespace-nowrap px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded transition-all",
              tab === 'Active Deals'
                ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                : "bg-white text-slate-400 border border-slate-200 hover:text-slate-600"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Pipeline Board */}
      <div className="flex flex-col lg:flex-row gap-6 items-start overflow-x-auto pb-4 scrollbar-hide">
        {stages.map((stage) => (
          <div key={stage.id} className="min-w-[320px] w-full lg:w-1/3 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 bg-slate-50 border-b border-slate-200 py-3 rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", stage.color)}></div>
                <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.15em]">{stage.title}</h3>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">{stage.count}</span>
              </div>
              <button className="text-slate-300 hover:text-slate-600 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {stage.deals.map((deal, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer group active:scale-[0.98]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-blue-600 transition-colors leading-tight">{deal.company}</h4>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">{deal.contact}</p>
                    </div>
                    <div className="w-8 h-8 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                      {deal.owner}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">Deal Value</span>
                      <p className="font-black text-slate-900 text-base tracking-tight">{formatCurrency(deal.value)}</p>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] bg-slate-50 px-2 py-1 rounded">
                      <Clock className="w-3 h-3 mr-1.5 text-blue-500" />
                      {deal.active}
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 hover:text-blue-500 hover:border-blue-100 hover:bg-blue-50/50 transition-all text-xs font-bold uppercase tracking-widest">
                + Drop new lead here
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Floating Summary */}
      <div className="sticky bottom-4 left-0 right-0 bg-slate-900 p-4 rounded-xl flex justify-between items-center z-30 shadow-2xl shadow-slate-400 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900" />
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Projected Q4</p>
            <p className="text-xl font-black text-white tracking-tight">{formatCurrency(319300)}</p>
          </div>
          <div className="h-10 w-px bg-slate-800 hidden md:block" />
          <div className="hidden md:block">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Confidence Score</p>
            <p className="text-xl font-black text-blue-500 tracking-tight">84%</p>
          </div>
        </div>
        <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40">
          <BarChart3 className="w-4 h-4 mr-2" />
          Full Analysis
        </button>
      </div>
      
      <div className="h-12"></div>
    </div>
  );
}
