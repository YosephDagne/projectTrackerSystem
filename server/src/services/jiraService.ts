import axios from 'axios';

const jiraBaseUrl = process.env.JIRA_BASE_URL;
const jiraEmail = process.env.JIRA_EMAIL;
const jiraToken = process.env.JIRA_TOKEN;

const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');

const jiraClient = axios.create({
    baseURL: jiraBaseUrl,
    headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export const getProjects = async () => {
    const response = await jiraClient.get('/rest/api/3/project');
    return response.data;
};

export const getProjectMetrics = async (projectKey: string) => {
    // Jira doesn't have a single "metrics" endpoint; this usually calculates from tasks.
    // In the C# project, it likely hits /search with JQL.
    const response = await jiraClient.get(`/rest/api/3/search?jql=project=${projectKey}`);
    return response.data;
};

export const getProjectTasks = async (projectKey: string) => {
    const response = await jiraClient.get(`/rest/api/3/search?jql=project=${projectKey}`);
    return response.data.issues;
};

export const getAppUsers = async () => {
    const response = await jiraClient.get('/rest/api/3/users/search');
    return response.data;
};

export const getBoards = async () => {
    const response = await jiraClient.get('/rest/agile/1.0/board');
    return response.data.values;
};

export const getSprintsForBoard = async (boardId: number) => {
    const response = await jiraClient.get(`/rest/agile/1.0/board/${boardId}/sprint`);
    return response.data.values;
};

export const getIssuesInSprint = async (sprintId: number) => {
    const response = await jiraClient.get(`/rest/agile/1.0/sprint/${sprintId}/issue`);
    return response.data.issues;
};

export const getIssueChangelog = async (issueKeyOrId: string) => {
    const response = await jiraClient.get(`/rest/api/3/issue/${issueKeyOrId}/changelog`);
    return response.data.values;
};

// --- NEW BI-DIRECTIONAL SYNC METHODS --- //
export const updateIssue = async (issueKeyOrId: string, updateData: any) => {
    const response = await jiraClient.put(`/rest/api/3/issue/${issueKeyOrId}`, updateData);
    return response.data;
};

export const transitionIssue = async (issueKeyOrId: string, transitionId: string) => {
    const response = await jiraClient.post(`/rest/api/3/issue/${issueKeyOrId}/transitions`, {
        transition: { id: transitionId }
    });
    return response.data;
};

