declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
    googlefc?: {
      callbackQueue?: Array<(() => void) | undefined>;
      showRevocationMessage?: () => void;
    };
  }
}

export {};
