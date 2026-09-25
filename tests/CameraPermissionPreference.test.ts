import assert from 'node:assert/strict';
import test from 'node:test';
import { hasSeenCameraIntro, rememberCameraIntro } from '../src/services/scanner/CameraPermissionPreference';
import { MemoryStorage } from './helpers';

test('remembers the FoodLens camera introduction across application launches', () => {
  const storage = new MemoryStorage();

  assert.equal(hasSeenCameraIntro(storage), false);
  assert.equal(rememberCameraIntro(storage), true);
  assert.equal(hasSeenCameraIntro(storage), true);
});

test('falls back safely when camera preference storage is unavailable', () => {
  assert.equal(hasSeenCameraIntro(null), false);
  assert.equal(rememberCameraIntro(null), false);
});
