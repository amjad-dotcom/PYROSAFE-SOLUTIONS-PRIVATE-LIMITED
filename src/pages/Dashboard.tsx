import React from 'react';
import { 
  CreditCard, 
  Send, 
  Plus, 
  Download, 
  TrendingUp, 
  Briefcase, 
  Calendar, 
  CheckSquare,
  Boxes,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '../lib/crm-utils';
import { cn } from '../lib/utils';
import { PageProps } from '../types';
import { inventoryService } from '../services/inventoryService';
import { hrService } from '../services/hrService';
import { invoiceService } from '../services/invoiceService';

export default function Dashboard({ navigateTo }: PageProps) {
  const inventoryItems = inventoryService.getItems();
  const lowStockItems = inventoryItems.filter(i => i.currentStock > 0 && i.currentStock <= i.minStock);
  const outOfStockItems = inventoryItems.filter(i => i.currentStock === 0);
  const totalValuation = inventoryItems.reduce((acc, i) => acc + (i.currentStock * i.sellingRate), 0);

  const employees = hrService.getEmployees();
  const attendance = hrService.getAttendance();
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const onDutyCount = attendance.filter(a => a.status === 'On-Duty').length;

  const storedInvoices = invoiceService.getStoredInvoices();

  const stats = [
    { label: 'MTD Billing', value: '₹ 12,45,000.00', color: 'text-slate-900' },
    { label: 'Unpaid GST Liability', value: '₹ 2,24,100.00', color: 'text-rose-600' },
    { label: 'Inventory Asset Value', value: formatCurrency(totalValuation), color: 'text-slate-900', isInventory: true },
    { label: 'Field Staff Today', value: `${presentCount + onDutyCount} / ${employees.length} Active`, color: 'text-emerald-600', isHR: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-16">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => {
              if (stat.isInventory) navigateTo('inventory');
              if (stat.isHR) navigateTo('hr');
            }}
            className={cn(
              "bg-white p-6 h-32 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-red-300 transition-all",
              (stat.isInventory || stat.isHR) && "cursor-pointer"
            )}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                {stat.label}
              </span>
              {stat.isInventory && <Boxes className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />}
              {stat.isHR && <Users className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />}
            </div>
            <span className={cn("text-2xl font-bold tracking-tight", stat.color)}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* OPERATIONS HIGHLIGHTS: INVENTORY & HR DUAL BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inventory Quick Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:border-red-200 transition-all">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-100">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Safety Equipment Inventory</h3>
                <p className="text-[11px] text-slate-500">Live warehouse stock & automatic invoice deduction</p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('inventory')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center group"
            >
              Manage Stock
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total SKUs</span>
              <p className="text-base font-black text-slate-900">{inventoryItems.length}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-center">
              <span className="text-[10px] font-bold uppercase text-amber-700">Low Stock</span>
              <p className="text-base font-black text-amber-800">{lowStockItems.length} items</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg text-center">
              <span className="text-[10px] font-bold uppercase text-rose-700">Out of Stock</span>
              <p className="text-base font-black text-rose-800">{outOfStockItems.length} items</p>
            </div>
          </div>
        </div>

        {/* HR & Workforce Quick Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:border-red-200 transition-all">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">HR & Field Personnel</h3>
                <p className="text-[11px] text-slate-500">Engineers, inspectors, shift shifts & monthly payroll</p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('hr')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center group"
            >
              HR Portal
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Registered Staff</span>
              <p className="text-base font-black text-slate-900">{employees.length} People</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-center">
              <span className="text-[10px] font-bold uppercase text-emerald-700">HQ Present</span>
              <p className="text-base font-black text-emerald-800">{presentCount} Staff</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <span className="text-[10px] font-bold uppercase text-blue-700">Site Audits</span>
              <p className="text-base font-black text-blue-800">{onDutyCount} On-Duty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Data Grid Section */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            Recent Tax Invoices & Billing
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigateTo('invoices')}
              className="text-[11px] bg-white border border-slate-200 px-3 py-1.5 rounded-md font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              View All Invoices
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-black bg-slate-50/50">
                <th className="px-6 py-3">Inv #</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Inventory Sync</th>
                <th className="px-6 py-3 text-right">Taxable Total</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {storedInvoices.slice(0, 5).map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => navigateTo('invoices')}
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-500 font-bold">{row.number}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 tracking-tight group-hover:text-red-600 transition-colors">
                      {row.clientName || 'Pyrosafe Client'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium tracking-wider">{row.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    {row.deductedFromInventory ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Boxes className="w-3 h-3 text-emerald-600" />
                        Stock Deducted
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">Standard Service</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900 font-mono">
                    {formatCurrency(row.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest",
                      row.status === 'Paid' ? "bg-emerald-100 text-emerald-700" :
                      row.status === 'Overdue' ? "bg-rose-100 text-rose-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Context Helper Panel */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-1">Safety Compliant Billing & Stock Tracking</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-red-700 font-medium whitespace-nowrap">Services & Refilling (18% GST)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span className="text-xs text-red-700 font-medium whitespace-nowrap">Fire Extinguishers & Hardware (18% GST)</span>
              </div>
            </div>
          </div>
        </div>
        <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest hidden sm:block">Real-time Stock Ledger Sync</span>
      </div>
    </div>
  );
}
