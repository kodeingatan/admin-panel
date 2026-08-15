import api from './api';
import type { QuerySystemLog } from '@/types/system-log';

export const systemLogService = {
  getFiles() {
    return api.get('/system-logs/files');
  },
  getContent(filename: string, query: QuerySystemLog) {
    return api.get(`/system-logs/files/${filename}`, { params: query });
  },
  getStats(filename: string) {
    return api.get(`/system-logs/stats/${filename}`);
  },
};
