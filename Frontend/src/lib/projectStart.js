export const PROJECT_START_MODES = {
  BLANK: 'blank',
  TEMPLATE: 'template',
  UPLOAD: 'upload',
};

export function pendingBackgroundKey(projectSlug) {
  return `bp3d_pending_bg_${projectSlug}`;
}

export function backgroundPlanStorageKey(projectId) {
  return `bp3d_bg_${projectId || 'default'}`;
}

export function readPendingBackgroundPlan(projectSlug) {
  const key = pendingBackgroundKey(projectSlug);
  const value = window.sessionStorage.getItem(key);
  if (value) {
    window.sessionStorage.removeItem(key);
  }
  return value;
}

export function loadStoredBackgroundPlan(projectId) {
  try {
    const raw = window.localStorage.getItem(backgroundPlanStorageKey(projectId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveBackgroundPlan(projectId, plan) {
  if (!plan?.src) {
    window.localStorage.removeItem(backgroundPlanStorageKey(projectId));
    return;
  }
  window.localStorage.setItem(backgroundPlanStorageKey(projectId), JSON.stringify(plan));
}

export function slugifyProjectName(projectName) {
  return String(projectName).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'new-design';
}
