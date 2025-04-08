declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var logging: (message?: any, ...optionalParams: any[]) => void;
}
const RESET = '\x1b[0m';

const FG_BRIGHT_YELLOW = '\x1b[93m';
const FG_BRIGHT_CYAN = '\x1b[96m';

globalThis.logging = console.log.bind(
  undefined,
  `${FG_BRIGHT_YELLOW}[${new Date().toLocaleString()}]${RESET}`,
  `${FG_BRIGHT_CYAN}[SERVER-LOG]:${RESET}`,
);
