const ADMIN_STORAGE_KEY = "caterer_admin_key";

export function getStoredAdminKey() {
  return localStorage.getItem(ADMIN_STORAGE_KEY) || "";
}

export function saveAdminKey(value) {
  localStorage.setItem(ADMIN_STORAGE_KEY, value);
}

export function clearAdminKey() {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}
