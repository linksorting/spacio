import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Mail, Phone, FolderOpen,
  MessageSquare, MoreHorizontal
} from 'lucide-react';

const CLIENTS = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah@willowcreek.com', phone: '+1 (555) 0101', projects: 3, status: 'active', lastContact: '2h ago', avatar: 'SM' },
  { id: 2, name: 'James Thompson', email: 'james@berkley.com', phone: '+1 (555) 0102', projects: 1, status: 'review', lastContact: '5h ago', avatar: 'JT' },
  { id: 3, name: 'Priya Kapoor', email: 'priya@aqua.com', phone: '+1 (555) 0103', projects: 3, status: 'active', lastContact: '1d ago', avatar: 'PK' },
  { id: 4, name: 'Mike Davidson', email: 'mike@forma.com', phone: '+1 (555) 0104', projects: 1, status: 'completed', lastContact: '2d ago', avatar: 'MD' },
  { id: 5, name: 'Emma Laurent', email: 'emma@coastal.com', phone: '+1 (555) 0105', projects: 1, status: 'active', lastContact: '3d ago', avatar: 'EL' },
];

const statusConfig = {
  active: { class: 'bg-dp-blue/15 text-dp-blue', label: 'Active' },
  review: { class: 'bg-yellow-500/15 text-yellow-400', label: 'In Review' },
  completed: { class: 'bg-green-500/15 text-green-400', label: 'Completed' },
};

export default function ClientManagement() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedClient = CLIENTS.find(c => c.id === selected);

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="font-space font-bold text-2xl text-white">Clients</h1>
              <p className="text-white/40 text-sm mt-1">{CLIENTS.length} clients total</p>
            </div>
            <button className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold">
              <Plus size={16} />
              Add Client
            </button>
          </div>
          <div className="flex items-center gap-2 glass rounded-lg px-3 py-2 max-w-sm">
            <Search size={14} className="text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white placeholder-white/25 outline-none flex-1"
              placeholder="Search clients..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((client, i) => {
            const sc = statusConfig[client.status];
            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => setSelected(client.id === selected ? null : client.id)}
                className={`flex items-center gap-4 px-6 py-4 border-b border-white/3 cursor-pointer transition-all ${
                  selected === client.id ? 'bg-dp-blue/5 border-l-2 border-l-dp-blue' : 'hover:bg-white/2'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dp-blue/30 to-dp-violet/30 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {client.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white/80 font-semibold">{client.name}</div>
                  <div className="text-xs text-white/30">{client.email}</div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-white/30">
                  <FolderOpen size={11} />
                  {client.projects}
                </div>
                <span className={`hidden md:inline text-[10px] px-2 py-0.5 rounded-full font-medium ${sc.class}`}>
                  {sc.label}
                </span>
                <span className="text-[10px] text-white/20 hidden sm:block">{client.lastContact}</span>
                <button className="text-white/20 hover:text-white transition-colors ml-1">
                  <MoreHorizontal size={16} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Client detail panel */}
      {selectedClient && (
        <motion.div
          key={selectedClient.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-72 bg-dp-surface border-l border-white/5 flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dp-blue/30 to-dp-violet/30 border border-white/10 flex items-center justify-center text-lg font-bold text-white mx-auto mb-4">
              {selectedClient.avatar}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white">{selectedClient.name}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${statusConfig[selectedClient.status].class}`}>
                {statusConfig[selectedClient.status].label}
              </span>
            </div>
          </div>

          {/* Contact info */}
          <div className="p-5 space-y-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Mail size={13} className="text-white/30 flex-shrink-0" />
              <span className="text-xs text-white/60 truncate">{selectedClient.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={13} className="text-white/30 flex-shrink-0" />
              <span className="text-xs text-white/60">{selectedClient.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <FolderOpen size={13} className="text-white/30 flex-shrink-0" />
              <span className="text-xs text-white/60">{selectedClient.projects} active projects</span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-5 space-y-2">
            <button className="w-full btn-primary py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
              <MessageSquare size={13} />
              Send Message
            </button>
            <button className="w-full btn-glass py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 text-white">
              <FolderOpen size={13} />
              View Projects
            </button>
          </div>

          {/* Review status */}
          <div className="p-5 border-t border-white/5">
            <div className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3">Pending Reviews</div>
            {[
              { name: 'Floor Plan v3', action: 'Awaiting approval' },
              { name: 'Tile Schedule', action: 'Changes requested' },
            ].map((item) => (
              <div key={item.name} className="glass-card rounded-lg p-3 mb-2">
                <div className="text-xs text-white/70 font-medium">{item.name}</div>
                <div className="text-[10px] text-white/30 mt-0.5">{item.action}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
