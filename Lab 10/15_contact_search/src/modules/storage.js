const KEY="lab10_contacts";
export function loadContacts(fallback) {
 try { const saved=localStorage.getItem(KEY); return saved?JSON.parse(saved):fallback; } catch { return fallback; }
}
export function saveContacts(contacts) { localStorage.setItem(KEY,JSON.stringify(contacts)); }