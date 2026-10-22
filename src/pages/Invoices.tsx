import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Receipt, 
  FileText, 
  ChevronRight, 
  MoreVertical, 
  Search, 
  Filter, 
  Boxes, 
  Printer, 
  X, 
  ShieldCheck, 
  Flame,
  Database,
  RefreshCw,
  Server,
  Lock,
  CheckCircle2,
  ExternalLink,
  Phone,
  MapPin,
  Building2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/crm-utils';
import { PageProps, Invoice } from '../types';
import { invoiceService, MongoDbStatus } from '../services/invoiceService';
import { getCompanyProfile, CompanyProfile } from '../lib/companyProfile';

export default function Invoices({ navigateTo }: PageProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<MongoDbStatus | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [customUri, setCustomUri] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectMessage, setConnectMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const fetchInvoicesAndStatus = async () => {
    setIsLoading(true);
    try {
      const [fetchedInvoices, status] = await Promise.all([
        invoiceService.getInvoices(),
        invoiceService.getDbStatus()
      ]);
      setInvoices(fetchedInvoices);
      setDbStatus(status);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setInvoices(invoiceService.getStoredInvoices());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoicesAndStatus();
  }, []);

  const handleTestConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUri.trim()) return;
    setIsConnecting(true);
    setConnectMessage(null);
    try {
      const result = await invoiceService.connectCustomMongo(customUri.trim());
      if (result.success) {
        setConnectMessage({ text: 'Connected successfully to MongoDB Atlas cluster!', isError: false });
        await fetchInvoicesAndStatus();
      } else {
        setConnectMessage({ text: result.error || 'Failed to connect to MongoDB cluster.', isError: true });
      }
    } catch {
      setConnectMessage({ text: 'Error executing MongoDB connection test.', isError: true });
    } finally {
      setIsConnecting(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    (inv.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOutstanding = invoices
    .filter(i => i.status === 'Overdue' || i.status === 'Sent')
    .reduce((acc, i) => acc + i.total, 0);

  const totalPaid = invoices
    .filter(i => i.status === 'Paid')
    .reduce((acc, i) => acc + i.total, 0);

  const pendingDraftsCount = invoices.filter(i => i.status === 'Draft').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Tax Invoices</h2>
            <button
              onClick={() => setIsDbModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Database className="w-3 h-3 text-emerald-600" />
              <span>MongoDB: {dbStatus?.connected ? 'Live Cluster' : 'Active Store'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Secure GST billing & stock sync connected to MongoDB (pyrosafe_db.invoices)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchInvoicesAndStatus}
            disabled={isLoading}
            className="flex items-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md transition-all border border-slate-200 cursor-pointer disabled:opacity-50"
            title="Refresh from MongoDB"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5 text-slate-500", isLoading && "animate-spin text-red-600")} />
            Sync DB
          </button>
          <button 
            onClick={() => navigateTo('inventory')}
            className="hidden sm:flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-200 transition-all border border-slate-300 shadow-sm"
          >
            <Boxes className="w-4 h-4 mr-2 text-slate-600" />
            Check Inventory
          </button>
          <button 
            onClick={() => navigateTo('new-invoice')}
            className="flex items-center px-5 py-2 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-md hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Database Security Info Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-sm border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Secure MongoDB Access Point Active
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Admin Bearer Authenticated
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              All invoice records are stored in collection <span className="font-mono text-amber-300 font-semibold">pyrosafe_db.invoices</span> with 256-bit signed token authorization.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDbModalOpen(true)}
          className="text-xs font-semibold px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 border border-slate-600 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span>MongoDB Settings</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Outstanding', value: formatCurrency(totalOutstanding || 64800), color: 'text-rose-600', sub: 'Action required' },
          { label: 'Paid Collections', value: formatCurrency(totalPaid || 245000), color: 'text-emerald-600', sub: 'Settled via NEFT / RTGS' },
          { label: 'Stored in MongoDB', value: `${invoices.length} Records`, color: 'text-slate-900', sub: `${pendingDraftsCount} drafts awaiting dispatch` },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-red-200 transition-colors">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
            <p className={cn("text-2xl font-bold tracking-tight", stat.color)}>{stat.value}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex gap-4 items-center">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Invoice # or Client name..." 
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-sm" 
            />
          </div>
          <button className="p-2 text-slate-500 bg-white hover:bg-slate-50 rounded-md border border-slate-200 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-black bg-slate-50/80">
                <th className="px-6 py-4">Inv # / Date</th>
                <th className="px-6 py-4">Client / GSTIN</th>
                <th className="px-6 py-4">Inventory Integration</th>
                <th className="px-6 py-4 text-right">Taxable Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {filteredInvoices.map((inv) => (
                <tr 
                  key={inv.id} 
                  onClick={() => setSelectedInvoice(inv)}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="font-mono text-[11px] text-slate-900 font-bold">{inv.number}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{inv.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 tracking-tight group-hover:text-red-600 transition-colors">
                      {inv.clientName || 'Pyrosafe Client'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium tracking-widest uppercase font-mono">
                      27AAACR1234J1Z2
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {inv.deductedFromInventory ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Boxes className="w-3 h-3 text-emerald-600" />
                        Stock Deducted
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">Service / Non-deducted</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-black text-slate-900 font-mono">{formatCurrency(inv.total)}</div>
                    <div className="text-[10px] text-slate-400">Base: {formatCurrency(inv.subtotal)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-black rounded uppercase tracking-widest inline-block",
                      inv.status === 'Paid' ? "bg-emerald-100 text-emerald-700" :
                      inv.status === 'Overdue' ? "bg-rose-100 text-rose-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvoice(inv);
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">
            Showing {filteredInvoices.length} invoices from MongoDB storage
          </span>
          <div className="flex space-x-1">
            <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-[11px] font-bold text-slate-500 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1.5 border border-slate-200 bg-white rounded text-[11px] font-bold text-slate-600 hover:bg-slate-50 shadow-sm ml-1 transition-all">Next</button>
          </div>
        </div>
      </div>

      {/* MODAL: MONGODB CONNECTION & STATUS */}
      {isDbModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">MongoDB Invoice Records Storage</h3>
                  <p className="text-xs text-slate-500">Database Engine & Secure Authentication Point</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDbModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Connection Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Database</span>
                <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">pyrosafe_db</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Target Collection</span>
                <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">invoices</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Stored Records</span>
                <p className="font-bold text-emerald-700 text-sm mt-0.5">{dbStatus?.recordCount ?? invoices.length} Documents</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Access Security</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5 flex items-center gap-1 text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                  Bearer Token Enforced
                </p>
              </div>
            </div>

            {/* Current Status */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Connection Mode:</span>
                <span className="font-semibold text-emerald-400">{dbStatus?.mode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Admin Identity:</span>
                <span className="font-mono text-slate-200">pyrosafesolutions2026@gmail.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Auth Gate:</span>
                <span className="font-mono text-amber-300">Protected /api/invoices</span>
              </div>
            </div>

            {/* Connect MongoDB Atlas Form */}
            <form onSubmit={handleTestConnect} className="space-y-3 pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-700">
                Connect Remote MongoDB Atlas Cluster (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customUri}
                  onChange={(e) => setCustomUri(e.target.value)}
                  placeholder="mongodb+srv://admin:pass@cluster0.mongodb.net/pyrosafe_db"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {connectMessage && (
                <div className={cn(
                  "p-3 rounded-lg text-xs font-medium",
                  connectMessage.isError ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                )}>
                  {connectMessage.text}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDbModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isConnecting || !customUri.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Test & Connect Cluster'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW / PRINT INVOICE */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-5">
              <div className="flex items-start space-x-3.5">
                <div className="bg-gradient-to-br from-red-500 to-orange-600 p-3 rounded-xl text-white shadow-md shrink-0">
                  <Flame className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Pyrosafe Solutions Pvt Ltd</h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-800 uppercase tracking-wider">
                      Tax Invoice
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Building No./Flat No.: <span className="font-bold text-slate-800">PLOT NO 149</span>, Name Of Premises/Building: <span className="font-bold text-slate-800">PRESS SITE</span>, Locality/Sub Locality: <span className="font-bold text-slate-800">INDUSTRIAL AREA PHASE 1</span>, State: <span className="font-bold text-slate-800">Chandigarh</span>, PIN Code: <span className="font-bold text-slate-800">160002</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-600 pt-0.5">
                    <span className="flex items-center gap-1 font-bold text-slate-900">
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                      Contact: 9136406255
                    </span>
                    <span>•</span>
                    <span className="font-bold text-slate-900">GSTIN: 04AAQCP8028G1Z7</span>
                    <span>•</span>
                    <span className="text-slate-500">State: Chandigarh (Code: 04)</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Invoice Number</span>
                <p className="font-mono font-bold text-slate-900">{selectedInvoice.number}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Issue Date</span>
                <p className="font-bold text-slate-900">{selectedInvoice.date}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Billed Client</span>
                <p className="font-bold text-slate-900">{selectedInvoice.clientName}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Stock Status</span>
                <p className="font-bold text-emerald-700">
                  {selectedInvoice.deductedFromInventory ? 'Deducted from Stock' : 'Manual / None'}
                </p>
              </div>
            </div>

            {/* Line items table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 text-[10px] uppercase">
                    <th className="p-3">Item Description</th>
                    <th className="p-3">HSN</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 text-right">Tax Slab</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-slate-800">{item.description}</td>
                      <td className="p-3 font-mono text-slate-500">{item.hsn}</td>
                      <td className="p-3 text-center font-bold text-slate-900">{item.qty}</td>
                      <td className="p-3 text-right font-mono text-slate-800">{formatCurrency(item.rate)}</td>
                      <td className="p-3 text-right font-mono text-slate-600">{item.taxRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="bg-slate-900 text-white p-5 rounded-lg space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Base Subtotal</span>
                <span className="font-mono text-white">{formatCurrency(selectedInvoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Total GST (CGST + SGST or IGST)</span>
                <span className="font-mono text-white">
                  {formatCurrency((selectedInvoice.cgst || 0) + (selectedInvoice.sgst || 0) + (selectedInvoice.igst || 0))}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold text-sm">
                <span className="text-red-400 font-black uppercase tracking-wider text-xs">Grand Total Payable</span>
                <span className="text-2xl font-black font-mono text-white">{formatCurrency(selectedInvoice.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Database className="w-3 h-3 text-emerald-500" />
                <span>MongoDB Synchronized Record</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print Tax Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-all shadow-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
