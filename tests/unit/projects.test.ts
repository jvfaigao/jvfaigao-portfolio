import { describe, expect, it } from 'vitest';
import { groupProjects } from '../../src/lib/groupProjects';

const entry = (id: string, group: 'production' | 'other', order: number) => ({ id, data: { group, order } });

describe('groupProjects', () => {
  it('splits by group and sorts each by order', () => {
    const { production, other } = groupProjects([
      entry('thesis-payroll', 'other', 7),
      entry('marami-cafe', 'production', 2),
      entry('faceattend', 'other', 5),
      entry('ja1-church', 'production', 1),
    ]);
    expect(production.map((p) => p.id)).toEqual(['ja1-church', 'marami-cafe']);
    expect(other.map((p) => p.id)).toEqual(['faceattend', 'thesis-payroll']);
  });

  it('does not mutate the input', () => {
    const input = [entry('b', 'other', 2), entry('a', 'other', 1)];
    groupProjects(input);
    expect(input.map((p) => p.id)).toEqual(['b', 'a']);
  });
});
