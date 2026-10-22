import React from 'react';
import { ArrowLeft, Edit2, MoreVertical, Phone, Mail, ChevronRight, Plus, ExternalLink, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/crm-utils';
import { ClientDetailProps } from '../types';

export default function ClientDetail({ clientId, navigateTo }: ClientDetailProps) {
  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
        <div className="flex items-center gap-6">
          <button onClick={() => navigateTo('clients')} className="p-2 -ml-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors border border-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">NextWave Creative</h2>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded border border-blue-100">Key Account</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Acquisition Date: 12 Jan 2024</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 bg-white border border-slate-200 rounded-md hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 bg-white border border-slate-200 rounded-md hover:text-slate-600 transition-all shadow-sm">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="md:col-span-1 space-y-8 text-slate-900 border-r border-slate-200 pr-8 hidden md:block">
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Protocols</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm group hover:border-blue-200 transition-all cursor-pointer">
                <Mail className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                <span className="text-xs font-bold text-slate-600">hello@nextwave.com</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm group hover:border-blue-200 transition-all cursor-pointer">
                <Phone className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                <span className="text-xs font-bold text-slate-600">+91 91234 56789</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance Data</h3>
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl shadow-slate-200 space-y-3">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">GSTIN Number</p>
                <p className="text-xs font-mono font-bold text-white mt-1 uppercase">04AAACT9876M1Z0</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Place of Supply</p>
                <p className="text-xs font-bold text-blue-400 mt-1 uppercase tracking-tight">Chandigarh (CH - 04)</p>
              </div>
            </div>
          </section>
        </div>

        {/* Main Column: Tabbed Content */}
        <div className="md:col-span-2 space-y-10">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-blue-200 transition-colors">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Gross LTV</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(450000)}</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-blue-200 transition-colors">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Collections Status</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-green-600 tracking-tight">₹ 3.8L</p>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Settled</span>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Ledger & Activity</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => navigateTo('new-invoice')}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                >
                  New Invoice
                </button>
                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">View All</button>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { type: 'Invoice', id: 'INV-2024-0044', status: 'Paid', amount: 120000, date: '12 Oct' },
                { type: 'Payment', id: 'PAY-8821', status: 'Settled', amount: 85000, date: '10 Oct' },
                { type: 'Quote', id: 'QUO-0812', status: 'Accepted', amount: 450000, date: '08 Oct' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      activity.type === 'Invoice' ? "bg-blue-500" :
                      activity.type === 'Payment' ? "bg-green-500" : "bg-indigo-500"
                    )} />
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{activity.id} <span className="text-slate-400 ml-2 font-medium">({activity.type})</span></p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900 tracking-tight">{formatCurrency(activity.amount)}</p>
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-widest mt-0.5",
                      activity.status === 'Paid' || activity.status === 'Settled' ? "text-green-500" : "text-blue-500"
                    )}>{activity.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Tasks */}
          <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Pulse</h3>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 border border-slate-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">No critical bottlenecks</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase mt-1 tracking-widest">Everything is running according to service level agreements</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E3E8EF] shadow-sm space-y-1">
      <p className="text-[10px] font-bold text-[#697386] uppercase tracking-wider">{label}</p>
      <p className="text-lg font-extrabold text-[#3C4257]">{value}</p>
    </div>
  );
}

function PaymentRow({ date, amount, status }: any) {
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-bold text-[#3C4257]">{date}</p>
        <p className="text-xs font-medium text-[#697386]">Transactional Payment</p>
      </div>
      <div className="text-right space-y-1">
        <p className="text-sm font-extrabold text-[#3C4257]">₹{amount}</p>
        <span className={cn(
          "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
          status === 'Paid' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        )}>
          {status}
        </span>
      </div>
    </div>
  );
}

function DealBadge({ name, stage, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#E3E8EF] shadow-sm flex items-center justify-between group hover:border-[#635BFF] cursor-pointer transition-all">
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-[#3C4257] group-hover:text-[#635BFF] flex items-center">
          {name}
          <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] ml-2" />
        </h4>
        <p className="text-xs text-[#A3ACB9] font-medium">{stage} • Value: ₹{value}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#E3E8EF] group-hover:text-[#635BFF]" />
    </div>
  );
}

function ActivityItem({ type, title, time, desc, last }: any) {
  const icons = {
    call: <Phone className="w-3.5 h-3.5" />,
    deal: <Calendar className="w-3.5 h-3.5" />,
    note: <Mail className="w-3.5 h-3.5" />
  };
  
  return (
    <div className="flex gap-6 relative z-10">
      <div className="shrink-0 w-8 h-8 rounded-full bg-[#F6F9FC] border border-[#E3E8EF] flex items-center justify-center text-[#635BFF] z-10">
        {icons[type as keyof typeof icons]}
      </div>
      <div className="flex-1 space-y-1 pb-4">
        <div className="flex justify-between items-start">
          <h5 className="text-sm font-bold text-[#3C4257]">{title}</h5>
          <span className="text-[10px] font-bold text-[#A3ACB9] uppercase">{time}</span>
        </div>
        <p className="text-xs text-[#697386] leading-relaxed italic">{desc}</p>
      </div>
    </div>
  );
}
