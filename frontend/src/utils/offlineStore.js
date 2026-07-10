import localforage from "localforage";

const offlineQueue = localforage.createInstance({ name: "kurai-theerkum", storeName: "offline_complaints" });

export async function saveOfflineComplaint(complaint) {
  await offlineQueue.setItem(complaint.number, { ...complaint, queuedAt: new Date().toISOString() });
}

export async function getOfflineComplaints() {
  const complaints = [];
  await offlineQueue.iterate((value) => complaints.push(value));
  return complaints;
}

export async function removeOfflineComplaint(number) {
  await offlineQueue.removeItem(number);
}