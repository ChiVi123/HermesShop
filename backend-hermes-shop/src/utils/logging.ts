const LOG_STYLES = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  // Foreground (text) colors
  foreground: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m',
  },
  // Background colors
  background: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m',
  },
} as const;

console.log = console.log.bind(
  undefined,
  `${LOG_STYLES.foreground.yellow}[${new Date().toLocaleString()}]${LOG_STYLES.reset}`,
  `${LOG_STYLES.foreground.cyan}[SERVER-LOG]:${LOG_STYLES.reset}`,
);
console.error = console.error.bind(
  undefined,
  `${LOG_STYLES.foreground.yellow}[${new Date().toLocaleString()}]${LOG_STYLES.reset}`,
  `${LOG_STYLES.foreground.red}[SERVER-ERROR]:${LOG_STYLES.reset}`,
);
