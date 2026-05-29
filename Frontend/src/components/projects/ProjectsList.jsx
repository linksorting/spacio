import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FolderPlus, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useNewProject } from '@/lib/NewProjectContext';
import {
  formatRelativeUpdatedAt,
  listProjects,
  migrateProjectsFromStorage,
} from '@/lib/projectRegistry';

const tutorials = [
  { title: 'FOYR NEO - ULTIMATE OVERVIEW', sub: 'Foyr Neo - An overview', duration: '12:34', color: '#2c4a3e' },
  { title: 'HOW TO UPLOAD FLOOR PLAN IN FOYR NEO', sub: 'How to upload a floor plan', duration: '4:21', color: '#3a3060' },
  { title: 'HOW TO ADD FURNITURE IN FOYR NEO', sub: 'How to use furniture', duration: '7:15', color: '#4a2030' },
  { title: 'HOW TO NAVIGATE IN FOYR NEO', sub: 'Navigations in Neo - An ove...', duration: '6:02', color: '#2a3050' },
  { title: 'RENDER TUTORIAL', sub: 'How to take a render', duration: '5:44', color: '#1a3a2a' },
];

const THUMB_COLORS = ['#2c4a3e', '#3a3060', '#4a2030', '#2a3050', '#1a3a2a', '#3d2a4a'];

export default function ProjectsList() {
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [tutorialIdx, setTutorialIdx] = useState(0);
  const [projects, setProjects] = useState([]);
  const { openNewProjectModal } = useNewProject();

  useEffect(() => {
    const refreshProjects = () => {
      migrateProjectsFromStorage();
      setProjects(listProjects());
    };

    refreshProjects();
    window.addEventListener('focus', refreshProjects);
    return () => window.removeEventListener('focus', refreshProjects);
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) => project.name.toLowerCase().includes(query));
  }, [projects, search]);

  const visibleTutorials = tutorials.slice(tutorialIdx, tutorialIdx + 4);

  return (
    <div className="min-h-full" style={{ background: '#f5f0ee', fontFamily: '"DM Sans", sans-serif' }}>
      <div className="px-6 pt-5 pb-4" style={{ background: '#f5f0ee', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="text-sm font-medium mb-3" style={{ color: '#333' }}>Video Tutorials</div>
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setTutorialIdx((i) => Math.max(0, i - 1))}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ background: tutorialIdx === 0 ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.12)', color: tutorialIdx === 0 ? '#aaa' : '#333' }}
          >
            <ChevronLeft size={14} />
          </button>

          <div className="flex gap-3 flex-1 overflow-hidden">
            {visibleTutorials.map((t, i) => (
              <div
                key={t.title}
                className="flex-1 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', minWidth: 0 }}
              >
                <div className="relative h-28 flex items-end p-2" style={{ background: t.color }}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                      <Play size={18} fill="white" color="white" />
                    </div>
                  </div>
                  <div className="relative">
                    <div className="text-[9px] font-bold text-white/80 uppercase leading-tight" style={{ fontSize: 9 }}>
                      {t.title.split(' ').slice(0, 4).join(' ')}
                      <br />
                      <span style={{ color: '#ab00ff' }}>{t.title.split(' ').slice(4).join(' ')}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 w-6 h-4 rounded-sm flex items-center justify-center" style={{ background: '#111', opacity: 0.8 }}>
                    <span style={{ fontSize: 6, color: 'white', fontWeight: 700 }}>▶ neo</span>
                  </div>
                </div>
                <div className="p-2 flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: '#ab00ff' }} />
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium truncate" style={{ color: '#333' }}>{t.sub}</div>
                    <div className="text-[9px]" style={{ color: '#999' }}>{t.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setTutorialIdx((i) => Math.min(tutorials.length - 4, i + 1))}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ background: tutorialIdx >= tutorials.length - 4 ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.12)', color: tutorialIdx >= tutorials.length - 4 ? '#aaa' : '#333' }}
          >
            <ChevronRight size={14} />
          </button>

          <div className="flex-shrink-0 w-36 rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
            <div className="h-20 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5c5b5, #e8a090)' }}>
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #c97b5a, #a05030)' }} />
              </div>
            </div>
            <div className="p-2 text-center">
              <div className="text-[10px] font-semibold" style={{ color: '#333' }}>Get a <span style={{ color: '#ab00ff' }}>FREE DEMO</span> now</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold text-white transition-all"
            style={{ border: '1px solid rgba(171,0,255,0.5)', background: 'rgba(171,0,255,0.1)', color: '#ab00ff' }}
          >
            <FolderPlus size={15} />
            Add Folder
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2 rounded px-3 py-2 bg-white" style={{ border: '1px solid rgba(0,0,0,0.12)', minWidth: 200 }}>
            <Search size={14} style={{ color: '#999' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm flex-1"
              style={{ background: 'transparent', color: '#333' }}
              placeholder="Search"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => openNewProjectModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold mb-6"
          style={{ border: '1px solid rgba(0,0,0,0.2)', background: 'rgba(255,255,255,0.7)', color: '#333' }}
        >
          <Plus size={15} />
          Create Project
        </button>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-base" style={{ color: '#222' }}>My Projects</h2>
            <p className="text-xs" style={{ color: '#999' }}>Your designs are saved locally and reopen where you left off</p>
          </div>
          <select className="text-xs rounded px-3 py-1.5 outline-none" style={{ border: '1px solid rgba(0,0,0,0.12)', background: '#fff', color: '#333' }}>
            <option>My Projects</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => openNewProjectModal()}
            className="flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all group"
            style={{ background: '#fff', border: '2px dashed rgba(0,0,0,0.12)', minHeight: 180 }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all group-hover:scale-110" style={{ border: '2px solid rgba(171,0,255,0.4)', color: '#ab00ff' }}>
              <Plus size={22} />
            </div>
            <span className="text-sm font-semibold" style={{ color: '#ab00ff' }}>New Project</span>
          </button>

          {filtered.map((project, index) => (
            <Link
              key={project.id}
              to={`/editor/${project.id}`}
              state={{ projectName: project.name }}
              className="rounded-xl overflow-hidden cursor-pointer group transition-all hover:shadow-lg"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <div className="h-32 relative" style={{ background: THUMB_COLORS[index % THUMB_COLORS.length] }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <span className="text-white text-xs font-semibold px-3 py-1 rounded" style={{ background: 'rgba(171,0,255,0.8)' }}>Continue</span>
                </div>
              </div>
              <div className="p-3">
                <div className="font-semibold text-sm truncate mb-0.5" style={{ color: '#222' }}>{project.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#999' }}>{formatRelativeUpdatedAt(project.updatedAt)}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(171,0,255,0.1)', color: '#ab00ff' }}>
                    Saved
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-sm mt-2" style={{ color: '#888' }}>
            No saved projects yet. Create one to start designing — your work auto-saves as you go.
          </p>
        )}
      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-xl p-6 w-96" style={{ background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 className="font-bold text-base mb-4" style={{ color: '#222' }}>New Folder</h3>
            <input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full rounded px-3 py-2 text-sm outline-none mb-4"
              style={{ border: '1px solid rgba(0,0,0,0.15)', background: '#f9f9f9' }}
              placeholder="Folder name"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNewModal(false)} className="px-4 py-2 rounded text-sm font-medium" style={{ background: 'rgba(0,0,0,0.06)', color: '#666' }}>Cancel</button>
              <button onClick={() => setShowNewModal(false)} className="px-4 py-2 rounded text-sm font-semibold text-white" style={{ background: '#ab00ff' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
