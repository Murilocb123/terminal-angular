/**
 * Unified terminal styling configuration
 * Supports both Mac and Windows terminal themes with type-safe CSS properties
 */

export type StyleProperties = Record<string, string>;

export interface PromptStyleConfig {
  username?: StyleProperties;
  hostname?: StyleProperties;
  promptSymbol?: StyleProperties;
  at?: StyleProperties;
  tilde?: StyleProperties;
  ps?: StyleProperties;
  path?: StyleProperties;
}

export interface TerminalStyleConfig {
  content?: StyleProperties;
  linePrompt?: PromptStyleConfig;
}

/**
 * Theme variants for terminal appearance
 */
export type TerminalTheme = 'light' | 'dark';

/**
 * Platform-specific terminal types
 */
export type TerminalPlatform = 'mac' | 'windows';
