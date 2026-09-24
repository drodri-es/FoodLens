import assert from 'node:assert/strict';
import test from 'node:test';
import { DetectionStabilizer } from '../src/services/scanner/DetectionStabilizer';

test('requires two matching readings before accepting a code', () => {
  const stabilizer = new DetectionStabilizer(2, 1500);
  assert.equal(stabilizer.push('3017620422003', 1000), null);
  assert.equal(stabilizer.push('3017620422003', 1200), '3017620422003');
});

test('rejects mismatched or stale consecutive readings', () => {
  const stabilizer = new DetectionStabilizer(2, 1500);
  assert.equal(stabilizer.push('11111111', 1000), null);
  assert.equal(stabilizer.push('22222222', 1100), null);
  assert.equal(stabilizer.push('22222222', 3000), null);
  assert.equal(stabilizer.push('22222222', 3100), '22222222');
});
