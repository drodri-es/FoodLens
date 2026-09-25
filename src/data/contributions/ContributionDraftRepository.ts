export type ContributionPhotoKind = 'front' | 'ingredients' | 'nutrition';

export interface ContributionDraftPhoto {
  kind: ContributionPhotoKind;
  blob: Blob;
  fileName: string;
  mimeType: string;
}

export interface ContributionDraft {
  barcode: string;
  name: string;
  brand: string;
  photos: ContributionDraftPhoto[];
  updatedAt: string;
}

const DATABASE_NAME = 'foodlens-contributions';
const DATABASE_VERSION = 1;
const STORE_NAME = 'drafts';

const openDatabase = (): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  if (typeof indexedDB === 'undefined') {
    reject(new Error('IndexedDB no está disponible.'));
    return;
  }

  const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains(STORE_NAME)) {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'barcode' });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error ?? new Error('No se pudo abrir el almacenamiento de borradores.'));
});

const runRequest = <T>(request: IDBRequest<T>): Promise<T> => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error ?? new Error('No se pudo completar la operación.'));
});

export async function saveContributionDraft(draft: ContributionDraft): Promise<void> {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    await runRequest(transaction.objectStore(STORE_NAME).put(draft));
  } finally {
    database.close();
  }
}

export async function getContributionDraft(barcode: string): Promise<ContributionDraft | null> {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    return (await runRequest(transaction.objectStore(STORE_NAME).get(barcode))) ?? null;
  } finally {
    database.close();
  }
}
