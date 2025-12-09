/**
 * Environment-based logging utility
 * Only logs in development mode unless explicitly enabled in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true';

export const logger = {
  /**
   * Debug-level logging - only in development or when DEBUG is enabled
   */
  debug: (...args: any[]) => {
    if (isDevelopment || isDebugEnabled) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Info-level logging - only in development or when DEBUG is enabled
   */
  info: (...args: any[]) => {
    if (isDevelopment || isDebugEnabled) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Warning-level logging - always logged
   */
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },

  /**
   * Error-level logging - always logged
   */
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};
