import { format } from "util";
import _ from "lodash";
import winston from "winston";
import chalk from "chalk";

/** Enable/disable all logging */
let logEnabled = true;

/**
 * Logger
 */
export class WinstonService {
  static GLOBAL_META_DATA: { [key: string]: any };

  static LEVEL_COLOR_MAP: { [key: string]: string } = {
    error: chalk.red("ERROR"),
    warn: chalk.yellow("WARN"),
    info: chalk.whiteBright("INFO"),
    debug: chalk.white("DEBUG"),
    silly: chalk.white("DEBUG"),
  };

  /**
   * Instantiates a new logger
   *
   * @param tag - Logger tag, e.g. the name of the current JavaScript file.
   *   For convenience, paths such as `__filename` will automatically be truncated
   *   to the file name only.
   * @param meta - Logger meta, e.g. the if of the vessel currently logging
   *
   * @example
   * const logger = Logger.create(__filename);
   *
   */
  static create(): WinstonService {
    return new WinstonService();
  }

  /** Returns `true` if running in a CI environment */
  static get isCI(): boolean {
    const env = process.env;
    // Shamelessly stolen from https://github.com/watson/ci-info
    return !!(
      env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
      env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
      env.BUILD_NUMBER || // Jenkins, TeamCity
      env.RUN_ID || // TaskCluster, dsari
      false
    );
  }

  /** Retruns `true` if running as part of a unit test */
  static get isUnitTest(): boolean {
    const env = process.env;
    return !!(env.JEST_WORKER_ID || _.isFunction((global as any).it));
  }

  /** Retruns `true` if `--silent` is passed on command line, e.g. when executed via an `npm` script */
  static get isSilent(): boolean {
    return _.includes(process.argv, "--silent");
  }

  /** Enable or disable logging globally, e.g. when running as part of a continuous integration environment */
  static set logEnabled(value: boolean) {
    logEnabled = value;
  }

  static get logEnabled(): boolean {
    return logEnabled;
  }

  /**
   * Set Global Meta Data for Logger
   * @param meta meta data
   */
  static setGlobalMeta(meta: { [key: string]: any }): void {
    WinstonService.GLOBAL_META_DATA = _.omitBy(meta, _.isNil);
  }

  /** Winston instance */
  winston: winston.Logger;
  /** Metadata passed with each log line */
  meta: {
    tag?: string;
    module?: string;
    instance?: string;
    container?: string;
  };

  constructor() {
    if (WinstonService.isCI || WinstonService.isSilent) {
      // Never log anything in CI mode or when explicitly asked to be quiet
      logEnabled = false;
    }

    const logConsoleFormat = winston.format.printf((info: any) => {
      /**
       *
       * TODO: Use chalk to format, color the output message
       */
      // Simple JSON output
      return format("%j", info);
    });

    console.log("process.env.LOG_LEVEL ", process.env.LOG_LEVEL);
    this.winston = winston.createLogger({
      level: process.env.LOG_LEVEL
        ? process.env.LOG_LEVEL
        : process.env.NODE_ENV === "production"
        ? "info"
        : "debug",
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            logConsoleFormat
          ),
        }),
      ],
    });
  }

  silly(message: string, payload?: { [key: string]: any }): WinstonService {
    return this._log("silly", message, payload);
  }

  debug(message: string, payload?: { [key: string]: any }): WinstonService {
    return this._log("debug", message, payload);
  }

  info(message: string, payload?: { [key: string]: any }): WinstonService {
    return this._log("info", message, payload);
  }

  warn(message: string, payload?: { [key: string]: any }): WinstonService {
    return this._log("warn", message, payload);
  }

  error(
    message: Error | string,
    payload?: Error | { [key: string]: any }
  ): WinstonService {
    return this._log("error", JSON.stringify(message), payload);
  }

  private _log(
    level: string,
    message: string,
    payload?: { [key: string]: any }
  ): WinstonService {
    logEnabled &&
      this.winston.log(level, message, {
        ...WinstonService.GLOBAL_META_DATA,
        ...this.meta,
        payload,
      });
    return this;
  }
}

export default WinstonService.create();
