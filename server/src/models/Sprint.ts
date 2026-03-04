export interface Sprint {
    id: string; // Local UUID
    jiraId: number;
    boardId: string;
    name: string;
    state: string; // e.g., 'active', 'closed', 'future'
    startDate?: Date;
    endDate?: Date;
    completeDate?: Date;
    goal?: string;
    projectId?: string;
}
