import { HealthLevel } from '../types/enums.js';

export interface ProjectMetrics {
    totalTasks: number;
    completedTasks: number;
    activeBlockers: number;
    storyPointsTotal: number;
    storyPointsCompleted: number;
    recentUpdates: number;
}

export const calculateHealth = (metrics: ProjectMetrics) => {
    let score = 100;

    // Deduction for blockers
    score -= metrics.activeBlockers * 10;

    // Deduction for low progress
    const completionPercentage = metrics.totalTasks > 0 ? (metrics.completedTasks / metrics.totalTasks) * 100 : 0;
    if (completionPercentage < 20) score -= 20;
    else if (completionPercentage < 50) score -= 10;

    let level = HealthLevel.Good;
    let status = 'On Track';

    if (score < 40) {
        level = HealthLevel.Critical;
        status = 'At Risk';
    } else if (score < 70) {
        level = HealthLevel.Fair;
        status = 'Needs Attention';
    }

    return { level, score: Math.max(0, score), status };
};
