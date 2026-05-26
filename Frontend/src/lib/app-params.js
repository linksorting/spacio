const isBrowser = typeof window !== 'undefined';

const createMemoryStorage = () => {
	const memoryMap = new Map();
	return {
		getItem: (key) => memoryMap.has(key) ? memoryMap.get(key) : null,
		setItem: (key, value) => memoryMap.set(key, value),
		removeItem: (key) => memoryMap.delete(key)
	};
};

const storage = isBrowser ? window.localStorage : createMemoryStorage();
const storagePrefix = 'designer_pro';
const accessTokenStorageKey = `${storagePrefix}_access_token`;

const toSnakeCase = (str) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

const hasValue = (value) => value !== undefined && value !== null && value !== '';

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
	if (!isBrowser) {
		return defaultValue;
	}
	const storageKey = `${storagePrefix}_${toSnakeCase(paramName)}`;
	const urlParams = new URLSearchParams(window.location.search);
	const searchParam = urlParams.get(paramName);
	if (removeFromUrl) {
		urlParams.delete(paramName);
		const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
			}${window.location.hash}`;
		window.history.replaceState({}, document.title, newUrl);
	}
	if (hasValue(searchParam)) {
		storage.setItem(storageKey, searchParam);
		return searchParam;
	}
	const storedValue = storage.getItem(storageKey);
	if (hasValue(storedValue)) {
		return storedValue;
	}
	if (hasValue(defaultValue)) {
		storage.setItem(storageKey, defaultValue);
		return defaultValue;
	}
	return null;
};

const getAppParams = () => {
	if (getAppParamValue("clear_access_token") === 'true') {
		storage.removeItem(accessTokenStorageKey);
		storage.removeItem('token');
	}
	return {
		appId: getAppParamValue("app_id", { defaultValue: import.meta.env.VITE_APP_ID || 'designer-pro-local' }),
		token: getAppParamValue("access_token", { removeFromUrl: true }),
		fromUrl: getAppParamValue("from_url", { defaultValue: isBrowser ? window.location.href : '' }),
		functionsVersion: getAppParamValue("functions_version", { defaultValue: import.meta.env.VITE_FUNCTIONS_VERSION }),
		appBaseUrl: getAppParamValue("app_base_url", { defaultValue: import.meta.env.VITE_API_BASE_URL }),
	};
};


export const appParams = {
	...getAppParams(),
	storageKeys: {
		accessToken: accessTokenStorageKey
	}
};
