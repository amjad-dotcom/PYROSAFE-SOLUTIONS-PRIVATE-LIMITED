import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Calendar, Briefcase, Info, MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { PageProps } from '../types';

export default function Tasks({ navigateTo }: PageProps) {
  const [activeDate, setActiveDate] = useState('Tue 24');

  const days = [
    { day: 'Mon', num: '23' },
    { day: 'Tue', num: '24' },
    { day: 'Wed', num: '25' },
    { day: 'Thu', num: '26' },
    { day: 'Fri', num: '27' },
  ];

  const tasks = [
    { id: 1, title: 'Call Sarah regarding Acme Deal', meta: 'Acme Solutions • 10:30 AM', type: 'follow_up', priority: 'high', completed: false },
    { id: 2, title: 'Review NextWave Proposal', meta: 'Project Milestone • 1:00 PM', type: 'milestone', priority: 'medium', completed: false },
    { id: 3, title: 'Email invoice to Global Tech', meta: 'Accounts • 2:30 PM', type: 'follow_up', priority: 'low', completed: true },
    { id: 4, title: 'Sync with Design Team', meta: 'Internal • 4:00 PM', type: 'milestone', priority: 'medium', completed: false },
    { id: 5, title: 'Update CRM Lead Status', meta: 'Pipeline Maintenance', type: 'follow_up', priority: 'low', completed: true },
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Focus & Tasks</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Managed workflow for agency efficiency</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black text-slate-900 uppercase">John Doe</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Lead Partner</span>
          </div>
          <div className="w-10 h-10 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-500 font-black text-xs shadow-lg shadow-slate-200">
            JD
          </div>
        </div>
      </div>

      {/* Date Picker */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
        {days.map((d) => (
          <button 
            key={d.num}
            onClick={() => setActiveDate(`${d.day} ${d.num}`)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[72px] h-24 rounded-xl transition-all border",
              activeDate === `${d.day} ${d.num}`
                ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200 scale-105 z-10"
                : "bg-white border-slate-200 text-slate-400 hover:border-blue-300 hover:text-slate-600 shadow-sm"
            )}
          >
            <span className="text-[10px] font-black uppercase mb-2 tracking-widest">{d.day}</span>
            <span className="text-2xl font-black">{d.num}</span>
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-colors">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pending Tasks</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-slate-900 tracking-tight">12</p>
            <Info className="w-4 h-4 text-blue-400 opacity-20" />
          </div>
        </div>
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl shadow-sm flex flex-col justify-between group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Daily Completion</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-green-600 tracking-tight">85%</p>
            <CheckCircle2 className="w-4 h-4 text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase leading-none">Today's Schedule</h3>
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:blue-700 transition-all">Quick Add</button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className={cn(
                "group p-5 bg-white rounded-xl border border-slate-200 flex items-start gap-5 hover:border-blue-300 transition-all cursor-pointer shadow-sm relative overflow-hidden",
                task.completed && "opacity-50"
              )}
            >
              <div className={cn(
                "absolute top-0 left-0 w-1 h-full transition-colors",
                task.completed ? "bg-slate-200" : 
                task.priority === 'high' ? "bg-rose-500" : 
                task.priority === 'medium' ? "bg-amber-500" : "bg-blue-500"
              )} />

              <button className="mt-1 transition-transform group-hover:scale-110 active:scale-95">
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-200 group-hover:text-blue-500 transition-all" />
                )}
              </button>
              
              <div className="flex-1 space-y-2">
                <p className={cn(
                  "text-sm font-bold text-slate-800 transition-all tracking-tight leading-tight",
                  task.completed && "line-through text-slate-400"
                )}>
                  {task.title}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    {task.type === 'follow_up' ? <Calendar className="w-3.5 h-3.5 text-blue-500" /> : <Briefcase className="w-3.5 h-3.5 text-indigo-500" />}
                    {task.meta}
                  </div>
                  {!task.completed && (
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.1em]",
                      task.priority === 'high' ? "bg-rose-50 text-rose-600" :
                      task.priority === 'medium' ? "bg-amber-50 text-amber-600" :
                      "bg-blue-50 text-blue-600"
                    )}>
                      {task.priority} Priority
                    </span>
                  )}
                </div>
              </div>
              
              <button className="text-slate-200 hover:text-slate-500 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-8 right-8 z-40 group">
        <button className="flex items-center gap-3 px-6 py-3.5 bg-blue-600 text-white rounded-md text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Assign New Task
        </button>
      </div>
    </div>
  );
}
