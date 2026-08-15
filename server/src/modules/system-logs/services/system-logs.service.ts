import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface LogEntry {
  timestamp: string;
  level: string;
  context: string;
  message: string;
  stackTrace?: string;
  rawLine: string;
  codePath?: string;
  codeLine?: number;
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

  private parseStackTrace(message: string): {
    cleanMessage: string;
    stackTrace?: string;
    codePath?: string;
    codeLine?: number;
  } {
    const stackTraceRegex = /(?:Error|Exception|at\s+).*(?:\n\s+at\s+.+)*/s;
    const match = message.match(stackTraceRegex);

    if (match) {
      const stackTrace = match[0];
      const cleanMessage = message.replace(stackTrace, '').trim();

      const fileRegex =
        /at\s+(?:(?:\S+\s+\()?(\/[^\s:]+):(\d+):\d+\)?)|(?:at\s+(\/[^\s:]+):(\d+))/;
      const fileMatch = stackTrace.match(fileRegex);
      const codePath = fileMatch?.[1] || fileMatch?.[3];
      const codeLine = fileMatch?.[2]
        ? parseInt(fileMatch[2])
        : fileMatch?.[4]
          ? parseInt(fileMatch[4])
          : undefined;

      return { cleanMessage, stackTrace, codePath, codeLine };
    }

    return { cleanMessage: message };
  }

  private parseLogLine(line: string): LogEntry | null {
    const match = line.match(
      /^\[([^\]]+)\]\s+\[([^\]]+)\]\s+\[([^\]]+)\]\s+(.*)$/,
    );
    if (!match) return null;

    const { cleanMessage, stackTrace, codePath, codeLine } =
      this.parseStackTrace(match[4]);

    return {
      timestamp: match[1],
      level: match[2],
      context: match[3],
      message: cleanMessage,
      stackTrace,
      rawLine: line,
      codePath,
      codeLine,
    };
  }

  async getLogFiles(): Promise<
    { filename: string; size: number; modified: string }[]
  > {
    this.ensureLogsDir();
    const files = fs
      .readdirSync(this.logsDir)
      .filter((f) => f.endsWith('.log'));
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
      searchField?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
      offset?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    } = {},
  ): Promise<{
    lines: LogEntry[];
    total: number;
    page: number;
    limit: number;
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

    let filtered = parsed;

    if (query.level) {
      filtered = filtered.filter(
        (entry) => entry.level.toUpperCase() === query.level!.toUpperCase(),
      );
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      if (query.searchField) {
        filtered = filtered.filter((entry) => {
          const val = entry[query.searchField as keyof LogEntry];
          return val && String(val).toLowerCase().includes(searchLower);
        });
      } else {
        filtered = filtered.filter(
          (entry) =>
            entry.message.toLowerCase().includes(searchLower) ||
            entry.context.toLowerCase().includes(searchLower),
        );
      }
    }

    if (query.startDate) {
      filtered = filtered.filter(
        (entry) => entry.timestamp >= query.startDate!,
      );
    }

    if (query.endDate) {
      filtered = filtered.filter((entry) => entry.timestamp <= query.endDate!);
    }

    if (query.sortBy) {
      filtered.sort((a, b) => {
        const valA = a[query.sortBy as keyof LogEntry] || '';
        const valB = b[query.sortBy as keyof LogEntry] || '';
        const cmp = String(valA).localeCompare(String(valB));
        return query.sortOrder === 'DESC' ? -cmp : cmp;
      });
    }

    const total = filtered.length;
    const page = query.page || 1;
    const limit = query.limit || 100;
    const offset = query.offset ?? (page - 1) * limit;
    const lines = filtered.slice(offset, offset + limit);

    return { lines, total, page, limit };
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
