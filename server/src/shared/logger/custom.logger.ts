import { ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export class CustomLogger extends ConsoleLogger {
  private logsDir: string;

  constructor() {
    super();
    this.logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  private writeToFile(level: string, message: string, context?: string) {
    const date = new Date();
    const filename = `${date.toISOString().split('T')[0]}.log`;
    const filepath = path.join(this.logsDir, filename);
    const timestamp = date.toISOString();
    const logEntry = `[${timestamp}] [${level}] [${context || 'Application'}] ${message}\n`;
    fs.appendFileSync(filepath, logEntry, 'utf8');
  }

  log(message: string, context?: string) {
    super.log(message, context);
    this.writeToFile('INFO', message, context);
  }

  error(message: string, stack?: string, context?: string) {
    super.error(message, stack, context);
    this.writeToFile('ERROR', `${message} ${stack || ''}`, context);
  }

  warn(message: string, context?: string) {
    super.warn(message, context);
    this.writeToFile('WARN', message, context);
  }

  debug(message: string, context?: string) {
    super.debug(message, context);
    this.writeToFile('DEBUG', message, context);
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context);
    this.writeToFile('TRACE', message, context);
  }
}
