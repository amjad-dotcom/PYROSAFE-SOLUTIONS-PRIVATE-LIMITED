/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Target, 
  CheckSquare, 
  Settings as SettingsIcon,
  Receipt,
  FileText,
  ShoppingBag,
  Plus,
  LayoutDashboard,
  Menu,
  X,
  CreditCard,
  Flame,
  Boxes,
  UserCheck,
  Database,
  LogOut,
  ShieldCheck,
  Lock,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { View } from './types';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Pipeline from './pages/Pipeline';
import Tasks from './pages/Tasks';
import Invoices from './pages/Invoices';
import Quotes from './pages/Quotes';
import PurchaseOrders from './pages/PurchaseOrders';
import Settings from './pages/Settings';
import RecordPayment from './pages/RecordPayment';
import NewClient from './pages/NewClient';
import ClientDetail from './pages/ClientDetail';
import NewInvoice from './pages/NewInvoice';
import Inventory from './pages/Inventory';
import HR from './pages/HR';
import Readme from './pages/Readme';
import Login from './pages/Login';
import { authService, AuthUser } from './services/authService';
import { invoiceService, MongoDbStatus } from './services/invoiceService';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<MongoDbStatus | null>(null);

  // Check existing session on load
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && authService.isAuthenticated()) {
      setCurrentUser(user);
    }
    setIsAuthChecking(false);
  }, []);

  // Check MongoDB connection status periodically when logged in
  useEffect(() => {
    if (currentUser) {
      invoiceService.getDbStatus().then(status => setDbStatus(status)).catch(() => {});
    }
  }, [currentUser, currentView]);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const navigateTo = (view: View, clientId?: string) => {
    setCurrentView(view);
    if (clientId) setSelectedClientId(clientId);
    setIsSidebarOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: Target },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'quotes', label: 'Quotes & Proforma', icon: FileText },
    { id: 'invoices', label: 'Tax Invoices', icon: Receipt },
    { id: 'po', label: 'Purchase Orders', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory & Stock', icon: Boxes },
    { id: 'hr', label: 'HR & Team', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'readme', label: 'System README', icon: BookOpen },
  ];

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-red-600 rounded-2xl shadow-xl">
            <Flame className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-slate-400">Loading Pyrosafe Secure Portal...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, render Login Page
  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col text-white transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-red-600 rounded-lg rotate-45 opacity-20" />
                <div className="relative bg-gradient-to-br from-red-500 to-orange-600 p-2 rounded-lg shadow-lg">
                  <Flame className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter uppercase leading-none text-white">Pyrosafe</span>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-0.5">Solutions Pvt Ltd</span>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item, index) => {
              const showCRMHeader = index === 0;
              const showFinanceHeader = item.id === 'quotes';
              const showOpsHeader = item.id === 'inventory';
              const showAdminHeader = item.id === 'settings';
              
              return (
                <React.Fragment key={item.id}>
                  {showCRMHeader && (
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 mt-1">Sales & CRM</div>
                  )}
                  {showFinanceHeader && (
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 mt-5">Finance & Billing</div>
                  )}
                  {showOpsHeader && (
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 mt-5">Operations & Workforce</div>
                  )}
                  {showAdminHeader && (
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 mt-5">System</div>
                  )}
                  <button
                    onClick={() => navigateTo(item.id as View)}
                    className={cn(
                      "flex items-center w-full px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer",
                      currentView === item.id 
                        ? "bg-red-600 text-white shadow-sm font-semibold" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 mr-3 transition-colors", currentView === item.id ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                    {item.label}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* User Profile Section with Logout */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm">
                  RS
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Ravi</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">pyrosafesolutions2026</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            
            {/* MongoDB Secure Badge */}
            <div className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Database className="w-3 h-3 text-emerald-400" />
                <span className="font-mono">pyrosafe_db</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-slate-50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500 lg:hidden cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 capitalize tracking-tight ml-2 lg:ml-0">
              {currentView === 'dashboard' ? 'Overview' : 
               currentView === 'inventory' ? 'Inventory & Stock Hub' :
               currentView === 'hr' ? 'Human Resources & Team' :
               currentView === 'invoices' ? 'Tax Invoices (MongoDB)' :
               currentView === 'readme' ? 'System README & Docs' :
               currentView.replace('-', ' ')}
            </h1>

            {/* MongoDB Live Indicator */}
            <div 
              onClick={() => navigateTo('invoices')}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
            >
              <Database className="w-3 h-3 text-emerald-600" />
              <span>MongoDB: {dbStatus?.connected ? 'Cluster Live' : 'Active Store'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex flex-col items-end text-right">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Admin Authenticated</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 truncate max-w-[200px]">
                pyrosafesolutions2026@gmail.com
              </span>
            </div>

            <button 
              onClick={() => navigateTo('new-invoice')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              + New Invoice
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-6 lg:p-8"
            >
              {currentView === 'dashboard' && <Dashboard navigateTo={navigateTo} />}
              {currentView === 'clients' && <Clients navigateTo={navigateTo} />}
              {currentView === 'pipeline' && <Pipeline navigateTo={navigateTo} />}
              {currentView === 'tasks' && <Tasks navigateTo={navigateTo} />}
              {currentView === 'quotes' && <Quotes navigateTo={navigateTo} />}
              {currentView === 'invoices' && <Invoices navigateTo={navigateTo} />}
              {currentView === 'po' && <PurchaseOrders navigateTo={navigateTo} />}
              {currentView === 'inventory' && <Inventory navigateTo={navigateTo} />}
              {currentView === 'hr' && <HR navigateTo={navigateTo} />}
              {currentView === 'settings' && <Settings navigateTo={navigateTo} />}
              {currentView === 'record-payment' && <RecordPayment navigateTo={navigateTo} />}
              {currentView === 'new-client' && <NewClient navigateTo={navigateTo} />}
              {currentView === 'client-detail' && <ClientDetail clientId={selectedClientId!} navigateTo={navigateTo} />}
              {currentView === 'new-invoice' && <NewInvoice navigateTo={navigateTo} />}
              {currentView === 'readme' && <Readme navigateTo={navigateTo} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
