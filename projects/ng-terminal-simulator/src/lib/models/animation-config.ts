/**
 * Configuration for typing animation behavior
 * Groups all timing-related parameters for cleaner API
 */

export interface AnimationConfig {
  enableAnimations: boolean;
  typingMinMs: number;
  typingMaxMs: number;
  linePauseMs: number;
  initialDelayMs: number;
  cursorBlinkMs: number;
}

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  enableAnimations: true,
  typingMinMs: 50,
  typingMaxMs: 80,
  linePauseMs: 300,
  initialDelayMs: 1000,
  cursorBlinkMs: 500,
};
