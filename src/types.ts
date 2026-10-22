export type View = 
  | 'dashboard' 
  | 'clients' 
  | 'pipeline' 
  | 'tasks' 
  | 'invoices' 
  | 'quotes' 
  | 'po' 
  | 'inventory' 
  | 'hr' 
  | 'settings' 
  | 'record-payment' 
  | 'new-client' 
  | 'client-detail' 
  | 'new-invoice';

export interface PageProps {
  navigateTo: (view: View, id?: string) => void;
}

export interface ClientDetailProps extends PageProps {
  clientId: string;
}

export type Status = 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
export type POStatus = 'Draft' | 'Sent' | 'Partially Received' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'Completed';

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  gstin?: string;
  state: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gstin?: string;
  state: string;
  address?: string;
}

export interface LineItem {
  itemId?: string;
  sku?: string;
  description: string;
  hsn: string;
  qty: number;
  rate: number;
  taxRate: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName?: string;
  number: string;
  date: string;
  items: LineItem[];
  isProforma: boolean;
  status: InvoiceStatus;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  currency: string;
  deductedFromInventory?: boolean;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName?: string;
  number: string;
  date: string;
  items: LineItem[];
  status: POStatus;
  total: number;
}

export interface Lead {
  id: string;
  clientId: string;
  status: Status;
  value: number;
  source: string;
  ownerId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  clientId?: string;
  ownerId: string;
}

// ---------------------------------------------------------------------------
// INVENTORY TYPES
// ---------------------------------------------------------------------------

export type InventoryCategory = 
  | 'Extinguishers' 
  | 'Alarms & Detectors' 
  | 'Hydrants & Sprinklers' 
  | 'Safety & PPE' 
  | 'Services & Refilling';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  hsn: string;
  unit: 'Nos' | 'Sets' | 'Mtrs' | 'Services' | 'Kgs';
  currentStock: number;
  minStock: number;
  costPrice: number;
  sellingRate: number;
  taxRate: number;
  warehouse: string;
  lastUpdated?: string;
}

export type MovementType = 'Inward' | 'Invoiced' | 'Adjustment' | 'Damage';

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  sku: string;
  type: MovementType;
  quantity: number;
  prevStock: number;
  newStock: number;
  reference?: string;
  date: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// HR TYPES
// ---------------------------------------------------------------------------

export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Inactive';
export type Department = 
  | 'Engineering & Ops' 
  | 'Field Safety & Audits' 
  | 'Sales & Estimation' 
  | 'Finance & Accounts' 
  | 'Admin & HR';

export type AttendanceStatus = 'Present' | 'On-Duty' | 'Late' | 'Half Day' | 'Absent';
export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Paid Leave' | 'Emergency Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  designation: string;
  department: Department;
  email: string;
  phone: string;
  joiningDate: string;
  status: EmployeeStatus;
  basicSalary: number;
  allowances: number;
  grossSalary: number;
  pan?: string;
  bankAccount?: string;
  ifsc?: string;
  emergencyContact?: string;
}

export interface AttendanceRecord {
  id: string;
  empId: string;
  empName: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  siteLocation?: string;
}

export interface LeaveRequest {
  id: string;
  empId: string;
  empName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
}

export interface PayrollRecord {
  id: string;
  empId: string;
  empName: string;
  designation: string;
  month: string;
  basic: number;
  hra: number;
  specialAllowance: number;
  grossEarnings: number;
  pfDeduction: number;
  esiDeduction: number;
  profTax: number;
  totalDeductions: number;
  netPayable: number;
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
  paymentDate?: string;
  paymentRef?: string;
}

