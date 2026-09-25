const CAMERA_INTRO_KEY = 'foodlens:camera-intro-seen';

const browserStorage = (): Storage | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

export function hasSeenCameraIntro(storage: Storage | null = browserStorage()): boolean {
  try {
    return storage?.getItem(CAMERA_INTRO_KEY) === 'true';
  } catch {
    return false;
  }
}

export function rememberCameraIntro(storage: Storage | null = browserStorage()): boolean {
  try {
    storage?.setItem(CAMERA_INTRO_KEY, 'true');
    return storage !== null;
  } catch {
    return false;
  }
}

export async function getCameraPermissionState(): Promise<PermissionState | null> {
  try {
    if (typeof navigator === 'undefined' || !navigator.permissions?.query) return null;
    const status = await navigator.permissions.query({ name: 'camera' as PermissionName });
    return status.state;
  } catch {
    // Safari and some embedded browsers do not expose camera through Permissions API.
    return null;
  }
}
