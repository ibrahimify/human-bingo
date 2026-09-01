export interface RankingPlayer {
  id: string;
  name: string;
  completedCount: number;
  startedAt: string;
  completedAt: string | null;
  lastSubmittedAt: string | null;
}

export function calculateRanking(players: RankingPlayer[]): RankingPlayer[] {
  return [...players].sort((a, b) => {
    // 1. Highest number of completed missions
    if (a.completedCount !== b.completedCount) {
      return b.completedCount - a.completedCount;
    }

    // 2. If both finished all 5, calculate total time
    if (a.completedCount === 5 && a.completedAt && b.completedAt) {
      const timeA = new Date(a.completedAt).getTime() - new Date(a.startedAt).getTime();
      const timeB = new Date(b.completedAt).getTime() - new Date(b.startedAt).getTime();
      return timeA - timeB; // Lowest time wins
    }

    // 3. Partial completion (or timeout tie): Earliest timestamp to reach current count
    const timeToLastA = a.lastSubmittedAt 
      ? new Date(a.lastSubmittedAt).getTime() - new Date(a.startedAt).getTime() 
      : Infinity;
    const timeToLastB = b.lastSubmittedAt 
      ? new Date(b.lastSubmittedAt).getTime() - new Date(b.startedAt).getTime() 
      : Infinity;

    return timeToLastA - timeToLastB;
  });
}
