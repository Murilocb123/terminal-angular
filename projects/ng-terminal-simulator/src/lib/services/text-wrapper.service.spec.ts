import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TextWrapperService } from './text-wrapper.service';

describe('TextWrapperService', () => {
  let service: TextWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextWrapperService],
    });
    service = TestBed.inject(TextWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('splitText', () => {
    it('should split text into lines based on width', () => {
      const text = 'This is a long line of text';
      const terminalWidth = 600;
      const fontSize = 14;
      const promptLength = 5;

      const result = service.splitText(text, terminalWidth, fontSize, promptLength);
      expect(result.length).toBeGreaterThan(0);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty text', () => {
      const result = service.splitText('', 600, 14, 5);
      expect(result).toEqual([]);
    });

    it('should handle short text', () => {
      const result = service.splitText('hi', 600, 14, 5);
      expect(result).toEqual(['hi']);
    });

    it('should respect prompt length', () => {
      const text = 'abcdefghij';
      const terminalWidth = 200;
      const fontSize = 14;
      const promptLength = 10;

      const result = service.splitText(text, terminalWidth, fontSize, promptLength);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle multiple paragraphs', () => {
      const text = 'Line 1\nLine 2\nLine 3';
      const result = service.splitText(text, 600, 14, 5);
      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it('should handle CRLF line breaks', () => {
      const text = 'Line 1\r\nLine 2\r\nLine 3';
      const result = service.splitText(text, 600, 14, 5);
      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it('should trim whitespace from paragraphs', () => {
      const text = '  trimmed text  ';
      const result = service.splitText(text, 600, 14, 5);
      expect(result[0]).toBe('trimmed text');
    });

    it('should handle word wrapping', () => {
      const text = 'this is a test of word wrapping functionality';
      const terminalWidth = 100;
      const fontSize = 14;
      const promptLength = 2;

      const result = service.splitText(text, terminalWidth, fontSize, promptLength);
      expect(result.length).toBeGreaterThan(1);
    });

    it('should handle very long words', () => {
      const text = 'supercalifragilisticexpialidocious';
      const result = service.splitText(text, 600, 14, 5);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should merge lines within content columns', () => {
      const text = 'a b c d e';
      const terminalWidth = 1000;
      const fontSize = 14;
      const promptLength = 0;

      const result = service.splitText(text, terminalWidth, fontSize, promptLength);
      expect(result[0]).toBe('a b c d e');
    });

    it('should use custom config when provided', () => {
      const text = 'test text';
      const result1 = service.splitText(text, 600, 14, 5);
      const result2 = service.splitText(text, 600, 14, 5, { charWidthRatio: 0.5 });
      expect(Array.isArray(result1)).toBe(true);
      expect(Array.isArray(result2)).toBe(true);
    });

    it('should handle text with extra spaces', () => {
      const text = 'word1    word2    word3';
      const result = service.splitText(text, 600, 14, 5);
      expect(result[0]).not.toContain('    ');
    });

    it('should ensure contentCols is at least 1', () => {
      const text = 'test';
      const result = service.splitText(text, 10, 100, 100);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('calculateDimensions', () => {
    it('should calculate cols and rows', () => {
      const result = service.calculateDimensions(600, 400, 14);
      expect(result.cols).toBeGreaterThan(0);
      expect(result.rows).toBeGreaterThan(0);
    });

    it('should return object with cols and rows properties', () => {
      const result = service.calculateDimensions(600, 400, 14);
      expect(result).toHaveProperty('cols');
      expect(result).toHaveProperty('rows');
    });

    it('should calculate based on charWidthRatio', () => {
      const result1 = service.calculateDimensions(600, 400, 14);
      const result2 = service.calculateDimensions(600, 400, 14, { charWidthRatio: 0.5 });
      expect(result2.cols).toBeGreaterThan(result1.cols);
    });

    it('should calculate based on lineHeightRatio', () => {
      const result1 = service.calculateDimensions(600, 400, 14);
      const result2 = service.calculateDimensions(600, 400, 14, { lineHeightRatio: 1.0 });
      expect(result2.rows).toBeGreaterThan(result1.rows);
    });

    it('should handle small dimensions', () => {
      const result = service.calculateDimensions(100, 100, 14);
      expect(result.cols).toBeGreaterThan(0);
      expect(result.rows).toBeGreaterThan(0);
    });

    it('should handle large dimensions', () => {
      const result = service.calculateDimensions(2000, 1440, 14);
      expect(result.cols).toBeGreaterThan(100);
      expect(result.rows).toBeGreaterThan(50);
    });

    it('should use custom config', () => {
      const defaultResult = service.calculateDimensions(600, 400, 14);
      const customResult = service.calculateDimensions(600, 400, 14, {
        charWidthRatio: 1.0,
        lineHeightRatio: 2.0,
      });
      expect(customResult.cols).toBeLessThan(defaultResult.cols);
      expect(customResult.rows).toBeLessThan(defaultResult.rows);
    });
  });

  describe('formatDimensions', () => {
    it('should return string in COLSxROWS format', () => {
      const result = service.formatDimensions(600, 400, 14);
      expect(result).toMatch(/\d+x\d+/);
    });

    it('should contain x character', () => {
      const result = service.formatDimensions(600, 400, 14);
      expect(result).toContain('x');
    });

    it('should return correct values', () => {
      const result = service.formatDimensions(600, 400, 14);
      const [cols, rows] = result.split('x').map(Number);
      expect(cols).toBeGreaterThan(0);
      expect(rows).toBeGreaterThan(0);
    });

    it('should handle standard terminal size', () => {
      const result = service.formatDimensions(600, 400, 14);
      expect(typeof result).toBe('string');
    });

    it('should use custom config', () => {
      const defaultResult = service.formatDimensions(600, 400, 14);
      const customResult = service.formatDimensions(600, 400, 14, { charWidthRatio: 0.5 });
      const [defaultCols] = defaultResult.split('x').map(Number);
      const [customCols] = customResult.split('x').map(Number);
      expect(customCols).toBeGreaterThan(defaultCols);
    });
  });

  describe('integration tests', () => {
    it('should handle realistic terminal dimensions', () => {
      const width = 800;
      const height = 600;
      const fontSize = 18;
      const promptLength = 10;

      const dims = service.calculateDimensions(width, height, fontSize);
      const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      const lines = service.splitText(text, width, fontSize, promptLength);

      expect(dims.cols).toBeGreaterThan(0);
      expect(dims.rows).toBeGreaterThan(0);
      expect(lines.length).toBeGreaterThan(0);
    });

    it('should handle edge case with very small terminal', () => {
      const width = 100;
      const height = 100;
      const fontSize = 14;
      const promptLength = 5;

      const dims = service.calculateDimensions(width, height, fontSize);
      const lines = service.splitText('test text', width, fontSize, promptLength);

      expect(dims.cols).toBeGreaterThan(0);
      expect(dims.rows).toBeGreaterThan(0);
      expect(lines.length).toBeGreaterThan(0);
    });

    it('should format dimensions consistently', () => {
      const dims = service.calculateDimensions(600, 400, 14);
      const formatted = service.formatDimensions(600, 400, 14);
      const [cols, rows] = formatted.split('x').map(Number);

      expect(cols).toBe(dims.cols);
      expect(rows).toBe(dims.rows);
    });
  });
});
