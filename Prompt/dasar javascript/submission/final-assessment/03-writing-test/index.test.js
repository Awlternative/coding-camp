import { sum } from './index.js';
import { equal } from 'node:assert';
import test from 'node:test';

test('sum function', (t) => {
  equal(sum(1, 2), 3, '1 + 2 should equal 3');
  equal(sum(-1, 2), 1, '-1 + 2 should equal 1');
  equal(sum(1, -2), -1, '1 + -2 should equal -1');
  equal(sum(0, 0), 0, '0 + 0 should equal 0');
  equal(sum(2, 3), 5, '2 + 3 should equal 5');
});