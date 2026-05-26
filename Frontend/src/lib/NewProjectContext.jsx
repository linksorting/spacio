import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, LayoutTemplate, Square, Upload, X } from 'lucide-react';
import { PROJECT_START_TEMPLATES } from '@/lib/catalogData';
import { setActiveProjectName } from '@/lib/project-session';
import {
  PROJECT_START_MODES,
  pendingBackgroundKey,
  slugifyProjectName,
} from '@/lib/projectStart';

const NewProjectContext = createContext(null);

const START_OPTIONS = [
  {
    id: PROJECT_START_MODES.BLANK,
    title: 'Start from scratch',
    description: 'Open a blank canvas and draw your own floor plan.',
    icon: Square,
  },
  {
    id: PROJECT_START_MODES.TEMPLATE,
    title: 'Start with a template',
    description: 'Pick a furnished room layout and customize it.',
    icon: LayoutTemplate,
  },
  {
    id: PROJECT_START_MODES.UPLOAD,
    title: 'Upload a 2D plan',
    description: 'Trace over your own PNG, JPG, or PDF floor plan image.',
    icon: Upload,
  },
];

export function NewProjectProvider({ children }) {
  const navigate = useNavigate();
  const uploadInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [startMode, setStartMode] = useState(PROJECT_START_MODES.BLANK);
  const [selectedTemplateId, setSelectedTemplateId] = useState(PROJECT_START_TEMPLATES[0]?.id ?? '');
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const resetModal = () => {
    setProjectName('');
    setStartMode(PROJECT_START_MODES.BLANK);
    setSelectedTemplateId(PROJECT_START_TEMPLATES[0]?.id ?? '');
    setUploadPreview(null);
    setUploadFileName('');
    setErrorMessage('');
  };

  const closeNewProjectModal = () => {
    setIsOpen(false);
    resetModal();
  };

  const openNewProjectModal = (defaultValue = '') => {
    const fallbackName = defaultValue.trim() || `Untitled ${new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    resetModal();
    setProjectName(fallbackName);
    setIsOpen(true);
  };

  const handleUploadChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result);
      setUploadFileName(file.name);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleCreateProject = (event) => {
    event.preventDefault();

    const trimmedName = projectName.trim();
    if (!trimmedName) {
      setErrorMessage('Project name is required before continuing.');
      return;
    }

    if (startMode === PROJECT_START_MODES.TEMPLATE && !selectedTemplateId) {
      setErrorMessage('Choose a template to continue.');
      return;
    }

    if (startMode === PROJECT_START_MODES.UPLOAD && !uploadPreview) {
      setErrorMessage('Upload a floor plan image to continue.');
      return;
    }

    const slug = slugifyProjectName(trimmedName);

    if (startMode === PROJECT_START_MODES.UPLOAD && uploadPreview) {
      window.sessionStorage.setItem(pendingBackgroundKey(slug), JSON.stringify({
        src: uploadPreview,
        name: uploadFileName || 'Uploaded plan',
        uploadedAt: new Date().toISOString(),
      }));
    }

    setActiveProjectName(trimmedName);
    closeNewProjectModal();
    navigate(`/editor/${slug}`, {
      state: {
        projectName: trimmedName,
        isNewProject: true,
        startMode,
        templateId: startMode === PROJECT_START_MODES.TEMPLATE ? selectedTemplateId : undefined,
      },
    });
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeNewProjectModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <NewProjectContext.Provider value={{ openNewProjectModal, closeNewProjectModal }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8" style={{ background: 'rgba(8, 6, 11, 0.55)' }}>
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between px-6 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(171, 0, 255, 0.10)' }}>
                  <FolderPlus size={20} style={{ color: '#ab00ff' }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Create New Project</h2>
                  <p className="text-sm text-slate-500">Choose how you want to begin, then open the editor.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeNewProjectModal}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={16} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="px-6 pb-6 pt-5 space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">How would you like to start?</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {START_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const active = startMode === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setStartMode(option.id);
                          setErrorMessage('');
                        }}
                        className={`rounded-2xl border p-4 text-left transition ${active ? 'border-fuchsia-500 bg-fuchsia-50/70 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                      >
                        <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${active ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-white text-slate-600'}`}>
                          <Icon size={18} />
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{option.title}</div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {startMode === PROJECT_START_MODES.TEMPLATE && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Choose a template</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-72 overflow-y-auto pr-1">
                    {PROJECT_START_TEMPLATES.map((template) => {
                      const active = selectedTemplateId === template.id;
                      return (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => {
                            setSelectedTemplateId(template.id);
                            setErrorMessage('');
                          }}
                          className={`overflow-hidden rounded-2xl border text-left transition ${active ? 'border-fuchsia-500 ring-2 ring-fuchsia-200' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <div className="aspect-[4/3] bg-slate-100">
                            <img
                              src={template.thumbnail}
                              alt=""
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.src = '/inspiration/imported-floorplan.svg';
                              }}
                            />
                          </div>
                          <div className="p-3">
                            <div className="text-sm font-semibold text-slate-900">{template.name}</div>
                            <div className="text-xs text-slate-500">{template.category} · {template.style}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {startMode === PROJECT_START_MODES.UPLOAD && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Upload your floor plan</p>
                  <input
                    ref={uploadInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                    className="hidden"
                    onChange={handleUploadChange}
                  />
                  <button
                    type="button"
                    onClick={() => uploadInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition hover:border-fuchsia-400 hover:bg-fuchsia-50/40"
                  >
                    {uploadPreview ? (
                      <>
                        <img src={uploadPreview} alt="" className="mb-3 max-h-40 rounded-xl object-contain" />
                        <span className="text-sm font-medium text-slate-800">{uploadFileName}</span>
                        <span className="mt-1 text-xs text-slate-500">Click to replace image</span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="mb-3 text-slate-400" />
                        <span className="text-sm font-medium text-slate-800">Drop or browse for a plan image</span>
                        <span className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP, or PDF</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div>
                <label htmlFor="project-name" className="block text-sm font-medium text-slate-700 mb-2">
                  Project name
                </label>
                <input
                  id="project-name"
                  value={projectName}
                  onChange={(event) => {
                    setProjectName(event.target.value);
                    if (errorMessage) {
                      setErrorMessage('');
                    }
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-fuchsia-500 focus:bg-white"
                  placeholder="Example: Willow Creek Living Room"
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeNewProjectModal}
                  className="rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #ab00ff 0%, #d946ef 100%)', boxShadow: '0 12px 30px rgba(171, 0, 255, 0.22)' }}
                >
                  Open in SPACIO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </NewProjectContext.Provider>
  );
}

export function useNewProject() {
  const context = useContext(NewProjectContext);

  if (!context) {
    throw new Error('useNewProject must be used within a NewProjectProvider');
  }

  return context;
}
