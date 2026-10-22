import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpDown, 
  History, 
  SlidersHorizontal, 
  TrendingDown, 
  TrendingUp, 
  Warehouse, 
  Edit3, 
  Trash2, 
  Receipt, 
  X, 
  Check, 
  Boxes,
  FileSpreadsheet,
  ArrowRight,
  Flame
} from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/crm-utils';
import { PageProps, InventoryItem, StockMovement, InventoryCategory, MovementType } from '../types';
import { inventoryService } from '../services/inventoryService';

export default function Inventory({ navigateTo }: PageProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'catalog' | 'movements'>('catalog');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItemForAdjust, setSelectedItemForAdjust] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Extinguishers' as InventoryCategory,
    hsn: '8424',
    unit: 'Nos' as InventoryItem['unit'],
    currentStock: 10,
    minStock: 5,
    costPrice: 1000,
    sellingRate: 1800,
    taxRate: 18,
    warehouse: 'Main Warehouse - Chandigarh (Industrial Area Phase 1)'
  });

  // Form state for stock adjustment
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustAction, setAdjustAction] = useState<'add' | 'remove' | 'set'>('add');
  const [adjustReason, setAdjustReason] = useState('Stock Refill / Inward shipment');
  const [adjustRef, setAdjustRef] = useState('');

  const refreshData = () => {
    setItems(inventoryService.getItems());
    setMovements(inventoryService.getMovements());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const categories: string[] = [
    'All',
    'Extinguishers',
    'Alarms & Detectors',
    'Hydrants & Sprinklers',
    'Safety & PPE',
    'Services & Refilling'
  ];

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hsn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouse.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    let matchesStatus = true;
    if (selectedStatus === 'low') {
      matchesStatus = item.currentStock > 0 && item.currentStock <= item.minStock;
    } else if (selectedStatus === 'out') {
      matchesStatus = item.currentStock === 0;
    } else if (selectedStatus === 'healthy') {
      matchesStatus = item.currentStock > item.minStock;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Key stats calculations
  const totalValuation = items.reduce((acc, i) => acc + (i.currentStock * i.sellingRate), 0);
  const lowStockCount = items.filter(i => i.currentStock > 0 && i.currentStock <= i.minStock).length;
  const outOfStockCount = items.filter(i => i.currentStock === 0).length;
  const totalSkus = items.length;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      sku: `PYRO-SAFE-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      category: 'Extinguishers',
      hsn: '8424',
      unit: 'Nos',
      currentStock: 20,
      minStock: 5,
      costPrice: 1200,
      sellingRate: 2100,
      taxRate: 18,
      warehouse: 'Main Warehouse - Navi Mumbai'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      sku: item.sku,
      name: item.name,
      category: item.category,
      hsn: item.hsn,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      costPrice: item.costPrice,
      sellingRate: item.sellingRate,
      taxRate: item.taxRate,
      warehouse: item.warehouse
    });
    setIsAddModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    if (editingItem) {
      inventoryService.updateItem(editingItem.id, formData);
    } else {
      inventoryService.addItem(formData);
    }
    refreshData();
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to remove this item from the inventory catalog?')) {
      inventoryService.deleteItem(id);
      refreshData();
    }
  };

  const handleOpenAdjust = (item: InventoryItem) => {
    setSelectedItemForAdjust(item);
    setAdjustQty(5);
    setAdjustAction('add');
    setAdjustReason('Stock Inward / Restock');
    setAdjustRef(`PO-2024-${Math.floor(10 + Math.random() * 90)}`);
    setIsAdjustModalOpen(true);
  };

  const handleConfirmAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForAdjust) return;

    let targetStock = selectedItemForAdjust.currentStock;
    let movType: MovementType = 'Adjustment';

    if (adjustAction === 'add') {
      targetStock = selectedItemForAdjust.currentStock + adjustQty;
      movType = 'Inward';
    } else if (adjustAction === 'remove') {
      targetStock = Math.max(0, selectedItemForAdjust.currentStock - adjustQty);
      movType = 'Damage';
    } else {
      targetStock = Math.max(0, adjustQty);
      movType = 'Adjustment';
    }

    inventoryService.adjustStock(
      selectedItemForAdjust.id,
      targetStock,
      adjustReason,
      movType,
      adjustRef || undefined
    );

    refreshData();
    setIsAdjustModalOpen(false);
  };

  const handleCreateInvoiceWithItem = (item: InventoryItem) => {
    // Store selected item to prefill in new-invoice session
    sessionStorage.setItem('pyrosafe_prefill_item', JSON.stringify({
      itemId: item.id,
      sku: item.sku,
      description: item.name,
      hsn: item.hsn,
      qty: 1,
      rate: item.sellingRate,
      taxRate: item.taxRate
    }));
    navigateTo('new-invoice');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden gap-4">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Safety Inventory & Stock Hub</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 uppercase tracking-wider">
              Real-time Invoicing Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage fire safety equipment, detection hardware, testing valves, and auto-sync stock with GST billing invoices
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigateTo('new-invoice')}
            className="flex items-center px-4 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-md hover:bg-slate-200 transition-all border border-slate-300 shadow-sm active:scale-95"
          >
            <Receipt className="w-4 h-4 mr-2 text-slate-600" />
            New Tax Invoice
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center px-5 py-2.5 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-md hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Analytics / Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-red-200 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Valuation</span>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(totalValuation)}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Estimated sales realization</p>
        </div>

        <div 
          onClick={() => setSelectedStatus(selectedStatus === 'low' ? 'All' : 'low')}
          className={cn(
            "p-6 bg-white border rounded-xl shadow-sm cursor-pointer transition-all",
            selectedStatus === 'low' ? "border-amber-500 ring-2 ring-amber-100 bg-amber-50/20" : "border-slate-200 hover:border-amber-300"
          )}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Low Stock Warnings</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 tracking-tight">{lowStockCount} items</div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Click to filter reorder items</p>
        </div>

        <div 
          onClick={() => setSelectedStatus(selectedStatus === 'out' ? 'All' : 'out')}
          className={cn(
            "p-6 bg-white border rounded-xl shadow-sm cursor-pointer transition-all",
            selectedStatus === 'out' ? "border-rose-500 ring-2 ring-rose-100 bg-rose-50/20" : "border-slate-200 hover:border-rose-300"
          )}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Out of Stock</span>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 tracking-tight">{outOfStockCount} items</div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Critical replenishment needed</p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-red-200 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active SKUs</span>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{totalSkus} Products</div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Across 3 Pyrosafe warehouses</p>
        </div>
      </div>

      {/* Tabs Switcher: Products vs Movement History */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('catalog')}
          className={cn(
            "flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
            activeTab === 'catalog' 
              ? "bg-slate-900 text-white shadow-sm" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          )}
        >
          <Package className="w-4 h-4 mr-2" />
          Stock Catalog ({filteredItems.length})
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={cn(
            "flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
            activeTab === 'movements' 
              ? "bg-slate-900 text-white shadow-sm" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          )}
        >
          <History className="w-4 h-4 mr-2" />
          Audit & Movement Logs ({movements.length})
        </button>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Filters & Search Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="w-full md:w-96 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by SKU, product name, HSN code, or warehouse..." 
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all" 
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 text-[11px] font-bold rounded-md whitespace-nowrap transition-all",
                    selectedCategory === cat 
                      ? "bg-red-600 text-white shadow-sm" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-black bg-slate-50/80">
                    <th className="px-6 py-4">Product & SKU</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">HSN / SAC</th>
                    <th className="px-6 py-4 text-center">Available Stock</th>
                    <th className="px-6 py-4 text-right">Selling Rate</th>
                    <th className="px-6 py-4">Warehouse</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-slate-600">No inventory products found</p>
                        <p className="text-xs text-slate-400 mt-1">Try clearing your search filters or click "Add New Item"</p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const isLow = item.currentStock > 0 && item.currentStock <= item.minStock;
                      const isOut = item.currentStock === 0;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                          {/* Item Info */}
                          <td className="px-6 py-4 max-w-xs">
                            <div className="font-bold text-slate-900 tracking-tight leading-snug group-hover:text-red-600 transition-colors">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 font-bold">
                                {item.sku}
                              </span>
                              <span className="text-[10px] text-slate-400">GST: {item.taxRate}%</span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">
                            <span className="inline-block px-2.5 py-1 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700">
                              {item.category}
                            </span>
                          </td>

                          {/* HSN */}
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs font-semibold text-slate-700">{item.hsn}</span>
                          </td>

                          {/* Stock Level with Badge */}
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <div className={cn(
                                "px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5",
                                isOut ? "bg-rose-100 text-rose-700" :
                                isLow ? "bg-amber-100 text-amber-800" :
                                "bg-emerald-100 text-emerald-800"
                              )}>
                                {isOut ? <AlertTriangle className="w-3.5 h-3.5" /> : null}
                                {item.currentStock} {item.unit}
                              </div>
                              <span className="text-[10px] text-slate-400 mt-1">
                                {isOut ? 'Out of Stock' : isLow ? `Low (Min: ${item.minStock})` : `Threshold: ${item.minStock}`}
                              </span>
                            </div>
                          </td>

                          {/* Rate */}
                          <td className="px-6 py-4 text-right">
                            <div className="font-black text-slate-900 text-sm">
                              {formatCurrency(item.sellingRate)}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Cost: {formatCurrency(item.costPrice)}
                            </div>
                          </td>

                          {/* Warehouse */}
                          <td className="px-6 py-4">
                            <div className="flex items-center text-xs text-slate-600 font-medium">
                              <Warehouse className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                              <span className="truncate max-w-[150px]">{item.warehouse}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {/* Direct Bill on Invoice Button */}
                              <button
                                onClick={() => handleCreateInvoiceWithItem(item)}
                                title="Add directly to a new Tax Invoice"
                                className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded text-xs font-bold transition-all flex items-center shadow-xs"
                              >
                                <Receipt className="w-3.5 h-3.5 mr-1" />
                                Bill
                              </button>

                              {/* Adjust Stock */}
                              <button
                                onClick={() => handleOpenAdjust(item)}
                                title="Adjust or Restock Quantity"
                                className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs font-bold transition-all flex items-center"
                              >
                                <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-slate-500" />
                                Stock
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
              <span>Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> equipment items</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Adequate Stock
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Under Minimum Level
                </span>
                <span className="flex items-center gap-1.5 text-rose-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Out of Stock
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movement & Audit Logs Tab */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Real-time Stock Ledger & Audit Log</h3>
              <p className="text-xs text-slate-500">Every invoice issuance, PO inward, and stock count adjustment is recorded here</p>
            </div>
            <span className="text-xs font-mono bg-white px-3 py-1 rounded border border-slate-200 text-slate-600">
              {movements.length} logged events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-black bg-slate-50/80">
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Product / SKU</th>
                  <th className="px-6 py-4 text-center">Movement Qty</th>
                  <th className="px-6 py-4 text-center">Stock Change</th>
                  <th className="px-6 py-4">Reference & Notes</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                      No stock movements recorded yet.
                    </td>
                  </tr>
                ) : (
                  movements.map((mov) => {
                    const isInward = mov.type === 'Inward';
                    const isInvoiced = mov.type === 'Invoiced';

                    return (
                      <tr key={mov.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-600 font-medium">
                          {mov.date}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                            isInward ? "bg-emerald-100 text-emerald-800" :
                            isInvoiced ? "bg-red-100 text-red-800" :
                            "bg-amber-100 text-amber-800"
                          )}>
                            {mov.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 text-xs">{mov.itemName}</div>
                          <div className="font-mono text-[10px] text-slate-400">{mov.sku}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "font-black text-sm font-mono",
                            mov.quantity > 0 ? "text-emerald-600" : "text-rose-600"
                          )}>
                            {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-xs text-slate-500">
                          {mov.prevStock} <ArrowRight className="w-3 h-3 inline text-slate-400 mx-1" /> <strong className="text-slate-800">{mov.newStock}</strong>
                        </td>
                        <td className="px-6 py-4">
                          {mov.reference && (
                            <span className="inline-block font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mr-2">
                              {mov.reference}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">{mov.notes || '--'}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {editingItem ? 'Edit Safety Inventory Item' : 'Add New Equipment to Catalog'}
                </h3>
                <p className="text-xs text-slate-500">Enter product specifications, tax slab, and initial stock</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Product Name / Model</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. ABC Dry Powder Fire Extinguisher 9kg (IS:15683)"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Product SKU / Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as InventoryCategory })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                  >
                    <option value="Extinguishers">Extinguishers</option>
                    <option value="Alarms & Detectors">Alarms & Detectors</option>
                    <option value="Hydrants & Sprinklers">Hydrants & Sprinklers</option>
                    <option value="Safety & PPE">Safety & PPE</option>
                    <option value="Services & Refilling">Services & Refilling</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">HSN / SAC Code</label>
                  <input
                    type="text"
                    required
                    value={formData.hsn}
                    onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                    placeholder="8424 / 8531 / 9987"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Unit of Measurement</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                  >
                    <option value="Nos">Nos (Pieces)</option>
                    <option value="Sets">Sets</option>
                    <option value="Mtrs">Mtrs (Meters)</option>
                    <option value="Kgs">Kgs</option>
                    <option value="Services">Services (Jobs)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Current Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Min Reorder Threshold</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Cost Purchase Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Standard Selling Rate (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.sellingRate}
                    onChange={(e) => setFormData({ ...formData, sellingRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">GST Slab (%)</label>
                  <select
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseInt(e.target.value) || 18 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                  >
                    <option value={0}>0% (Exempt)</option>
                    <option value={5}>5% GST</option>
                    <option value={12}>12% GST</option>
                    <option value={18}>18% GST (Standard)</option>
                    <option value={28}>28% GST</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Storage Warehouse</label>
                  <select
                    value={formData.warehouse}
                    onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                  >
                    <option>Main Warehouse - Chandigarh (Industrial Area Phase 1)</option>
                    <option>Panchkula / Mohali Regional Hub</option>
                    <option>North India Service Depot</option>
                    <option>On-site / Service Workshop</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK ADJUSTMENT */}
      {isAdjustModalOpen && selectedItemForAdjust && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Adjust Inventory Quantity</h3>
                <p className="text-xs text-slate-500">{selectedItemForAdjust.name}</p>
              </div>
              <button onClick={() => setIsAdjustModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Stock</span>
                <p className="text-xl font-black text-slate-900 font-mono">
                  {selectedItemForAdjust.currentStock} {selectedItemForAdjust.unit}
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                {selectedItemForAdjust.sku}
              </span>
            </div>

            <form onSubmit={handleConfirmAdjust} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Operation Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustAction('add')}
                    className={cn(
                      "py-2 text-xs font-bold rounded-md border text-center transition-all",
                      adjustAction === 'add' 
                        ? "bg-emerald-600 text-white border-emerald-600" 
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    + Restock (Add)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustAction('remove')}
                    className={cn(
                      "py-2 text-xs font-bold rounded-md border text-center transition-all",
                      adjustAction === 'remove' 
                        ? "bg-rose-600 text-white border-rose-600" 
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    - Deduct (Damage)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustAction('set')}
                    className={cn(
                      "py-2 text-xs font-bold rounded-md border text-center transition-all",
                      adjustAction === 'set' 
                        ? "bg-slate-800 text-white border-slate-800" 
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    = Set Exact
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {adjustAction === 'set' ? 'New Target Stock' : 'Quantity to Apply'}
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-center"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Reason / Description</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. PO Receipt, Physical Stock Audit Count"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">PO / Reference Voucher (Optional)</label>
                <input
                  type="text"
                  value={adjustRef}
                  onChange={(e) => setAdjustRef(e.target.value)}
                  placeholder="e.g. PO-2024-039 or AUDIT-OCT"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
