export interface LogEntry {
  timestamp: string;
  level: string;
  context: string;
  message: string;
}

export interface SystemLogFile {
  filename: string;
  size: number;
  modified: string;
}

export interface QuerySystemLog {
  level?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface SystemLogStats {
  total: number;
  byLevel: Record<string, number>;
}
