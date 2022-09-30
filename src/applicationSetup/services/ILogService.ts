export enum LogType {
  Info,
  Error,
  Warning,
}

export interface ILogService {
  log(logType: LogType, message: any): void;
  info(message: any): void;
  error(message: any): void;
  warn(message: any): void;
}
