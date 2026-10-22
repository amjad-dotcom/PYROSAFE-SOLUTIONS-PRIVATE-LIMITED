import { InventoryItem, StockMovement, LineItem, MovementType } from '../types';

const INVENTORY_STORAGE_KEY = 'pyrosafe_inventory_items_v1';
const MOVEMENTS_STORAGE_KEY = 'pyrosafe_inventory_movements_v1';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'PYRO-FE-ABC-6KG',
    name: 'ABC Powder Fire Extinguisher 6kg (IS:15683)',
    category: 'Extinguishers',
    hsn: '8424',
    unit: 'Nos',
    currentStock: 48,
    minStock: 15,
    costPrice: 1450,
    sellingRate: 2350,
    taxRate: 18,
    warehouse: 'Main Warehouse - Chandigarh (Industrial Area Phase 1)',
    lastUpdated: '2024-10-18'
  },
  {
    id: 'inv-2',
    sku: 'PYRO-FE-CO2-4.5KG',
    name: 'CO2 Fire Extinguisher 4.5kg with Horn (IS:15683)',
    category: 'Extinguishers',
    hsn: '8424',
    unit: 'Nos',
    currentStock: 18,
    minStock: 10,
    costPrice: 3200,
    sellingRate: 4800,
    taxRate: 18,
    warehouse: 'Main Warehouse - Chandigarh (Industrial Area Phase 1)',
    lastUpdated: '2024-10-19'
  },
  {
    id: 'inv-3',
    sku: 'PYRO-FE-FOAM-9L',
    name: 'AFFF Mechanical Foam Extinguisher 9 Litres',
    category: 'Extinguishers',
    hsn: '8424',
    unit: 'Nos',
    currentStock: 6,
    minStock: 8,
    costPrice: 2100,
    sellingRate: 3450,
    taxRate: 18,
    warehouse: 'Main Warehouse - Chandigarh (Industrial Area Phase 1)',
    lastUpdated: '2024-10-14'
  },
  {
    id: 'inv-4',
    sku: 'PYRO-SD-OPT-01',
    name: 'Addressable Optical Smoke Detector with Standard Base',
    category: 'Alarms & Detectors',
    hsn: '8531',
    unit: 'Nos',
    currentStock: 120,
    minStock: 25,
    costPrice: 850,
    sellingRate: 1450,
    taxRate: 18,
    warehouse: 'Electronic Hub - Thane',
    lastUpdated: '2024-10-20'
  },
  {
    id: 'inv-5',
    sku: 'PYRO-FCP-4Z',
    name: '4-Zone Microprocessor Fire Alarm Control Panel',
    category: 'Alarms & Detectors',
    hsn: '8531',
    unit: 'Sets',
    currentStock: 4,
    minStock: 5,
    costPrice: 8900,
    sellingRate: 13800,
    taxRate: 18,
    warehouse: 'Electronic Hub - Thane',
    lastUpdated: '2024-10-12'
  },
  {
    id: 'inv-6',
    sku: 'PYRO-FHR-30M',
    name: 'Hydrant Fire Hose Reel Drum 30m with 19mm Thermoplastic Hose',
    category: 'Hydrants & Sprinklers',
    hsn: '8424',
    unit: 'Sets',
    currentStock: 14,
    minStock: 6,
    costPrice: 4200,
    sellingRate: 6800,
    taxRate: 18,
    warehouse: 'Main Warehouse - Chandigarh (Industrial Area Phase 1)',
    lastUpdated: '2024-10-17'
  },
  {
    id: 'inv-7',
    sku: 'PYRO-HV-63MM',
    name: 'Gunmetal Oblique Landing Valve 63mm (IS:5290 Type-A)',
    category: 'Hydrants & Sprinklers',
    hsn: '8481',
    unit: 'Nos',
    currentStock: 22,
    minStock: 8,
    costPrice: 2800,
    sellingRate: 4600,
    taxRate: 18,
    warehouse: 'Main Warehouse - Chandigarh (Industrial Area Phase 1)',
    lastUpdated: '2024-10-15'
  },
  {
    id: 'inv-8',
    sku: 'PYRO-SPR-PEND-68',
    name: 'Pendent Fire Sprinkler Head 68°C Brass (UL/FM)',
    category: 'Hydrants & Sprinklers',
    hsn: '8424',
    unit: 'Nos',
    currentStock: 350,
    minStock: 100,
    costPrice: 220,
    sellingRate: 420,
    taxRate: 18,
    warehouse: 'Main Warehouse - Chandigarh (Industrial Area Phase 1)',
    lastUpdated: '2024-10-18'
  },
  {
    id: 'inv-9',
    sku: 'PYRO-FB-180',
    name: 'Heavy Duty Fibreglass Fire Blanket (1.8m x 1.8m)',
    category: 'Safety & PPE',
    hsn: '7019',
    unit: 'Nos',
    currentStock: 32,
    minStock: 12,
    costPrice: 650,
    sellingRate: 1250,
    taxRate: 12,
    warehouse: 'Service Depot - Pune',
    lastUpdated: '2024-10-16'
  },
  {
    id: 'inv-10',
    sku: 'PYRO-SRV-REFILL-ABC',
    name: 'Extinguisher Refilling & Hydrostatic Pressure Testing (ABC 6kg)',
    category: 'Services & Refilling',
    hsn: '9987',
    unit: 'Services',
    currentStock: 999,
    minStock: 10,
    costPrice: 350,
    sellingRate: 750,
    taxRate: 18,
    warehouse: 'On-site / Service Workshop',
    lastUpdated: '2024-10-21'
  }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    itemId: 'inv-1',
    itemName: 'ABC Powder Fire Extinguisher 6kg (IS:15683)',
    sku: 'PYRO-FE-ABC-6KG',
    type: 'Inward',
    quantity: 25,
    prevStock: 27,
    newStock: 52,
    reference: 'PO-2024-034',
    date: '2024-10-18',
    notes: 'Bulk stock arrival from manufacturer'
  },
  {
    id: 'mov-2',
    itemId: 'inv-1',
    itemName: 'ABC Powder Fire Extinguisher 6kg (IS:15683)',
    sku: 'PYRO-FE-ABC-6KG',
    type: 'Invoiced',
    quantity: -4,
    prevStock: 52,
    newStock: 48,
    reference: 'INV-2024-082',
    date: '2024-10-20',
    notes: 'Deducted on client invoice to Acme Solutions'
  },
  {
    id: 'mov-3',
    itemId: 'inv-3',
    itemName: 'AFFF Mechanical Foam Extinguisher 9 Litres',
    sku: 'PYRO-FE-FOAM-9L',
    type: 'Adjustment',
    quantity: -2,
    prevStock: 8,
    newStock: 6,
    reference: 'ADJ-OCT-09',
    date: '2024-10-14',
    notes: 'Demonstration and internal safety mock drill unit usage'
  }
];

export const inventoryService = {
  getItems(): InventoryItem[] {
    try {
      const data = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
        return INITIAL_INVENTORY;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_INVENTORY;
    }
  },

  getItem(id: string): InventoryItem | undefined {
    return this.getItems().find(item => item.id === id);
  },

  addItem(item: Omit<InventoryItem, 'id' | 'lastUpdated'>): InventoryItem {
    const items = this.getItems();
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    const updated = [newItem, ...items];
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updated));

    // Log inward movement
    this.addMovement({
      itemId: newItem.id,
      itemName: newItem.name,
      sku: newItem.sku,
      type: 'Inward',
      quantity: newItem.currentStock,
      prevStock: 0,
      newStock: newItem.currentStock,
      reference: 'INIT-STOCK',
      notes: 'Initial inventory entry creation'
    });

    return newItem;
  },

  updateItem(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const items = this.getItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;

    const oldItem = items[idx];
    const updatedItem = {
      ...oldItem,
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    items[idx] = updatedItem;
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
    return updatedItem;
  },

  deleteItem(id: string): boolean {
    const items = this.getItems();
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length === items.length) return false;
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  adjustStock(
    id: string, 
    newStock: number, 
    reason: string, 
    type: MovementType = 'Adjustment', 
    refNumber?: string
  ): boolean {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (!item) return false;

    const prevStock = item.currentStock;
    const diff = newStock - prevStock;
    if (diff === 0) return true;

    item.currentStock = Math.max(0, newStock);
    item.lastUpdated = new Date().toISOString().split('T')[0];
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));

    this.addMovement({
      itemId: item.id,
      itemName: item.name,
      sku: item.sku,
      type,
      quantity: diff,
      prevStock,
      newStock: item.currentStock,
      reference: refNumber || `ADJ-${new Date().getMonth() + 1}`,
      notes: reason
    });

    return true;
  },

  /**
   * Deducts items from inventory when an invoice is issued
   */
  deductStockForInvoice(
    lineItems: LineItem[], 
    invoiceNumber: string
  ): { success: boolean; warnings: string[]; deductions: { name: string; qty: number }[] } {
    const items = this.getItems();
    const warnings: string[] = [];
    const deductions: { name: string; qty: number }[] = [];

    lineItems.forEach(lineItem => {
      // Find matching item by itemId or by exact SKU or matching description
      const matched = items.find(
        i => (lineItem.itemId && i.id === lineItem.itemId) || 
             (lineItem.sku && i.sku === lineItem.sku) ||
             i.name.toLowerCase() === lineItem.description.toLowerCase() ||
             lineItem.description.toLowerCase().includes(i.name.toLowerCase())
      );

      // Do not deduct infinite services
      if (matched && matched.category !== 'Services & Refilling') {
        const qtyToDeduct = lineItem.qty;
        const prevStock = matched.currentStock;
        const newStock = Math.max(0, prevStock - qtyToDeduct);

        if (prevStock < qtyToDeduct) {
          warnings.push(`Stock for "${matched.name}" was ${prevStock}, but invoice required ${qtyToDeduct}. Available stock reduced to 0.`);
        }

        matched.currentStock = newStock;
        matched.lastUpdated = new Date().toISOString().split('T')[0];
        deductions.push({ name: matched.name, qty: qtyToDeduct });

        this.addMovement({
          itemId: matched.id,
          itemName: matched.name,
          sku: matched.sku,
          type: 'Invoiced',
          quantity: -qtyToDeduct,
          prevStock,
          newStock,
          reference: invoiceNumber,
          notes: `Billed and deducted on Invoice ${invoiceNumber}`
        });
      }
    });

    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
    return { success: true, warnings, deductions };
  },

  getMovements(): StockMovement[] {
    try {
      const data = localStorage.getItem(MOVEMENTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(INITIAL_MOVEMENTS));
        return INITIAL_MOVEMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOVEMENTS;
    }
  },

  addMovement(movement: Omit<StockMovement, 'id' | 'date'> & { date?: string }): StockMovement {
    const movements = this.getMovements();
    const newMovement: StockMovement = {
      ...movement,
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: movement.date || new Date().toISOString().split('T')[0]
    };
    const updated = [newMovement, ...movements];
    localStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(updated));
    return newMovement;
  }
};
