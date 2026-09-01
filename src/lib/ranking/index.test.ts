import { calculateRanking, RankingPlayer } from './index';

describe('calculateRanking', () => {
  it('ranks higher completion count first', () => {
    const players: RankingPlayer[] = [
      { id: '1', name: 'A', completedCount: 3, startedAt: '2026-09-01T10:00:00Z', completedAt: null, lastSubmittedAt: '2026-09-01T10:05:00Z' },
      { id: '2', name: 'B', completedCount: 5, startedAt: '2026-09-01T10:00:00Z', completedAt: '2026-09-01T10:10:00Z', lastSubmittedAt: '2026-09-01T10:10:00Z' },
    ];
    const ranked = calculateRanking(players);
    expect(ranked[0].id).toBe('2');
  });

  it('ranks two finished players by total time (fastest first)', () => {
    const players: RankingPlayer[] = [
      { id: '1', name: 'A', completedCount: 5, startedAt: '2026-09-01T10:00:00Z', completedAt: '2026-09-01T10:15:00Z', lastSubmittedAt: '2026-09-01T10:15:00Z' }, // 15 mins
      { id: '2', name: 'B', completedCount: 5, startedAt: '2026-09-01T10:00:00Z', completedAt: '2026-09-01T10:10:00Z', lastSubmittedAt: '2026-09-01T10:10:00Z' }, // 10 mins
    ];
    const ranked = calculateRanking(players);
    expect(ranked[0].id).toBe('2');
  });

  it('ranks partial completion ties by earliest time to reach current count', () => {
    const players: RankingPlayer[] = [
      { id: '1', name: 'A', completedCount: 4, startedAt: '2026-09-01T10:00:00Z', completedAt: null, lastSubmittedAt: '2026-09-01T10:15:00Z' }, // 15 mins
      { id: '2', name: 'B', completedCount: 4, startedAt: '2026-09-01T10:05:00Z', completedAt: null, lastSubmittedAt: '2026-09-01T10:10:00Z' }, // 5 mins
    ];
    const ranked = calculateRanking(players);
    expect(ranked[0].id).toBe('2');
  });

  it('handles zero completed missions gracefully', () => {
    const players: RankingPlayer[] = [
      { id: '1', name: 'A', completedCount: 0, startedAt: '2026-09-01T10:00:00Z', completedAt: null, lastSubmittedAt: null },
      { id: '2', name: 'B', completedCount: 1, startedAt: '2026-09-01T10:00:00Z', completedAt: null, lastSubmittedAt: '2026-09-01T10:05:00Z' },
    ];
    const ranked = calculateRanking(players);
    expect(ranked[0].id).toBe('2');
    expect(ranked[1].id).toBe('1');
  });
});
