import { isEmptyBlueprintDesign, storageKeyForProject } from './blueprintStarterRoom';

const REGISTRY_KEY = 'designer_pro_projects';

function getStorage() {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function readRegistry() {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const parsed = JSON.parse(storage.getItem(REGISTRY_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRegistry(projects) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(REGISTRY_KEY, JSON.stringify(projects));
}

export function formatProjectSlug(slug = '') {
  return String(slug)
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function listProjects() {
  return readRegistry()
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getProject(projectId) {
  return readRegistry().find((entry) => entry.id === projectId) ?? null;
}

export function getProjectName(projectId) {
  return getProject(projectId)?.name ?? null;
}

/**
 * Register or refresh a project in the local index.
 */
export function upsertProject({ id, name, touch = true }) {
  if (!id) return null;

  const trimmedName = name?.trim();
  const now = new Date().toISOString();
  const projects = readRegistry();
  const index = projects.findIndex((entry) => entry.id === id);

  if (index >= 0) {
    projects[index] = {
      ...projects[index],
      name: trimmedName || projects[index].name,
      updatedAt: touch ? now : projects[index].updatedAt,
    };
    writeRegistry(projects);
    return projects[index];
  }

  const created = {
    id,
    name: trimmedName || formatProjectSlug(id),
    createdAt: now,
    updatedAt: now,
  };
  writeRegistry([created, ...projects]);
  return created;
}

export function removeProject(projectId) {
  const storage = getStorage();
  if (!storage || !projectId) return;

  writeRegistry(readRegistry().filter((entry) => entry.id !== projectId));
  storage.removeItem(storageKeyForProject(projectId));
}

export function uniqueProjectId(projectName) {
  const base = String(projectName)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'new-design';

  const existing = new Set(readRegistry().map((entry) => entry.id));
  if (!existing.has(base)) return base;

  let suffix = 2;
  while (existing.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}

/** Pull older saves into the project list if they were created before the registry existed. */
export function migrateProjectsFromStorage() {
  const storage = getStorage();
  if (!storage) return;

  const knownIds = new Set(readRegistry().map((entry) => entry.id));

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key?.startsWith('bp3d_v2_')) continue;

    const id = key.slice('bp3d_v2_'.length);
    if (!id || knownIds.has(id)) continue;

    const raw = storage.getItem(key);
    if (!raw || isEmptyBlueprintDesign(raw)) continue;

    let name = formatProjectSlug(id);
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.designerProjectName) {
        name = parsed.designerProjectName;
      }
    } catch {
      // keep slug-derived fallback
    }

    upsertProject({ id, name, touch: false });
    knownIds.add(id);
  }
}

export function formatRelativeUpdatedAt(isoDate) {
  if (!isoDate) return 'Recently';

  const updated = new Date(isoDate);
  if (Number.isNaN(updated.getTime())) return 'Recently';

  const diffMs = Date.now() - updated.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  return updated.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
