import { Injectable } from '@angular/core';

/**
 * Configuration for text wrapping metrics
 * Controls how text is wrapped to fit terminal width
 */
export interface TextWrapperConfig {
  charWidthRatio: number; // Usually 0.6 for monospace fonts
  lineHeightRatio: number; // Usually 1.2
}

/**
 * Service responsible for text wrapping and line splitting
 * Follows Single Responsibility Principle - text layout only
 * Decouples text handling from component logic
 */
@Injectable({
  providedIn: 'root',
})
export class TextWrapperService {
  private readonly DEFAULT_CONFIG: TextWrapperConfig = {
    charWidthRatio: 0.6,
    lineHeightRatio: 1.2,
  };

  constructor() {}

  /**
   * Splits text into lines that fit within terminal width
   * Respects word boundaries and accounts for prompt width
   *
   * @param textContent - Raw text to wrap
   * @param terminalWidth - Available width in pixels
   * @param fontSize - Font size in pixels
   * @param promptLength - Character count of prompt (subtracted from available width)
   * @param config - Optional wrapper configuration
   * @returns Array of text lines that fit within terminal
   */
  splitText(
    textContent: string,
    terminalWidth: number,
    fontSize: number,
    promptLength: number,
    config: Partial<TextWrapperConfig> = {}
  ): string[] {
    const mergedConfig = { ...this.DEFAULT_CONFIG, ...config };
    const cols = Math.floor(terminalWidth / (fontSize * mergedConfig.charWidthRatio));
    const contentCols = Math.max(1, cols - promptLength);

    const paragraphs = textContent.split(/\r?\n/);
    const result: string[] = [];

    for (const paragraph of paragraphs) {
      const words = paragraph.trim().split(/\s+/).filter(Boolean);
      let lineContent = '';

      for (const word of words) {
        const candidate = lineContent ? `${lineContent} ${word}` : word;

        if (candidate.length > contentCols) {
          // Word doesn't fit - push current line and start new one
          if (lineContent) {
            result.push(lineContent);
          }
          lineContent = word;
        } else {
          lineContent = candidate;
        }
      }

      if (lineContent) {
        result.push(lineContent);
      }
    }

    return result;
  }

  /**
   * Calculates terminal dimensions in characters
   * @param width - Width in pixels
   * @param height - Height in pixels
   * @param fontSize - Font size in pixels
   * @param config - Optional wrapper configuration
   * @returns Object with cols and rows
   */
  calculateDimensions(
    width: number,
    height: number,
    fontSize: number,
    config: Partial<TextWrapperConfig> = {}
  ): { cols: number; rows: number } {
    const mergedConfig = { ...this.DEFAULT_CONFIG, ...config };
    const cols = Math.floor(width / (fontSize * mergedConfig.charWidthRatio));
    const rows = Math.floor(height / (fontSize * mergedConfig.lineHeightRatio));
    return { cols, rows };
  }

  /**
   * Formats dimension string like "80x24"
   * @param width - Width in pixels
   * @param height - Height in pixels
   * @param fontSize - Font size in pixels
   * @param config - Optional wrapper configuration
   * @returns String in format "COLSxROWS"
   */
  formatDimensions(
    width: number,
    height: number,
    fontSize: number,
    config: Partial<TextWrapperConfig> = {}
  ): string {
    const { cols, rows } = this.calculateDimensions(width, height, fontSize, config);
    return `${cols}x${rows}`;
  }
}
