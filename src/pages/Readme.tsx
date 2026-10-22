import React, { useState } from 'react';
import { 
  BookOpen, 
  Flame, 
  ShieldCheck, 
  Database, 
  Receipt, 
  Boxes, 
  Users, 
  Key, 
  Building2, 
  Phone, 
  MapPin, 
  FileCheck2, 
  Server, 
  Cpu, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Layers, 
  ArrowRight,
  Code,
  Sparkles,
  Lock,
  Clock,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { PageProps } from '../types';
import { DEFAULT_COMPANY_PROFILE, getCompanyProfile } from '../lib/companyProfile';

export default function Readme({ navigateTo }: PageProps) {
  const profile = getCompanyProfile();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'gst-invoicing' | 'inventory-hr' | 'api-security'>('overview');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400">
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>Pyrosafe Enterprise System v2.6.4</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
              System Documentation & README
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Complete operational, architectural, and compliance guide for <strong className="text-white">Pyrosafe Solutions Pvt Ltd</strong>. 
              Encompassing client pipeline CRM, automated GST tax invoicing, real-time inventory tracking, and HR payroll administration.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              onClick={() => navigateTo('dashboard')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigateTo('invoices')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 text-red-400" />
              <span>Tax Invoices</span>
            </button>
          </div>
        </div>

        {/* Status badges */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">MongoDB Store</p>
              <p className="text-slate-200 font-mono font-medium">pyrosafe_db (Live)</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Security</p>
              <p className="text-slate-200 font-medium">Session RBAC Active</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-4 h-4 text-orange-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tax Compliance</p>
              <p className="text-slate-200 font-medium">GSTIN 04AAQCP8028G1Z7</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-red-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Jurisdiction</p>
              <p className="text-slate-200 font-medium">Chandigarh (Code 04)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-red-600 text-red-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Entity & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'modules'
              ? 'border-red-600 text-red-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Core Modules</span>
        </button>

        <button
          onClick={() => setActiveTab('gst-invoicing')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'gst-invoicing'
              ? 'border-red-600 text-red-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>3. GST Invoicing Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory-hr')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'inventory-hr'
              ? 'border-red-600 text-red-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>4. Inventory & HR Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('api-security')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'api-security'
              ? 'border-red-600 text-red-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>5. Architecture & Credentials</span>
        </button>
      </div>

      {/* Tab 1: Overview & Verified Entity Profile */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Company Details Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">Verified Corporate Entity</span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">{profile.name}</h2>
                <p className="text-xs text-slate-500">Ministry of Corporate Affairs & Goods and Services Tax Network Verified</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('settings')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Edit in Settings
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/70">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider">GSTIN / Tax ID</span>
                  <button 
                    onClick={() => copyToClipboard(profile.gstin, 'gstin')}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Copy GSTIN"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-mono font-bold text-slate-900 text-base">{profile.gstin}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">State: Chandigarh (Code 04)</p>
                {copiedKey === 'gstin' && <span className="text-[10px] text-red-600 font-bold">Copied!</span>}
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/70">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider">Contact Number</span>
                  <button 
                    onClick={() => copyToClipboard(profile.contactNo, 'phone')}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Copy Phone"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-mono font-bold text-slate-900 text-base">{profile.contactNo}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Direct Lines & WhatsApp Dispatch</p>
                {copiedKey === 'phone' && <span className="text-[10px] text-red-600 font-bold">Copied!</span>}
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/70">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider">Official Email</span>
                  <button 
                    onClick={() => copyToClipboard(profile.email, 'email')}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Copy Email"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-mono font-bold text-slate-900 text-sm truncate">{profile.email}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Support & Audit Inquiries</p>
                {copiedKey === 'email' && <span className="text-[10px] text-red-600 font-bold">Copied!</span>}
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/70">
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider">Premises & Pin</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">North Hub</span>
                </div>
                <p className="font-bold text-slate-900 text-sm">{profile.buildingNo}, {profile.premisesName}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">PIN: {profile.pinCode}, India</p>
              </div>
            </div>

            {/* Address Breakdown */}
            <div className="mt-6 p-4 rounded-lg bg-red-50/50 border border-red-100 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Full Registered Operating Address:</span>
                  <p className="mt-0.5 font-medium text-slate-800">{profile.fullAddress}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Industrial Area Phase 1 Chandigarh serves as the central fulfillment, testing, and refill facility for all firefighting appliances, hydrants, and suppression systems.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => navigateTo('invoices')}
              className="group p-5 bg-white rounded-xl border border-slate-200 hover:border-red-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Receipt className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Tax Invoicing Engine</h3>
              <p className="text-xs text-slate-500 mt-1">
                Issue GST-compliant invoices with automatic CGST+SGST or IGST tax calculations, dual-copy printing, and MongoDB record sync.
              </p>
            </div>

            <div 
              onClick={() => navigateTo('inventory')}
              className="group p-5 bg-white rounded-xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Boxes className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-600 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Inventory & Auto-Deduction</h3>
              <p className="text-xs text-slate-500 mt-1">
                Live stock levels for extinguishers, foam concentrates, sprinkler heads, and valves. Auto-deducts quantities when invoices are billed.
              </p>
            </div>

            <div 
              onClick={() => navigateTo('hr')}
              className="group p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">HR & Technician Hub</h3>
              <p className="text-xs text-slate-500 mt-1">
                Manage field safety engineers, generate printable payroll pay-slips, track safety certifications, and view departmental metrics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Core Modules */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales CRM */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Sales Pipeline & CRM</h3>
                  <span className="text-[11px] text-slate-500">Commercial & Industrial Client Onboarding</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Enables end-to-end client lifecycle management for manufacturing plants, hospitals, commercial plazas, and hotels requiring mandatory fire safety certifications.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pipeline stages: Lead, Qualified, Site Audit, Proposal, Negotiation, Closed Won</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Client GSTIN and State Code tagging for automated tax bifurcation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Site audit notes and annual maintenance contract (AMC) alerts</span>
                </li>
              </ul>
              <button
                onClick={() => navigateTo('pipeline')}
                className="mt-5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Open Pipeline Board
              </button>
            </div>

            {/* Quotes & Proforma */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Quotes & Proforma Invoices</h3>
                  <span className="text-[11px] text-slate-500">Fast Quotations & AMC Proposals</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Draft professional fire installation proposals with accurate line item HSN rates, customer terms, and one-click conversion directly into formal Tax Invoices.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Convert Quote directly into a final Tax Invoice in 1 click</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Auto-loads catalog items, HSN numbers, and GST percentages</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Validity dates, terms & conditions, and bank RTGS coordinates</span>
                </li>
              </ul>
              <button
                onClick={() => navigateTo('quotes')}
                className="mt-5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Manage Quotes
              </button>
            </div>

            {/* Purchase Orders */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Vendor Purchase Orders</h3>
                  <span className="text-[11px] text-slate-500">OEM Equipment Procurement</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Issue procurement POs to raw material suppliers for dry chemical powder (ABC powder), seamless gas cylinders, brass couplings, and fire hydrant valves.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Track PO statuses: Draft, Sent, Partially Received, Completed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct restocking links into the Inventory management catalog</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vendor GSTIN verification & shipping terms</span>
                </li>
              </ul>
              <button
                onClick={() => navigateTo('po')}
                className="mt-5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                View Purchase Orders
              </button>
            </div>

            {/* Task Management */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Field Tasks & Audits</h3>
                  <span className="text-[11px] text-slate-500">Hydro-testing & Extinguisher Refills</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Schedule periodic extinguisher weight checks, pressure gauge inspections, hydro-testing cycles, and NOC documentation submissions for fire authorities.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Priorities: High (Emergency), Medium (Inspection), Low (Preventive)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Assigned directly to certified Pyrosafe field technicians</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Completion logs with client sign-off records</span>
                </li>
              </ul>
              <button
                onClick={() => navigateTo('tasks')}
                className="mt-5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Go to Tasks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: GST Invoicing Engine */}
      {activeTab === 'gst-invoicing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Indian GST Calculation Rules</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl mb-6">
              The billing system detects the customer&apos;s billing state code compared against Pyrosafe&apos;s home state 
              (<strong className="text-slate-900">Chandigarh - State Code 04</strong>) and applies tax splits automatically.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">Intra-State Supply (Within Chandigarh)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">State Code 04</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Applied when supplying to businesses or facilities registered in Chandigarh (e.g. Industrial Area Phase 1 & 2, IT Park, Sector 17).
                </p>
                <div className="space-y-2 text-xs font-mono bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">CGST (Central GST):</span>
                    <span className="font-bold text-slate-900">9.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SGST (State GST):</span>
                    <span className="font-bold text-slate-900">9.0%</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-1 font-bold text-red-600">
                    <span>Total Effective GST:</span>
                    <span>18.0%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Inter-State Supply (Punjab, Haryana, Delhi, etc.)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">Code ≠ 04</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Applied when shipping firefighting systems across state lines (e.g., Mohali / Punjab Code 03, Panchkula / Haryana Code 06, Delhi Code 07).
                </p>
                <div className="space-y-2 text-xs font-mono bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">IGST (Integrated GST):</span>
                    <span className="font-bold text-slate-900">18.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CGST / SGST:</span>
                    <span className="font-bold text-slate-400">0.0%</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-1 font-bold text-blue-600">
                    <span>Total Effective GST:</span>
                    <span>18.0%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Fire Safety HSN Codes */}
            <div className="mt-8">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Pre-Configured Fire Safety HSN Code Directory</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">HSN Code</th>
                      <th className="py-2.5 px-4">Equipment / Service Category</th>
                      <th className="py-2.5 px-4">Standard GST Rate</th>
                      <th className="py-2.5 px-4">IS Standard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600">
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">8424</td>
                      <td className="py-2.5 px-4">Mechanical Appliances for Projecting liquids / Fire Extinguishers</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">18%</td>
                      <td className="py-2.5 px-4">IS:15683</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">8531</td>
                      <td className="py-2.5 px-4">Electric sound or visual signalling apparatus (Smoke detectors, MCP, Sirens)</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">18%</td>
                      <td className="py-2.5 px-4">IS:2189</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">3813</td>
                      <td className="py-2.5 px-4">Preparations and charges for fire-extinguishers; charged fire-extinguishing grenades</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">18%</td>
                      <td className="py-2.5 px-4">IS:4308</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">8481</td>
                      <td className="py-2.5 px-4">Taps, cocks, valves & similar appliances (Hydrant landing valves, Sprinkler heads)</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">18%</td>
                      <td className="py-2.5 px-4">IS:5290</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">9987</td>
                      <td className="py-2.5 px-4">Annual Maintenance Contract (AMC), Hydro-testing & Refilling Service Charges</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">18%</td>
                      <td className="py-2.5 px-4">NBC 2016 Part 4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => navigateTo('new-invoice')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <span>Create New Invoice Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Inventory & HR Hub */}
      {activeTab === 'inventory-hr' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inventory Auto-Deduction Engine */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Inventory & Auto-Deduction Engine</h3>
                  <span className="text-[11px] text-slate-500">Synchronized Stock & Billing</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Whenever a Tax Invoice or Bill of Supply is issued, the inventory engine automatically looks up the item SKU / ID and deducts the billed quantity from the warehouse inventory.
              </p>

              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                  <p className="text-slate-700"><strong>Catalog Selection:</strong> Line items picked in the invoice creator link to registered inventory SKUs.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                  <p className="text-slate-700"><strong>Auto Decrement:</strong> On saving the invoice, stock counts reduce immediately with real-time audit logs.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                  <p className="text-slate-700"><strong>Low-Stock Safeguards:</strong> Alerts trigger when items cross re-order minimum thresholds (e.g. &lt; 15 units).</p>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => navigateTo('inventory')}
                  className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Manage Inventory & Stock
                </button>
              </div>
            </div>

            {/* HR & Workforce */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">HR & Safety Engineering Workforce</h3>
                  <span className="text-[11px] text-slate-500">Payroll, Payslips & Field Certifications</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Centralized management for fire safety engineers, hydrants fabricators, refilling operators, and compliance managers.
              </p>

              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-slate-700"><strong>One-Click Payslip Generation:</strong> Creates printable salary slips with Basic, HRA, PF (Provident Fund), and ESIC breakdown.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-slate-700"><strong>Safety & NFPA Certifications:</strong> Tracks technician credentials, fire safety licenses, and validity cycles.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-slate-700"><strong>Attendance & Leave Management:</strong> Monthly attendance records with present/leave metrics and overtime calculations.</p>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => navigateTo('hr')}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Open HR & Payroll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Architecture & Credentials */}
      {activeTab === 'api-security' && (
        <div className="space-y-6">
          {/* Default Credentials Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-red-600 font-bold uppercase tracking-wider text-xs">
              <Lock className="w-4 h-4" />
              <span>System Authentication & Administrative Credentials</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Administrative Access Credentials</h3>
            <p className="text-xs text-slate-500 mb-5">
              The portal is secured by password authentication protecting all financial, GST, payroll, and MongoDB database endpoints.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-bold uppercase tracking-wider">Admin User ID / Email</span>
                  <button 
                    onClick={() => copyToClipboard('pyrosafesolutions2026@gmail.com', 'admin_id')}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Copy Admin ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-mono font-bold text-slate-900 text-sm">pyrosafesolutions2026@gmail.com</p>
                {copiedKey === 'admin_id' && <span className="text-[10px] text-red-600 font-bold">Copied to clipboard!</span>}
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-bold uppercase tracking-wider">Default Password</span>
                  <button 
                    onClick={() => copyToClipboard('Ravi@1993', 'admin_pwd')}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Copy Password"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-mono font-bold text-slate-900 text-sm">Ravi@1993</p>
                {copiedKey === 'admin_pwd' && <span className="text-[10px] text-red-600 font-bold">Copied to clipboard!</span>}
              </div>
            </div>
          </div>

          {/* MongoDB & Backend Architecture */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold uppercase tracking-wider text-xs">
              <Database className="w-4 h-4" />
              <span>Full-Stack Architecture & Data Flow</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Express.js + MongoDB Invoice Proxy</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 text-xs">
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-900 block mb-1">1. Frontend Layer</span>
                <p className="text-slate-600">
                  React 19 + TypeScript + Tailwind CSS. Provides instant UI interactions, optimistic updates, offline fallback, and dual-copy GST tax invoice rendering.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-900 block mb-1">2. Backend Proxy Layer</span>
                <p className="text-slate-600">
                  Node.js / Express (<code className="font-mono text-red-600">server.ts</code>) listening on port 3000. Provides authenticated REST endpoints, auth validation, and stock decrement triggers.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-900 block mb-1">3. Storage Layer</span>
                <p className="text-slate-600">
                  MongoDB cluster (<code className="font-mono text-emerald-600">pyrosafe_db</code>) persisting collections: <code className="font-mono">invoices</code>, <code className="font-mono">inventory</code>, <code className="font-mono">audit_logs</code>.
                </p>
              </div>
            </div>

            {/* API Endpoints Table */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Core REST API Endpoints</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Method</th>
                    <th className="py-2.5 px-4">Route</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4">Security Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-slate-600">
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-blue-600">POST</td>
                    <td className="py-2.5 px-4 text-slate-900">/api/auth/login</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Authenticates admin with email & password</td>
                    <td className="py-2.5 px-4 font-sans text-emerald-600 font-semibold">Public (Rate limited)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-emerald-600">GET</td>
                    <td className="py-2.5 px-4 text-slate-900">/api/invoices</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Fetches all persistent invoice documents from MongoDB</td>
                    <td className="py-2.5 px-4 font-sans text-amber-600 font-semibold">Bearer / Session Token</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-blue-600">POST</td>
                    <td className="py-2.5 px-4 text-slate-900">/api/invoices</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Inserts a new GST tax invoice into MongoDB collection</td>
                    <td className="py-2.5 px-4 font-sans text-amber-600 font-semibold">Bearer / Session Token</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-emerald-600">GET</td>
                    <td className="py-2.5 px-4 text-slate-900">/api/status</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Returns MongoDB connection health, latency, & doc count</td>
                    <td className="py-2.5 px-4 font-sans text-emerald-600 font-semibold">Public Health Check</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-blue-600">POST</td>
                    <td className="py-2.5 px-4 text-slate-900">/api/inventory/deduct</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Automatically reduces stock when invoice is finalized</td>
                    <td className="py-2.5 px-4 font-sans text-amber-600 font-semibold">Bearer / Session Token</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Footer / Copyright */}
      <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-600">Pyrosafe Solutions Pvt Ltd &copy; 2026. All rights reserved.</p>
        <p className="mt-1">
          PLOT NO 149, PRESS SITE, INDUSTRIAL AREA PHASE 1, Chandigarh - 160002 &bull; GSTIN: 04AAQCP8028G1Z7 &bull; Ph: 9136406255
        </p>
      </div>
    </div>
  );
}
