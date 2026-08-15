import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface LogEntry {
  timestamp: string;
  level: string;
  context: string;
  message: string;
}

@Injectable()
export class SystemLogsService {
  private logsDir: string;

  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
  }

  private ensureLogsDir() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  private parseLogLine(line: string): LogEntry | null {
    const match = line.match(
      /^\[([^\]]+)\]\s+\[([^\]]+)\]\s+\[([^\]]+)\]\s+(.*)$/,
    );
    if (!match) return null;
    return {
      timestamp: match[1],
      level: match[2],
      context: match[3],
      message: match[4],
    };
  }

  async getLogFiles(): Promise<{ filename: string; size: number; modified: string }[]> {
    this.ensureLogsDir();
    const files = fs.readdirSync(this.logsDir).filter((f) => f.endsWith('.log'));
    return files.map((filename) => {
      const stat = fs.statSync(path.join(this.logsDir, filename));
      return {
        filename,
        size: stat.size,
        modified: stat.mtime.toISOString(),
      };
    });
  }

  async getLogContent(
    filename: string,
    query: {
      level?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{ lines: LogEntry[]; total: number }> {
    this.ensureLogsDir();
    const filepath = path.join(this.logsDir, filename);
    if (!fs.existsSync(filepath)) {
      throw new NotFoundException(`Log file ${filename} not found`);
    }

    const content = fs.readFileSync(filepath, 'utf8');
    const allLines = content.split('\n').filter((line) => line.trim());
    const parsed = allLines
      .map((line) => this.parseLogLine(line))
      .filter((entry): entry is LogEntry => entry !== null);

    let filtered = parsed;

    if (query.level) {
      filtered = filtered.filter(
        (entry) => entry.level.toUpperCase() === query.level!.toUpperCase(),
      );
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.message.toLowerCase().includes(searchLower) ||
          entry.context.toLowerCase().includes(searchLower),
      );
    }

    if (query.startDate) {
      filtered = filtered.filter(
        (entry) => entry.timestamp >= query.startDate!,
      );
    }

    if (query.endDate) {
      filtered = filtered.filter(
        (entry) => entry.timestamp <= query.endDate!,
      );
    }

    const total = filtered.length;
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    const lines = filtered.slice(offset, offset + limit);

    return { lines, total };
  }

  async getLogStats(filename: string): Promise<{
    total: number;
    byLevel: Record<string, number>;
  }> {
    this.ensureLogsDir();
    const filepath = path.join(this.logsDir, filename);
    if (!fs.existsSync(filepath)) {
      throw new NotFoundException(`Log file ${filename} not found`);
    }

    const content = fs.readFileSync(filepath, 'utf8');
    const allLines = content.split('\n').filter((line) => line.trim());
    const parsed = allLines
      .map((line) => this.parseLogLine(line))
      .filter((entry): entry is LogEntry => entry !== null);

    const byLevel: Record<string, number> = {};
    for (const entry of parsed) {
      byLevel[entry.level] = (byLevel[entry.level] || 0) + 1;
    }

    return { total: parsed.length, byLevel };
  }
}
