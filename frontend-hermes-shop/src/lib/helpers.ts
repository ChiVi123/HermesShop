import { fetchClient } from './fetchClient';

const baseUrl = process.env.SERVER_API ?? '';

export const apiClient = fetchClient(baseUrl);
