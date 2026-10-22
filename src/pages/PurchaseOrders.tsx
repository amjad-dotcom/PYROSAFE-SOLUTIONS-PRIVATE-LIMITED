import React from 'react';
import { Plus, ShoppingBag, Truck, CheckCircle2, ChevronRight, MoreVertical, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/crm-utils';
import { PageProps } from '../types';

export default function PurchaseOrders({ navigateTo }: PageProps) {
  const pos = [
    { id: '1', vendor: 'Global Tech Solutions', number: 'PO-2024-082', status: 'Partially Received', email: 'sales@globaltech.in', phone: '+91 98765 43210', amount: 1420000, items: '12x MacBook Air M3', eta: 'Oct 12' },
    { id: '2', vendor: 'Creative Cloud Agency', number: 'PO-2024-085', status: 'Sent', email: 'billing@creative.co', phone: '', amount: 450000, items: 'Q4 Brand Campaign', eta: '' },
    { id: '3', vendor: 'Office Depot India', number: 'PO-2024-079', status: 'Completed', email: '', phone: '', amount: 85400, items: 'Furniture & Stationaries', eta: '' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Purchase Orders</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage vendor procurement & tracking</p>
        </div>
        <button className="flex items-center px-6 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-md hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95">
          <Plus className="w-4 h-4 mr-2" />
          Generate PO
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-5 group hover:border-blue-200 transition-colors">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Procurement</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">14 <span className="text-[10px] font-bold text-slate-400 ml-1">Open Orders</span></p>
          </div>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-slate-200 flex items-center gap-5 group">
          <div className="p-3 bg-slate-800 rounded-lg text-blue-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregate Spend</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-white tracking-tight">₹ 8.4L</p>
              <span className="text-[10px] font-bold text-green-500 tracking-widest leading-none">+12% MoM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-1">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Purchase Order number or Vendor name..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium shadow-sm" 
          />
        </div>
        <div className="flex gap-2">
          {['Draft', 'Sent', 'Received', 'Done'].map((status) => (
            <button key={status} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm">
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Order List */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase px-1">Tracking Logistics</h3>
        <div className="grid grid-cols-1 gap-4">
          {pos.map((po) => (
            <div key={po.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:border-blue-300 transition-all cursor-pointer">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{po.number}</p>
                    <h4 className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-blue-600 transition-colors">{po.vendor}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      {po.email && <span className="text-[10px] text-slate-400 font-bold uppercase overflow-hidden truncate max-w-[200px]">Vendor: {po.email}</span>}
                      {po.phone && <span className="text-[10px] text-slate-400 font-bold uppercase">Ph: {po.phone}</span>}
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-black rounded uppercase tracking-[0.15em] border transition-all",
                    po.status === 'Completed' ? "bg-green-50 text-green-700 border-green-100" :
                    po.status === 'Partially Received' ? "bg-amber-50 text-amber-700 border-amber-100" :
                    "bg-blue-50 text-blue-700 border-blue-100"
                  )}>
                    {po.status}
                  </span>
                </div>

                <div className="bg-slate-50/80 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-100">
                  <div className="flex-1 space-y-1 w-full md:w-auto">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Procurement items</p>
                    <p className="text-sm font-bold text-slate-700 tracking-tight">{po.items}</p>
                    {po.eta && (
                      <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase mt-3 py-1 px-2 bg-white rounded border border-blue-100 inline-flex">
                        <Truck className="w-3.5 h-3.5" />
                        Next Arrival: {po.eta}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8 flex flex-col md:items-end">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Po Value</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">{formatCurrency(po.amount)}</p>
                    <div className="flex gap-4 mt-4">
                      <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline transition-all">Download PDF</button>
                      <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">Archive</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
