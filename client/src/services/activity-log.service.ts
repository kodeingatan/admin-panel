import api from './api';
import type { QueryActivityLog } from '@/types/activity-log';

export const activityLogService = {
  findAll(query: QueryActivityLog) {
    return api.get('/activity-logs', { params: query });
  },
  findOne(id: number) {
    return api.get(`/activity-logs/${id}`);
  },
  getStats() {
    return api.get('/activity-logs/stats');
  },
};
