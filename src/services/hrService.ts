import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, AttendanceStatus, LeaveStatus } from '../types';

const EMPLOYEES_KEY = 'pyrosafe_hr_employees_v1';
const ATTENDANCE_KEY = 'pyrosafe_hr_attendance_v1';
const LEAVES_KEY = 'pyrosafe_hr_leaves_v1';
const PAYROLL_KEY = 'pyrosafe_hr_payroll_v1';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    empCode: 'PYRO-001',
    name: 'Amjad Khan',
    designation: 'Principal Fire Safety Consultant & Auditor',
    department: 'Engineering & Ops',
    email: 'amjad@millenniumfireservice.com',
    phone: '+91 98201 11223',
    joiningDate: '2021-03-15',
    status: 'Active',
    basicSalary: 65000,
    allowances: 35000,
    grossSalary: 100000,
    pan: 'ABCDE1234F',
    bankAccount: '91802003881928',
    ifsc: 'HDFC0000123',
    emergencyContact: '+91 98201 99887'
  },
  {
    id: 'emp-2',
    empCode: 'PYRO-002',
    name: 'Rajesh Sharma',
    designation: 'Lead Hydrant & Sprinkler Project Engineer',
    department: 'Engineering & Ops',
    email: 'rajesh.sharma@pyrosafe.in',
    phone: '+91 98334 45566',
    joiningDate: '2022-01-10',
    status: 'Active',
    basicSalary: 45000,
    allowances: 25000,
    grossSalary: 70000,
    pan: 'BKIPS4567M',
    bankAccount: '50100234918231',
    ifsc: 'HDFC0000123',
    emergencyContact: '+91 98334 00000'
  },
  {
    id: 'emp-3',
    empCode: 'PYRO-003',
    name: 'Priya Nair',
    designation: 'Sr. Technical Sales & B2B Estimator',
    department: 'Sales & Estimation',
    email: 'priya.nair@pyrosafe.in',
    phone: '+91 97665 12345',
    joiningDate: '2022-06-01',
    status: 'Active',
    basicSalary: 38000,
    allowances: 22000,
    grossSalary: 60000,
    pan: 'CPYPN8912K',
    bankAccount: '003401567823',
    ifsc: 'ICIC0000034',
    emergencyContact: '+91 97665 99999'
  },
  {
    id: 'emp-4',
    empCode: 'PYRO-004',
    name: 'Vikram Patel',
    designation: 'Field Fire Inspector & Site Testing Tech',
    department: 'Field Safety & Audits',
    email: 'vikram.patel@pyrosafe.in',
    phone: '+91 99200 77889',
    joiningDate: '2023-04-12',
    status: 'Active',
    basicSalary: 28000,
    allowances: 14000,
    grossSalary: 42000,
    pan: 'DFGVP6789L',
    bankAccount: '309812450912',
    ifsc: 'SBIN0001245',
    emergencyContact: '+91 99200 11223'
  },
  {
    id: 'emp-5',
    empCode: 'PYRO-005',
    name: 'Sneha Kulkarni',
    designation: 'Finance & GST Compliance Executive',
    department: 'Finance & Accounts',
    email: 'sneha.k@pyrosafe.in',
    phone: '+91 98190 33445',
    joiningDate: '2023-08-01',
    status: 'Active',
    basicSalary: 32000,
    allowances: 16000,
    grossSalary: 48000,
    pan: 'EZPSK3412R',
    bankAccount: '601289347812',
    ifsc: 'MAHB0000451',
    emergencyContact: '+91 98190 88776'
  },
  {
    id: 'emp-6',
    empCode: 'PYRO-006',
    name: 'Santosh Deshmukh',
    designation: 'Workshop Refilling & Servicing Lead',
    department: 'Field Safety & Audits',
    email: 'santosh.d@pyrosafe.in',
    phone: '+91 98670 44332',
    joiningDate: '2023-11-15',
    status: 'Active',
    basicSalary: 22000,
    allowances: 10000,
    grossSalary: 32000,
    pan: 'GHYSD9012J',
    bankAccount: '200192847591',
    ifsc: 'BARB0POWAIX',
    emergencyContact: '+91 98670 99887'
  }
];

const getTodayStr = () => new Date().toISOString().split('T')[0];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', empId: 'emp-1', empName: 'Amjad Khan', date: getTodayStr(), status: 'Present', checkInTime: '09:05 AM', checkOutTime: '--' },
  { id: 'att-2', empId: 'emp-2', empName: 'Rajesh Sharma', date: getTodayStr(), status: 'On-Duty', checkInTime: '08:45 AM', siteLocation: 'Godrej One Complex, Vikhroli' },
  { id: 'att-3', empId: 'emp-3', empName: 'Priya Nair', date: getTodayStr(), status: 'Present', checkInTime: '09:12 AM', checkOutTime: '--' },
  { id: 'att-4', empId: 'emp-4', empName: 'Vikram Patel', date: getTodayStr(), status: 'On-Duty', checkInTime: '09:30 AM', siteLocation: 'Lodha iThink Techno Campus, Thane' },
  { id: 'att-5', empId: 'emp-5', empName: 'Sneha Kulkarni', date: getTodayStr(), status: 'Present', checkInTime: '09:15 AM', checkOutTime: '--' },
  { id: 'att-6', empId: 'emp-6', empName: 'Santosh Deshmukh', date: getTodayStr(), status: 'Present', checkInTime: '08:50 AM', checkOutTime: '--' }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'lve-1',
    empId: 'emp-4',
    empName: 'Vikram Patel',
    department: 'Field Safety & Audits',
    leaveType: 'Casual Leave',
    startDate: '2024-10-25',
    endDate: '2024-10-26',
    daysCount: 2,
    reason: 'Family wedding event in Surat',
    status: 'Approved',
    appliedOn: '2024-10-18',
    reviewedBy: 'Amjad Khan'
  },
  {
    id: 'lve-2',
    empId: 'emp-2',
    empName: 'Rajesh Sharma',
    department: 'Engineering & Ops',
    leaveType: 'Paid Leave',
    startDate: '2024-11-04',
    endDate: '2024-11-07',
    daysCount: 4,
    reason: 'Diwali vacation and travel',
    status: 'Pending',
    appliedOn: '2024-10-20'
  }
];

export const calculatePayrollForEmployee = (emp: Employee, month: string): PayrollRecord => {
  const basic = emp.basicSalary;
  const hra = Math.round(basic * 0.4);
  const specialAllowance = Math.max(0, emp.grossSalary - (basic + hra));
  const grossEarnings = basic + hra + specialAllowance;

  // EPF: 12% of basic (capped standard)
  const pfDeduction = Math.round(Math.min(basic, 15000) * 0.12);
  // ESI: 0.75% of gross if <= 21000, else 0
  const esiDeduction = grossEarnings <= 21000 ? Math.round(grossEarnings * 0.0075) : 0;
  // Professional Tax: standard Maharashtra ₹200/mo
  const profTax = 200;
  const totalDeductions = pfDeduction + esiDeduction + profTax;
  const netPayable = grossEarnings - totalDeductions;

  return {
    id: `pay-${emp.id}-${month.replace(/\s+/g, '-').toLowerCase()}`,
    empId: emp.id,
    empName: emp.name,
    designation: emp.designation,
    month,
    basic,
    hra,
    specialAllowance,
    grossEarnings,
    pfDeduction,
    esiDeduction,
    profTax,
    totalDeductions,
    netPayable,
    paymentStatus: 'Paid',
    paymentDate: '2024-10-01',
    paymentRef: `PYRO-SAL-${emp.empCode}-1024`
  };
};

export const INITIAL_PAYROLL: PayrollRecord[] = INITIAL_EMPLOYEES.map(emp => 
  calculatePayrollForEmployee(emp, 'October 2024')
);

export const hrService = {
  getEmployees(): Employee[] {
    try {
      const data = localStorage.getItem(EMPLOYEES_KEY);
      if (!data) {
        localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(INITIAL_EMPLOYEES));
        return INITIAL_EMPLOYEES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_EMPLOYEES;
    }
  },

  addEmployee(emp: Omit<Employee, 'id' | 'empCode'>): Employee {
    const employees = this.getEmployees();
    const nextNum = employees.length + 1;
    const empCode = `PYRO-${nextNum.toString().padStart(3, '0')}`;
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`,
      empCode,
      grossSalary: emp.basicSalary + emp.allowances
    };
    const updated = [...employees, newEmp];
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updated));
    return newEmp;
  },

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const employees = this.getEmployees();
    const idx = employees.findIndex(e => e.id === id);
    if (idx === -1) return null;
    const old = employees[idx];
    const updatedEmp = { ...old, ...updates };
    if (updates.basicSalary !== undefined || updates.allowances !== undefined) {
      updatedEmp.grossSalary = (updatedEmp.basicSalary || 0) + (updatedEmp.allowances || 0);
    }
    employees[idx] = updatedEmp;
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
    return updatedEmp;
  },

  getAttendance(date?: string): AttendanceRecord[] {
    const queryDate = date || getTodayStr();
    try {
      const data = localStorage.getItem(ATTENDANCE_KEY);
      let records: AttendanceRecord[] = data ? JSON.parse(data) : INITIAL_ATTENDANCE;
      // Filter or ensure today has records
      let dateRecords = records.filter(r => r.date === queryDate);
      if (dateRecords.length === 0 && queryDate === getTodayStr()) {
        dateRecords = INITIAL_ATTENDANCE;
      }
      return dateRecords;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  },

  markAttendance(
    empId: string, 
    status: AttendanceStatus, 
    siteLocation?: string,
    checkInTime?: string
  ): AttendanceRecord {
    const today = getTodayStr();
    const employees = this.getEmployees();
    const emp = employees.find(e => e.id === empId);
    const empName = emp ? emp.name : 'Unknown Employee';

    const rawData = localStorage.getItem(ATTENDANCE_KEY);
    let allRecords: AttendanceRecord[] = rawData ? JSON.parse(rawData) : INITIAL_ATTENDANCE;

    const existingIdx = allRecords.findIndex(r => r.empId === empId && r.date === today);
    const timeNow = checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let record: AttendanceRecord;
    if (existingIdx !== -1) {
      record = {
        ...allRecords[existingIdx],
        status,
        siteLocation: siteLocation || allRecords[existingIdx].siteLocation,
        checkInTime: allRecords[existingIdx].checkInTime || timeNow
      };
      allRecords[existingIdx] = record;
    } else {
      record = {
        id: `att-${Date.now()}`,
        empId,
        empName,
        date: today,
        status,
        checkInTime: timeNow,
        siteLocation
      };
      allRecords.push(record);
    }

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(allRecords));
    return record;
  },

  getLeaves(): LeaveRequest[] {
    try {
      const data = localStorage.getItem(LEAVES_KEY);
      if (!data) {
        localStorage.setItem(LEAVES_KEY, JSON.stringify(INITIAL_LEAVES));
        return INITIAL_LEAVES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LEAVES;
    }
  },

  applyLeave(req: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>): LeaveRequest {
    const leaves = this.getLeaves();
    const newReq: LeaveRequest = {
      ...req,
      id: `lve-${Date.now()}`,
      status: 'Pending',
      appliedOn: getTodayStr()
    };
    const updated = [newReq, ...leaves];
    localStorage.setItem(LEAVES_KEY, JSON.stringify(updated));
    return newReq;
  },

  updateLeaveStatus(id: string, status: LeaveStatus, reviewerName = 'Amjad Khan'): boolean {
    const leaves = this.getLeaves();
    const target = leaves.find(l => l.id === id);
    if (!target) return false;
    target.status = status;
    target.reviewedBy = reviewerName;
    localStorage.setItem(LEAVES_KEY, JSON.stringify(leaves));
    return true;
  },

  getPayroll(month = 'October 2024'): PayrollRecord[] {
    try {
      const data = localStorage.getItem(PAYROLL_KEY);
      if (!data) {
        localStorage.setItem(PAYROLL_KEY, JSON.stringify(INITIAL_PAYROLL));
        return INITIAL_PAYROLL;
      }
      const records: PayrollRecord[] = JSON.parse(data);
      const filtered = records.filter(p => p.month === month);
      return filtered.length > 0 ? filtered : records;
    } catch {
      return INITIAL_PAYROLL;
    }
  },

  markSalaryPaid(id: string, paymentRef?: string): boolean {
    try {
      const data = localStorage.getItem(PAYROLL_KEY);
      let records: PayrollRecord[] = data ? JSON.parse(data) : INITIAL_PAYROLL;
      const target = records.find(p => p.id === id);
      if (!target) return false;
      target.paymentStatus = 'Paid';
      target.paymentDate = getTodayStr();
      target.paymentRef = paymentRef || `NEFT-PYRO-${Date.now().toString().slice(-6)}`;
      localStorage.setItem(PAYROLL_KEY, JSON.stringify(records));
      return true;
    } catch {
      return false;
    }
  }
};
