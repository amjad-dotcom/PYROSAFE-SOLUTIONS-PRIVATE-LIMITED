import { collection, addDoc, updateDoc, doc, getDocs, query, orderBy, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Invoice } from '../types';
import { authService } from './authService';

const STORAGE_KEY = 'pyrosafe_invoices_v1';

export const INITIAL_INVOICES: Invoice[] = [
  { 
    id: 'inv-doc-1', 
    clientId: '1',
    clientName: 'Acme Solutions', 
    number: 'INV-2024-082', 
    date: '2024-10-20',
    items: [
      { itemId: 'inv-1', sku: 'PYRO-FE-ABC-6KG', description: 'ABC Powder Fire Extinguisher 6kg (IS:15683)', hsn: '8424', qty: 4, rate: 2350, taxRate: 18 },
      { itemId: 'inv-4', sku: 'PYRO-SD-OPT-01', description: 'Addressable Optical Smoke Detector with Standard Base', hsn: '8531', qty: 20, rate: 1450, taxRate: 18 }
    ],
    isProforma: false,
    status: 'Paid',
    subtotal: 38400,
    cgst: 3456,
    sgst: 3456,
    igst: 0,
    total: 45312,
    currency: 'INR',
    deductedFromInventory: true
  },
  { 
    id: 'inv-doc-2', 
    clientId: '2',
    clientName: 'NextWave Creative', 
    number: 'INV-2024-079', 
    date: '2024-10-15',
    items: [
      { itemId: 'inv-6', sku: 'PYRO-FHR-30M', description: 'Hydrant Fire Hose Reel Drum 30m with 19mm Thermoplastic Hose', hsn: '8424', qty: 2, rate: 6800, taxRate: 18 }
    ],
    isProforma: false,
    status: 'Overdue',
    subtotal: 13600,
    cgst: 0,
    sgst: 0,
    igst: 2448,
    total: 16048,
    currency: 'INR',
    deductedFromInventory: true
  },
  { 
    id: 'inv-doc-3', 
    clientId: '3',
    clientName: 'Global Tech Ltd', 
    number: 'INV-2024-081', 
    date: '2024-10-18',
    items: [
      { itemId: 'inv-10', sku: 'PYRO-SRV-REFILL-ABC', description: 'Extinguisher Refilling & Hydrostatic Pressure Testing (ABC 6kg)', hsn: '9987', qty: 15, rate: 750, taxRate: 18 }
    ],
    isProforma: false,
    status: 'Sent',
    subtotal: 11250,
    cgst: 1012.5,
    sgst: 1012.5,
    igst: 0,
    total: 13275,
    currency: 'INR',
    deductedFromInventory: false
  }
];

export interface MongoDbStatus {
  connected: boolean;
  mode: string;
  database: string;
  collection: string;
  recordCount: number;
  activeUri: string;
  error?: string | null;
  authenticatedAccess: boolean;
}

export const invoiceService = {
  getStoredInvoices(): Invoice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INVOICES));
        return INITIAL_INVOICES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_INVOICES;
    }
  },

  async getDbStatus(): Promise<MongoDbStatus> {
    try {
      const headers = authService.getAuthHeader();
      const res = await fetch('/api/db/status', { headers });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Could not query MongoDB status endpoint:', e);
    }

    const localCount = this.getStoredInvoices().length;
    return {
      connected: false,
      mode: 'MongoDB Persistent Store (Local Fallback)',
      database: 'pyrosafe_db',
      collection: 'invoices',
      recordCount: localCount,
      activeUri: 'Local Persistent Buffer',
      authenticatedAccess: true
    };
  },

  async connectCustomMongo(uri: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      };
      const res = await fetch('/api/db/connect', {
        method: 'POST',
        headers,
        body: JSON.stringify({ uri })
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection request failed' };
    }
  },

  async getInvoices(clientId?: string): Promise<Invoice[]> {
    // 1. Attempt authenticated fetch from MongoDB backend
    try {
      const headers = authService.getAuthHeader();
      const url = clientId ? `/api/invoices?clientId=${encodeURIComponent(clientId)}` : '/api/invoices';
      const res = await fetch(url, { headers });

      if (res.ok) {
        const mongoInvoices: Invoice[] = await res.json();
        if (Array.isArray(mongoInvoices) && mongoInvoices.length > 0) {
          // Update local mirror
          if (!clientId) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mongoInvoices));
          }
          return mongoInvoices;
        }
      }
    } catch (err) {
      console.warn('MongoDB endpoint fetch error, falling back to local mirror:', err);
    }

    // 2. Fallback to local stored invoices
    const local = this.getStoredInvoices();
    if (clientId) {
      return local.filter(i => i.clientId === clientId);
    }
    return local;
  },

  async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<string> {
    const newId = `inv-doc-${Date.now()}`;
    const newInvoice: Invoice = {
      ...invoice,
      id: newId
    };

    // 1. Immediately update local storage
    const local = this.getStoredInvoices();
    const updated = [newInvoice, ...local];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 2. Securely persist to MongoDB backend
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      };
      await fetch('/api/invoices', {
        method: 'POST',
        headers,
        body: JSON.stringify(newInvoice)
      });
    } catch (err) {
      console.warn('MongoDB write error (saved in local buffer):', err);
    }

    // 3. Background sync to Firestore as secondary backup
    try {
      addDoc(collection(db, 'invoices'), {
        ...invoice,
        createdAt: serverTimestamp()
      }).catch(() => {});
    } catch {
      // Ignored
    }

    return newId;
  },

  async updateInvoiceStatus(id: string, status: any): Promise<boolean> {
    const local = this.getStoredInvoices();
    const target = local.find(i => i.id === id);
    if (target) {
      target.status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
    }

    // Update in MongoDB via authenticated backend
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      };
      await fetch(`/api/invoices/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.warn('MongoDB status update warning:', err);
    }

    // Update Firestore
    try {
      const docRef = doc(db, 'invoices', id);
      await updateDoc(docRef, { status });
    } catch {
      // Ignored
    }
    return true;
  }
};
