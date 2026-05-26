import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FolderOpen, Clock, CheckCircle, AlertCircle,
  ArrowUpRight, Plus, TrendingUp, Activity, Upload, Sofa, LayoutTemplate, Box
} from 'lucide-react';
import { useNewProject } from '@/lib/NewProjectContext';

const stagger = (index) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
});

const stats = [
  { label: 'Active Projects', value: '24', icon: FolderOpen, color: '#06b6d4', change: '+3 this week' },
  { label: 'In Review', value: '8', icon: Clock, color: '#f59e0b', change: '2 need action' },
  { label: 'Completed', value: '142', icon: CheckCircle, color: '#22c55e', change: '+12 this month' },
  { label: 'Revisions Due', value: '5', icon: AlertCircle, color: '#ef4444', change: 'Urgent' },
];

const recentProjects = [
  { name: 'Willow Creek - Master Bath', client: 'Sarah M.', status: 'In Progress', pct: 65, updated: '2h ago' },
  { name: 'Downtown Loft Renovation', client: 'James T.', status: 'Review', pct: 90, updated: '5h ago' },
  { name: 'Heritage Home - 3 Baths', client: 'Priya K.', status: 'Draft', pct: 30, updated: '1d ago' },
  { name: 'Skyline Penthouse', client: 'Mike D.', status: 'Approved', pct: 100, updated: '2d ago' },
  { name: 'Coastal Retreat Bath', client: 'Emma L.', status: 'In Progress', pct: 45, updated: '3d ago' },
];

const statusConfig = {
  'In Progress': { background: 'rgba(168, 85, 247, 0.12)', color: '#9333ea' },
  'Review': { background: 'rgba(245, 158, 11, 0.14)', color: '#d97706' },
  'Draft': { background: 'rgba(148, 163, 184, 0.14)', color: '#64748b' },
  'Approved': { background: 'rgba(34, 197, 94, 0.14)', color: '#16a34a' },
};

const activity = [
  { action: 'Drawing package generated', project: 'Willow Creek', time: '2h ago', type: 'create' },
  { action: 'Client approved floor plan', project: 'Downtown Loft', time: '5h ago', type: 'approve' },
  { action: 'Revision requested', project: 'Heritage Home', time: '1d ago', type: 'revision' },
  { action: 'New project created', project: 'Skyline Penthouse', time: '2d ago', type: 'create' },
];

const cardStyle = {
  background: '#ffffff',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.05)',
};

const interiorProjects = [
  { id: 'modern-scandinavian-living-room', name: 'Modern Scandinavian Living Room', status: 'Ready to Present', rooms: 1, products: 8, updated: 'Edited today', palette: ['#e7dcc9', '#b38450', '#53604b'] },
  { id: 'open-plan-loft', name: 'Open Plan Loft Concept', status: 'In Progress', rooms: 3, products: 24, updated: 'Edited yesterday', palette: ['#ded7cb', '#29272a', '#bd8c57'] },
  { id: 'japandi-bedroom', name: 'Japandi Bedroom Suite', status: 'Draft', rooms: 2, products: 13, updated: 'Edited May 20', palette: ['#eee6dc', '#887b68', '#c6b096'] },
];

const designTemplates = ['Empty Studio', 'Open Plan Living + Kitchen', 'Bedroom Suite', 'Retail Boutique'];

export default function DashboardHome() {
  const { openNewProjectModal } = useNewProject();

  return (
    <div className="min-h-full bg-white">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <motion.div {...stagger(0)} className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-space font-bold text-2xl text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
          </div>
          <button
            type="button"
            onClick={() => openNewProjectModal()}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
          >
            <Plus size={16} />
            New Project
          </button>
        </motion.div>

        <motion.section {...stagger(1)} className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(112deg, #130d17 0%, #24112d 65%, #3c1550 100%)' }}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="text-xs font-semibold uppercase tracking-[.28em] text-fuchsia-300">SPACIO Interior Studio</div>
              <h2 className="mt-3 text-3xl font-bold">Design every wall, finish and furnishing in one workspace.</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">Draw accurate floorplans, edit the same room in 3D, curate moodboards and prepare client-ready exports.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => openNewProjectModal('Untitled Interior Design')} className="flex items-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-500"><Plus size={16} />Create New Design</button>
              <Link to="/editor/modern-scandinavian-living-room" className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"><Sofa size={16} />Open Sample Living Room</Link>
              <Link to="/editor/import-project" className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"><Upload size={16} />Import Project</Link>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div key={stat.label} {...stagger(index + 1)} className="rounded-2xl p-5" style={cardStyle}>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${stat.color}14`, border: `1px solid ${stat.color}28` }}
                  >
                    <Icon size={17} style={{ color: stat.color }} />
                  </div>
                  <TrendingUp size={14} className="text-slate-300" />
                </div>
                <div className="font-space font-bold text-3xl text-slate-900 mb-1">{stat.value}</div>
                <div className="text-slate-600 text-xs">{stat.label}</div>
                <div className="text-slate-400 text-[10px] mt-1">{stat.change}</div>
              </motion.div>
            );
          })}
        </div>

        <motion.section {...stagger(5)} className="space-y-4">
          <div className="flex items-center justify-between">
            <div><h2 className="font-semibold text-slate-900">Recent Interior Projects</h2><p className="text-xs text-slate-500">Editable SPACIO design workspaces</p></div>
            <Link to="/projects" className="text-xs font-semibold text-fuchsia-600">View all projects</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {interiorProjects.map((project) => (
              <Link key={project.id} to={`/editor/${project.id}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative h-32 p-4" style={{ background: `linear-gradient(130deg, ${project.palette[0]}, ${project.palette[1]})` }}>
                  <div className="absolute bottom-5 left-6 h-10 w-24 rounded-lg bg-white/55 shadow" /><div className="absolute bottom-4 left-28 h-7 w-12 rounded-full bg-white/70 shadow" />
                  <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2 py-1 text-[10px] font-semibold text-slate-700">{project.status}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-900">{project.name}</h3>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500"><span>{project.rooms} rooms</span><span className="flex items-center gap-1"><Box size={12} />{project.products} products</span><span>{project.updated}</span></div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        <motion.section {...stagger(6)} className="rounded-2xl p-5" style={cardStyle}>
          <div className="mb-4 flex items-center gap-2"><LayoutTemplate size={16} className="text-fuchsia-600" /><h2 className="text-sm font-semibold text-slate-900">Template Gallery</h2></div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {designTemplates.map((template) => <button type="button" key={template} onClick={() => openNewProjectModal(template)} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:border-fuchsia-200 hover:bg-fuchsia-50">{template}<span className="mt-2 block text-xs font-normal text-slate-400">Start editable design</span></button>)}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div {...stagger(5)} className="lg:col-span-2 rounded-2xl overflow-hidden" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 text-sm">Recent Projects</h2>
              <Link to="/projects" className="text-xs text-fuchsia-600 hover:text-fuchsia-500 flex items-center gap-1 font-semibold">
                View all <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="divide-y divide-slate-200">
              {recentProjects.map((project) => (
                <Link
                  key={project.name}
                  to="/planner"
                  state={{ projectName: project.name }}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
                >
                  <div className="w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(171, 0, 255, 0.07)', borderColor: 'rgba(171, 0, 255, 0.16)' }}>
                    <FolderOpen size={14} style={{ color: '#ab00ff' }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-900 font-semibold truncate">{project.name}</div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-slate-500">{project.client}</span>
                      <div className="flex-1 max-w-28 bg-slate-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${project.pct}%`, background: 'linear-gradient(90deg, #ab00ff 0%, #ec4899 100%)' }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{project.pct}%</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                      style={statusConfig[project.status]}
                    >
                      {project.status}
                    </span>
                    <span className="text-[10px] text-slate-400">{project.updated}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div {...stagger(6)} className="rounded-2xl overflow-hidden" style={cardStyle}>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200">
              <Activity size={14} className="text-fuchsia-600" />
              <h2 className="font-semibold text-slate-900 text-sm">Activity</h2>
            </div>

            <div className="p-5 space-y-4">
              {activity.map((item, index) => (
                <div key={`${item.project}-${index}`} className="flex gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      background: item.type === 'create' ? '#ab00ff' : item.type === 'approve' ? '#22c55e' : '#f59e0b'
                    }}
                  />
                  <div>
                    <div className="text-xs text-slate-700 font-medium">{item.action}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.project} | {item.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-slate-200 space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Quick Actions</div>
              {['New Drawing Package', 'Invite Client', 'Upload Files'].map((action) => (
                <button
                  key={action}
                  className="w-full text-left text-xs text-slate-600 hover:text-slate-900 px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  {action}
                  <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
