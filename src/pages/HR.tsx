import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  CreditCard, 
  Briefcase, 
  Building, 
  Mail, 
  Phone, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight,
  Flame,
  X,
  Check,
  MapPin,
  IndianRupee,
  BadgeCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/crm-utils';
import { PageProps, Employee, AttendanceRecord, LeaveRequest, PayrollRecord, Department, EmployeeStatus, AttendanceStatus, LeaveType } from '../types';
import { hrService, calculatePayrollForEmployee } from '../services/hrService';

export default function HR({ navigateTo }: PageProps) {
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'leaves' | 'payroll'>('employees');
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('October 2024');

  // Modals
  const [isAddEmpModalOpen, setIsAddEmpModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  // Add Employee Form
  const [empForm, setEmpForm] = useState({
    name: '',
    designation: '',
    department: 'Engineering & Ops' as Department,
    email: '',
    phone: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active' as EmployeeStatus,
    basicSalary: 35000,
    allowances: 15000,
    pan: '',
    bankAccount: '',
    ifsc: 'HDFC0000123',
    emergencyContact: ''
  });

  // Apply Leave Form
  const [leaveForm, setLeaveForm] = useState({
    empId: '',
    leaveType: 'Casual Leave' as LeaveType,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    daysCount: 1,
    reason: ''
  });

  const refreshData = () => {
    const emps = hrService.getEmployees();
    setEmployees(emps);
    setAttendance(hrService.getAttendance());
    setLeaves(hrService.getLeaves());
    setPayroll(hrService.getPayroll(selectedMonth));

    if (emps.length > 0 && !leaveForm.empId) {
      setLeaveForm(prev => ({ ...prev, empId: emps[0].id }));
    }
  };

  useEffect(() => {
    refreshData();
  }, [selectedMonth]);

  const departments: string[] = [
    'All',
    'Engineering & Ops',
    'Field Safety & Audits',
    'Sales & Estimation',
    'Finance & Accounts',
    'Admin & HR'
  ];

  // Filtering
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Attendance stats for today
  const totalStaff = employees.length;
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const onDutyCount = attendance.filter(a => a.status === 'On-Duty').length;
  const lateCount = attendance.filter(a => a.status === 'Late' || a.status === 'Half Day').length;
  const absentCount = totalStaff - (presentCount + onDutyCount + lateCount);

  // Total payroll figures
  const totalGrossPayroll = payroll.reduce((acc, p) => acc + p.grossEarnings, 0);
  const totalNetPayroll = payroll.reduce((acc, p) => acc + p.netPayable, 0);
  const totalDeductionsPayroll = payroll.reduce((acc, p) => acc + p.totalDeductions, 0);

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name || !empForm.email) return;

    hrService.addEmployee({
      ...empForm,
      grossSalary: empForm.basicSalary + empForm.allowances
    });
    refreshData();
    setIsAddEmpModalOpen(false);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === leaveForm.empId);
    if (!emp) return;

    hrService.applyLeave({
      empId: emp.id,
      empName: emp.name,
      department: emp.department,
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      daysCount: Math.max(1, leaveForm.daysCount),
      reason: leaveForm.reason
    });
    refreshData();
    setIsLeaveModalOpen(false);
  };

  const handleUpdateLeaveStatus = (id: string, status: 'Approved' | 'Rejected') => {
    hrService.updateLeaveStatus(id, status);
    refreshData();
  };

  const handleQuickAttendance = (empId: string, status: AttendanceStatus, site?: string) => {
    hrService.markAttendance(empId, status, site);
    refreshData();
  };

  const handleViewPayslip = (record: PayrollRecord) => {
    setSelectedPayslip(record);
    setIsPayslipModalOpen(true);
  };

  const handleMarkPaid = (id: string) => {
    hrService.markSalaryPaid(id);
    refreshData();
    if (selectedPayslip && selectedPayslip.id === id) {
      setSelectedPayslip({ ...selectedPayslip, paymentStatus: 'Paid', paymentDate: new Date().toISOString().split('T')[0] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden gap-4">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Pyrosafe Human Resources & Field Staff</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
              {employees.length} Personnel
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage engineering workforce, certified inspectors, daily field attendance, leave approvals, and monthly statutory payroll
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex items-center px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-200 transition-all border border-slate-300 shadow-sm"
          >
            <Calendar className="w-4 h-4 mr-2 text-slate-600" />
            Apply Leave
          </button>
          <button
            onClick={() => setIsAddEmpModalOpen(true)}
            className="flex items-center px-5 py-2.5 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-md hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-95"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('employees')}
          className={cn(
            "flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
            activeTab === 'employees' 
              ? "bg-slate-900 text-white shadow-sm" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          )}
        >
          <Users className="w-4 h-4 mr-2" />
          Staff Directory ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={cn(
            "flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
            activeTab === 'attendance' 
              ? "bg-slate-900 text-white shadow-sm" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          )}
        >
          <Clock className="w-4 h-4 mr-2" />
          Today's Field & Shift Attendance
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={cn(
            "flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
            activeTab === 'leaves' 
              ? "bg-slate-900 text-white shadow-sm" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          )}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Leave Requests ({leaves.filter(l => l.status === 'Pending').length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={cn(
            "flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
            activeTab === 'payroll' 
              ? "bg-slate-900 text-white shadow-sm" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          )}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Payroll & Salary Slips
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAB 1: EMPLOYEES DIRECTORY */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="w-full md:w-96 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff by name, code, designation, or email..." 
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all" 
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={cn(
                    "px-3 py-1.5 text-[11px] font-bold rounded-md whitespace-nowrap transition-all",
                    selectedDept === dept 
                      ? "bg-red-600 text-white shadow-sm" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((emp) => (
              <div 
                key={emp.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-red-200 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
                        {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-red-600 transition-colors">
                          {emp.name}
                        </h4>
                        <span className="font-mono text-[10px] text-slate-400 font-bold block">{emp.empCode}</span>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider",
                      emp.status === 'Active' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      emp.status === 'On Leave' ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      {emp.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="text-xs font-semibold text-slate-800">{emp.designation}</div>
                    <div className="inline-block px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-600 rounded">
                      {emp.department}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{emp.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Gross Monthly CTC</span>
                    <p className="text-sm font-black text-slate-900 font-mono">{formatCurrency(emp.grossSalary)}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Joined {emp.joiningDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 2: ATTENDANCE & FIELD SHIFTS */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Today's Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Staff</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalStaff} Personnel</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Present in Office/HQ</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{presentCount}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">On-Duty Field Audits</span>
              <p className="text-2xl font-black text-blue-600 mt-1">{onDutyCount}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Half-Day / Absent</span>
              <p className="text-2xl font-black text-amber-600 mt-1">{lateCount + absentCount}</p>
            </div>
          </div>

          {/* Attendance Table with 1-click status update */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Today's Attendance & Field Inspection Register</h3>
                <p className="text-xs text-slate-500">Record check-in times and live on-site inspection assignments</p>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded">
                Live Status: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-black bg-slate-50/80">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Department & Role</th>
                    <th className="px-6 py-4">Check-in Time</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4">Site Location / Duty Assignment</th>
                    <th className="px-6 py-4 text-right">Quick Mark Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {employees.map((emp) => {
                    const record = attendance.find(a => a.empId === emp.id);
                    const currentStatus = record?.status || 'Absent';
                    const checkIn = record?.checkInTime || '--';
                    const site = record?.siteLocation || 'Pyrosafe Central Office';

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-xs">{emp.name}</div>
                          <span className="font-mono text-[10px] text-slate-400">{emp.empCode}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-slate-700">{emp.designation}</div>
                          <span className="text-[10px] text-slate-400 font-medium">{emp.department}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-600">
                          {checkIn}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1",
                            currentStatus === 'Present' ? "bg-emerald-100 text-emerald-800" :
                            currentStatus === 'On-Duty' ? "bg-blue-100 text-blue-800" :
                            currentStatus === 'Late' || currentStatus === 'Half Day' ? "bg-amber-100 text-amber-800" :
                            "bg-rose-100 text-rose-800"
                          )}>
                            {currentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-xs text-slate-600">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[200px]">{site}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleQuickAttendance(emp.id, 'Present')}
                              className={cn(
                                "px-2 py-1 text-[10px] font-bold rounded transition-colors",
                                currentStatus === 'Present' ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                              )}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => {
                                const siteName = prompt('Enter Client Site Name for On-Duty inspection:', 'Client Facility Audit');
                                if (siteName) handleQuickAttendance(emp.id, 'On-Duty', siteName);
                              }}
                              className={cn(
                                "px-2 py-1 text-[10px] font-bold rounded transition-colors",
                                currentStatus === 'On-Duty' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                              )}
                            >
                              Site Audit
                            </button>
                            <button
                              onClick={() => handleQuickAttendance(emp.id, 'Half Day')}
                              className={cn(
                                "px-2 py-1 text-[10px] font-bold rounded transition-colors",
                                currentStatus === 'Half Day' ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                              )}
                            >
                              Half Day
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 3: LEAVE MANAGEMENT */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Casual Leave Quota</span>
              <p className="text-2xl font-black text-slate-900 mt-2">12 Days / Year</p>
              <p className="text-xs text-slate-500 mt-1">1 day accumulated per month</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical / Sick Leave</span>
              <p className="text-2xl font-black text-slate-900 mt-2">8 Days / Year</p>
              <p className="text-xs text-slate-500 mt-1">Requires medical certificate if &gt; 2 days</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid Earned Leave</span>
              <p className="text-2xl font-black text-slate-900 mt-2">15 Days / Year</p>
              <p className="text-xs text-slate-500 mt-1">Carry forward up to 30 days allowed</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Staff Leave Applications & Approvals</h3>
                <p className="text-xs text-slate-500">Review, approve, or reject employee leave requests</p>
              </div>
              <button
                onClick={() => setIsLeaveModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-sm"
              >
                + Submit Leave Request
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-black bg-slate-50/80">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Leave Type</th>
                    <th className="px-6 py-4">Duration & Days</th>
                    <th className="px-6 py-4">Reason / Notes</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Approval Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                        No leave requests submitted yet.
                      </td>
                    </tr>
                  ) : (
                    leaves.map((lve) => (
                      <tr key={lve.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-xs">{lve.empName}</div>
                          <span className="text-[10px] text-slate-400">{lve.department}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700">
                            {lve.leaveType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-semibold text-slate-800">
                            {lve.startDate} to {lve.endDate}
                          </div>
                          <span className="text-[10px] font-bold text-red-600">{lve.daysCount} Day(s)</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-600 max-w-xs">{lve.reason}</p>
                          <span className="text-[10px] text-slate-400">Applied on {lve.appliedOn}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider",
                            lve.status === 'Approved' ? "bg-emerald-100 text-emerald-800" :
                            lve.status === 'Rejected' ? "bg-rose-100 text-rose-800" :
                            "bg-amber-100 text-amber-800"
                          )}>
                            {lve.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {lve.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUpdateLeaveStatus(lve.id, 'Approved')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-all shadow-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateLeaveStatus(lve.id, 'Rejected')}
                                className="px-3 py-1 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded text-xs font-bold transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Reviewed by {lve.reviewedBy || 'Admin'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 4: PAYROLL & SALARY SLIPS */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* Payroll Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Gross Earnings</span>
              <p className="text-2xl font-black text-slate-900 mt-2">{formatCurrency(totalGrossPayroll)}</p>
              <p className="text-xs text-slate-500 mt-1">Basic + HRA + Special Allowances</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Statutory Deductions</span>
              <p className="text-2xl font-black text-rose-600 mt-2">{formatCurrency(totalDeductionsPayroll)}</p>
              <p className="text-xs text-slate-500 mt-1">EPF (12%) + ESI (0.75%) + Professional Tax</p>
            </div>
            <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Net Payable Salary Disbursed</span>
              <p className="text-2xl font-black text-white mt-2">{formatCurrency(totalNetPayroll)}</p>
              <p className="text-xs text-slate-400 mt-1">Direct Bank Transfer to verified accounts</p>
            </div>
          </div>

          {/* Payroll Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Monthly Compensation & Payslip Register</h3>
                <p className="text-xs text-slate-500">Cycle: {selectedMonth}</p>
              </div>

              <div className="flex items-center gap-3">
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700 outline-none"
                >
                  <option>October 2024</option>
                  <option>September 2024</option>
                  <option>August 2024</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-black bg-slate-50/80">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4 text-right">Basic + HRA</th>
                    <th className="px-6 py-4 text-right">Gross Total</th>
                    <th className="px-6 py-4 text-right">PF & Tax Ded.</th>
                    <th className="px-6 py-4 text-right">Net In-Hand</th>
                    <th className="px-6 py-4">Disbursement</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {payroll.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-xs">{pay.empName}</div>
                        <span className="text-[10px] text-slate-400">{pay.designation}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-slate-600">
                        {formatCurrency(pay.basic + pay.hra)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs font-bold text-slate-800">
                        {formatCurrency(pay.grossEarnings)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-rose-600">
                        -{formatCurrency(pay.totalDeductions)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm font-black text-slate-900">
                        {formatCurrency(pay.netPayable)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1",
                          pay.paymentStatus === 'Paid' ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        )}>
                          {pay.paymentStatus === 'Paid' && <BadgeCheck className="w-3 h-3 text-emerald-700" />}
                          {pay.paymentStatus}
                        </span>
                        {pay.paymentRef && (
                          <div className="font-mono text-[9px] text-slate-400 mt-0.5">{pay.paymentRef}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {pay.paymentStatus !== 'Paid' && (
                            <button
                              onClick={() => handleMarkPaid(pay.id)}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-xs font-bold transition-all"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => handleViewPayslip(pay)}
                            className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded text-xs font-bold transition-all flex items-center shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1" />
                            Payslip
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: ADD EMPLOYEE */}
      {/* ------------------------------------------------------------------ */}
      {isAddEmpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Pyrosafe Team Member</h3>
                <p className="text-xs text-slate-500">Register employee profile, department, and compensation</p>
              </div>
              <button onClick={() => setIsAddEmpModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Full Name</label>
                  <input
                    type="text"
                    required
                    value={empForm.name}
                    onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                    placeholder="e.g. Farhan Siddiqui"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Designation / Role</label>
                  <input
                    type="text"
                    required
                    value={empForm.designation}
                    onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
                    placeholder="e.g. Fire Alarm Technician"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Department</label>
                  <select
                    value={empForm.department}
                    onChange={(e) => setEmpForm({ ...empForm, department: e.target.value as Department })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none bg-white"
                  >
                    <option value="Engineering & Ops">Engineering & Ops</option>
                    <option value="Field Safety & Audits">Field Safety & Audits</option>
                    <option value="Sales & Estimation">Sales & Estimation</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Admin & HR">Admin & HR</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Work Email</label>
                  <input
                    type="email"
                    required
                    value={empForm.email}
                    onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                    placeholder="name@pyrosafe.in"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={empForm.phone}
                    onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Monthly Basic Salary (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={empForm.basicSalary}
                    onChange={(e) => setEmpForm({ ...empForm, basicSalary: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Monthly Allowances (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={empForm.allowances}
                    onChange={(e) => setEmpForm({ ...empForm, allowances: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">PAN Number</label>
                  <input
                    type="text"
                    value={empForm.pan}
                    onChange={(e) => setEmpForm({ ...empForm, pan: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Bank Account #</label>
                  <input
                    type="text"
                    value={empForm.bankAccount}
                    onChange={(e) => setEmpForm({ ...empForm, bankAccount: e.target.value })}
                    placeholder="50100XXXXXXXX"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddEmpModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: APPLY LEAVE */}
      {/* ------------------------------------------------------------------ */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Apply for Leave</h3>
                <p className="text-xs text-slate-500">Submit request for management review</p>
              </div>
              <button onClick={() => setIsLeaveModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Select Employee</label>
                <select
                  value={leaveForm.empId}
                  onChange={(e) => setLeaveForm({ ...leaveForm, empId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none bg-white font-medium"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as LeaveType })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none bg-white font-medium"
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Paid Leave">Paid Earned Leave (PL)</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Days Count</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={leaveForm.daysCount}
                  onChange={(e) => setLeaveForm({ ...leaveForm, daysCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Reason</label>
                <textarea
                  required
                  rows={3}
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="State the purpose of the leave..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: PROFESSIONAL PAYSLIP VIEW & PRINT */}
      {/* ------------------------------------------------------------------ */}
      {isPayslipModalOpen && selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-5">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-red-500 to-orange-600 p-2.5 rounded-lg text-white shadow-md">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Pyrosafe Solutions Pvt Ltd</h3>
                  <p className="text-[11px] text-slate-600 font-medium">PLOT NO 149, PRESS SITE, INDUSTRIAL AREA PHASE 1, Chandigarh - 160002</p>
                  <p className="text-[10px] font-mono text-slate-500 font-bold">GSTIN: 04AAQCP8028G1Z7 • Ph: 9136406255 • State: Chandigarh (04)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPayslipModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payslip Title Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidential Payslip</span>
                <p className="text-base font-black text-slate-900 tracking-tight">Salary Slip for {selectedPayslip.month}</p>
              </div>
              <span className={cn(
                "px-3 py-1 rounded text-xs font-black uppercase tracking-wider",
                selectedPayslip.paymentStatus === 'Paid' ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              )}>
                {selectedPayslip.paymentStatus}
              </span>
            </div>

            {/* Employee Info Block */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employee Name</span>
                <p className="font-bold text-slate-900">{selectedPayslip.empName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Designation</span>
                <p className="font-bold text-slate-900">{selectedPayslip.designation}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Reference</span>
                <p className="font-mono font-bold text-slate-700">{selectedPayslip.paymentRef || 'Pending NEFT Generation'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Disbursement Date</span>
                <p className="font-bold text-slate-700">{selectedPayslip.paymentDate || '--'}</p>
              </div>
            </div>

            {/* Earnings & Deductions Breakdown Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                {/* Earnings */}
                <div className="p-4 space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 border-b border-emerald-100 pb-2">
                    Earnings Breakdown
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Basic Pay</span>
                      <span className="font-mono font-bold text-slate-900">{formatCurrency(selectedPayslip.basic)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">House Rent Allowance (HRA)</span>
                      <span className="font-mono font-bold text-slate-900">{formatCurrency(selectedPayslip.hra)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Special Allowances</span>
                      <span className="font-mono font-bold text-slate-900">{formatCurrency(selectedPayslip.specialAllowance)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold">
                      <span className="text-slate-800">Gross Earnings</span>
                      <span className="font-mono text-emerald-700">{formatCurrency(selectedPayslip.grossEarnings)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="p-4 space-y-3 bg-slate-50/50">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-700 border-b border-rose-100 pb-2">
                    Statutory Deductions
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Provident Fund (EPF 12%)</span>
                      <span className="font-mono font-bold text-slate-900">{formatCurrency(selectedPayslip.pfDeduction)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">ESI (Health Insurance)</span>
                      <span className="font-mono font-bold text-slate-900">{formatCurrency(selectedPayslip.esiDeduction)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Professional Tax (PT)</span>
                      <span className="font-mono font-bold text-slate-900">{formatCurrency(selectedPayslip.profTax)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold">
                      <span className="text-slate-800">Total Deductions</span>
                      <span className="font-mono text-rose-600">-{formatCurrency(selectedPayslip.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay Highlight Bar */}
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Net Disbursed Take-Home Pay</span>
                  <p className="text-xs text-slate-400">Directly deposited to bank account</p>
                </div>
                <div className="text-2xl font-black text-white font-mono tracking-tight">
                  {formatCurrency(selectedPayslip.netPayable)}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-[10px] text-slate-400">
                Pyrosafe Solutions HRMS • System Generated Document
              </span>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print Payslip
                </button>
                <button
                  type="button"
                  onClick={() => setIsPayslipModalOpen(false)}
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-all shadow-sm"
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
