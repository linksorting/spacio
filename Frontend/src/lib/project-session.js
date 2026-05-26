const ACTIVE_PROJECT_STORAGE_KEY = 'designer_pro_active_project_name';

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

export const getActiveProjectName = () => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  return storage.getItem(ACTIVE_PROJECT_STORAGE_KEY);
};

export const setActiveProjectName = (projectName) => {
  const storage = getStorage();
  const trimmedName = projectName?.trim();

  if (!storage || !trimmedName) {
    return;
  }

  storage.setItem(ACTIVE_PROJECT_STORAGE_KEY, trimmedName);
};

export const clearActiveProjectName = () => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(ACTIVE_PROJECT_STORAGE_KEY);
};

export const activeProjectStorageKey = ACTIVE_PROJECT_STORAGE_KEY;
