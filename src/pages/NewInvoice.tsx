import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  IndianRupee, 
  Building2, 
  User, 
  Shield, 
  ShieldCheck, 
  ChevronDown,
  Boxes,
  Package,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  Phone,
  MapPin
} from 'lucide-react';
import { cn } from '../lib/utils';
import { calculateTax, formatCurrency, generateInvoiceNumber } from '../lib/crm-utils';
import { PageProps, LineItem, InventoryItem } from '../types';
import { inventoryService } from '../services/inventoryService';
import { invoiceService } from '../services/invoiceService';
import { getCompanyProfile } from '../lib/companyProfile';

export default function NewInvoice({ navigateTo }: PageProps) {
  const companyProfile = getCompanyProfile();
  const [companyState, setCompanyState] = useState(companyProfile.state || 'Chandigarh');
  const [customerState, setCustomerState] = useState('Chandigarh');
  const [customerName, setCustomerName] = useState('Acme Solutions');
  const [customerGstin, setCustomerGstin] = useState('04AABCA1234F1Z5');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2024-085');

  // Inventory Integration
  const [inventoryCatalog, setInventoryCatalog] = useState<InventoryItem[]>([]);
  const [autoDeductStock, setAutoDeductStock] = useState<boolean>(true);
  const [issueSuccessBanner, setIssueSuccessBanner] = useState<{
    show: boolean;
    invNum: string;
    deductions: { name: string; qty: number }[];
  } | null>(null);

  const [items, setItems] = useState<LineItem[]>([
    { 
      itemId: 'inv-1',
      sku: 'PYRO-FE-ABC-6KG',
      description: 'ABC Powder Fire Extinguisher 6kg (IS:15683)', 
      hsn: '8424', 
      qty: 4, 
      rate: 2350, 
      taxRate: 18 
    }
  ]);

  // Load inventory catalog and check for prefill
  useEffect(() => {
    const catalog = inventoryService.getItems();
    setInventoryCatalog(catalog);

    // Generate fresh invoice number
    const storedInvoices = invoiceService.getStoredInvoices();
    if (storedInvoices.length > 0) {
      setInvoiceNumber(generateInvoiceNumber(storedInvoices[0].number));
    }

    // Check if user clicked "Bill" on Inventory page
    const prefillData = sessionStorage.getItem('pyrosafe_prefill_item');
    if (prefillData) {
      try {
        const parsed = JSON.parse(prefillData);
        setItems([{
          itemId: parsed.itemId,
          sku: parsed.sku,
          description: parsed.description,
          hsn: parsed.hsn,
          qty: parsed.qty || 1,
          rate: parsed.rate || 0,
          taxRate: parsed.taxRate || 18
        }]);
        sessionStorage.removeItem('pyrosafe_prefill_item');
      } catch {
        // ignore
      }
    }
  }, []);

  const taxSummary = calculateTax(items, companyState, customerState);

  const addItem = () => {
    setItems([...items, { description: '', hsn: '8424', qty: 1, rate: 0, taxRate: 18 }]);
  };

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const selectInventoryItem = (index: number, itemId: string) => {
    const selected = inventoryCatalog.find(i => i.id === itemId);
    if (!selected) return;

    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      itemId: selected.id,
      sku: selected.sku,
      description: selected.name,
      hsn: selected.hsn,
      rate: selected.sellingRate,
      taxRate: selected.taxRate
    };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const isIntraState = companyState.toLowerCase() === customerState.toLowerCase();

  const handleIssueInvoice = async () => {
    if (!customerName) {
      alert('Please specify a client name.');
      return;
    }

    let deductions: { name: string; qty: number }[] = [];

    // 1. If auto-deduct is enabled, decrement inventory stock
    if (autoDeductStock) {
      const result = inventoryService.deductStockForInvoice(items, invoiceNumber);
      deductions = result.deductions;
    }

    // 2. Save invoice to database / localStorage
    await invoiceService.createInvoice({
      clientId: 'c-' + Date.now(),
      clientName: customerName,
      number: invoiceNumber,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items,
      isProforma: false,
      status: 'Paid',
      subtotal: taxSummary.subtotal,
      cgst: taxSummary.cgst,
      sgst: taxSummary.sgst,
      igst: taxSummary.igst,
      total: taxSummary.total,
      currency: 'INR',
      deductedFromInventory: autoDeductStock
    });

    // 3. Show confirmation banner
    setIssueSuccessBanner({
      show: true,
      invNum: invoiceNumber,
      deductions
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-6 -mx-8 -mt-8 border-b border-slate-200 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('invoices')} className="text-slate-400 hover:bg-slate-50 p-2 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">New Tax Invoice</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Invoice #{invoiceNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigateTo('invoices')}
            className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleIssueInvoice}
            className="px-5 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-red-700 transition-all shadow-sm"
          >
            Issue & Save
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {issueSuccessBanner && (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 text-emerald-800 font-bold text-base">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            Tax Invoice {issueSuccessBanner.invNum} Issued Successfully!
          </div>
          <p className="text-xs text-emerald-700">
            Invoice has been recorded and tax calculations are locked.
          </p>

          {issueSuccessBanner.deductions.length > 0 && (
            <div className="bg-white/80 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <span className="font-bold block text-[11px] uppercase tracking-wider text-emerald-800">
                📦 Inventory Automatically Deducted:
              </span>
              {issueSuccessBanner.deductions.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span>{d.name}</span>
                  <span className="font-mono font-bold text-rose-600">-{d.qty} units</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => navigateTo('invoices')}
              className="px-4 py-2 bg-emerald-700 text-white rounded text-xs font-bold hover:bg-emerald-800 transition-all"
            >
              View Invoices List
            </button>
            <button
              onClick={() => navigateTo('inventory')}
              className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 rounded text-xs font-bold hover:bg-emerald-50 transition-all"
            >
              Check Updated Inventory Stock
            </button>
          </div>
        </div>
      )}

      <div className="space-y-10">
        {/* Billing Details */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Billing Details & Legal Entity</h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Seller GSTIN: {companyProfile.gstin} (State 04)
            </span>
          </div>
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            {/* Seller Company Badge */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-tight text-slate-900">{companyProfile.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-100 text-red-800 rounded">Tax Deductor</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  <span className="font-semibold">{companyProfile.buildingNo}, {companyProfile.premisesName}, {companyProfile.locality}, {companyProfile.state} - {companyProfile.pinCode}</span>
                </p>
              </div>
              <div className="flex sm:flex-col items-start sm:items-end gap-1 text-[11px] font-mono shrink-0">
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  <Phone className="w-3 h-3 text-red-600" />
                  +91 {companyProfile.contactNo}
                </span>
                <span className="text-[10px] text-slate-500 font-bold">GST: {companyProfile.gstin}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company GSTIN</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={`${companyProfile.gstin} (${companyProfile.name})`}
                    readOnly
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-mono rounded-md text-xs font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customer / Company Name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer or corporate client name"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customer GSTIN</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500">
                    <Shield className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={customerGstin}
                    onChange={(e) => setCustomerGstin(e.target.value)}
                    placeholder="04AABCA1234F1Z5"
                    className="w-full pl-11 pr-4 py-3 font-mono bg-white border border-slate-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Place of Supply</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <select 
                      value={customerState}
                      onChange={(e) => setCustomerState(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm font-medium appearance-none"
                    >
                      <option>Chandigarh</option>
                      <option>Punjab</option>
                      <option>Haryana</option>
                      <option>Delhi</option>
                      <option>Himachal Pradesh</option>
                      <option>Maharashtra</option>
                      <option>Gujarat</option>
                      <option>Karnataka</option>
                      <option>Tamil Nadu</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className={cn(
                    "px-4 py-3 rounded-md flex items-center justify-center text-[10px] font-bold uppercase tracking-widest border",
                    isIntraState ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                  )}>
                    {isIntraState ? 'Intra-state (CGST+SGST)' : 'Inter-state (IGST)'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INVENTORY INTEGRATION TOGGLE CARD */}
        <section>
          <div className="bg-gradient-to-r from-red-50/70 to-orange-50/70 border border-red-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-red-600 text-white rounded-lg shadow-sm shrink-0">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDeductStock}
                    onChange={(e) => setAutoDeductStock(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer accent-red-600"
                  />
                  Auto-deduct billed quantities from Pyrosafe Inventory
                </label>
                <p className="text-xs text-slate-600 mt-0.5">
                  When enabled, stock levels for extinguishers, smoke detectors, and valves are automatically decreased and logged with audit reference #{invoiceNumber}.
                </p>
              </div>
            </div>

            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0",
              autoDeductStock ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
            )}>
              {autoDeductStock ? 'Inventory Sync Active' : 'Sync Disabled'}
            </span>
          </div>
        </section>

        {/* Line Items */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Safety Line Items & Billable Goods</h3>
            <button 
              onClick={addItem} 
              className="flex items-center text-[10px] font-black text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors uppercase tracking-widest border border-red-100"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Custom Row
            </button>
          </div>
          
          <div className="space-y-6">
            {items.map((item, index) => {
              // Match with inventory item if available
              const matchedInventory = inventoryCatalog.find(
                i => (item.itemId && i.id === item.itemId) || 
                     (item.sku && i.sku === item.sku) ||
                     i.name === item.description
              );
              const availableStock = matchedInventory ? matchedInventory.currentStock : null;
              const isStockShortage = availableStock !== null && item.qty > availableStock && matchedInventory?.category !== 'Services & Refilling';

              return (
                <div key={index} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 relative group animate-in slide-in-from-top-2 duration-300">
                  <button 
                    onClick={() => removeItem(index)}
                    className="absolute -right-3 -top-3 w-8 h-8 bg-white text-rose-500 border border-slate-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:border-rose-100 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  {/* Select from Inventory Catalog Bar */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Package className="w-4 h-4 text-red-600" />
                      <span>Pick from Safety Inventory:</span>
                    </div>

                    <select
                      value={item.itemId || ''}
                      onChange={(e) => selectInventoryItem(index, e.target.value)}
                      className="w-full sm:w-auto px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-red-500 outline-none"
                    >
                      <option value="">-- Choose Equipment Catalog Item --</option>
                      {inventoryCatalog.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} (Stock: {inv.currentStock} {inv.unit} | ₹{inv.sellingRate})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item Description</label>
                        {availableStock !== null && (
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                            isStockShortage ? "bg-rose-100 text-rose-700" :
                            availableStock <= (matchedInventory?.minStock || 5) ? "bg-amber-100 text-amber-800" :
                            "bg-emerald-100 text-emerald-800"
                          )}>
                            Stock: {availableStock} {matchedInventory?.unit} available
                          </span>
                        )}
                      </div>
                      <input 
                        type="text" 
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-slate-300"
                        placeholder="Service or product description"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HSN / SAC</label>
                      <input 
                        type="text" 
                        value={item.hsn}
                        onChange={(e) => updateItem(index, 'hsn', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-red-500 text-center font-mono"
                        placeholder="8424"
                      />
                    </div>
                  </div>

                  {/* Stock Shortage Warning Notice */}
                  {isStockShortage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>
                        <strong>Stock Warning:</strong> You are invoicing <strong>{item.qty} units</strong>, but warehouse only has <strong>{availableStock} units</strong>. Available stock will reach 0.
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quantity</label>
                      <input 
                        type="number" 
                        min={1}
                        value={item.qty}
                        onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium text-center focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit Rate (INR)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                        <input 
                          type="number" 
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">GST Slab</label>
                      <select 
                        value={item.taxRate}
                        onChange={(e) => updateItem(index, 'taxRate', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium appearance-none text-center focus:ring-1 focus:ring-red-500"
                      >
                        {[0, 5, 12, 18, 28].map(v => <option key={v} value={v}>{v}% GST</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tax Summary */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Financial Breakdown</h3>
          <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 space-y-4 text-white shadow-xl shadow-slate-200">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Subtotal Base Value</span>
              <span className="text-white font-mono">{formatCurrency(taxSummary.subtotal)}</span>
            </div>
            
            <div className="space-y-2 pt-2 border-t border-slate-800">
              {isIntraState ? (
                <>
                  <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                    <span>Central GST (CGST 9%)</span>
                    <span className="text-white font-mono">{formatCurrency(taxSummary.cgst)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                    <span>State GST (SGST 9%)</span>
                    <span className="text-white font-mono">{formatCurrency(taxSummary.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                  <span>Integrated GST (IGST 18%)</span>
                  <span className="text-white font-mono">{formatCurrency(taxSummary.igst)}</span>
                </div>
              )}
            </div>

            <div className="h-px bg-slate-800 my-4" />
            
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Payable Amount</span>
                <span className="text-3xl font-black tracking-tight text-white font-mono">{formatCurrency(taxSummary.total)}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase text-right leading-tight mb-1">
                Auto-calculated with GST Compliance<br/>
                <span className="text-slate-400">{autoDeductStock ? '• Stock will be deducted on issue' : '• Stock will not be modified'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bank & Footer Actions */}
        <div className="space-y-8">
          <div className="p-6 bg-red-50 border border-red-100 rounded-xl flex gap-5 items-start">
            <div className="bg-red-600 p-2 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-1">Compliance & Bank Instructions</p>
              <p className="text-sm font-bold text-red-900 tracking-tight">HDFC Bank • AC: 50200099887766 • IFSC: HDFC0000123</p>
              <p className="text-[11px] text-red-600 font-medium mt-1">Please quote Invoice #{invoiceNumber} during RTGS/NEFT transaction settlement.</p>
            </div>
          </div>

          <button 
            onClick={handleIssueInvoice}
            className="w-full group flex items-center justify-center gap-4 p-5 bg-red-600 text-white rounded-md text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-red-100 hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Validate & Issue Safety Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
