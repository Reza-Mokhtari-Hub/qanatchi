export type ShareMethod = 'web-share' | 'clipboard' | 'exec-command' | 'cancelled' | 'failed';

export interface ShareOutcome {
  ok: boolean;
  method: ShareMethod;
  messageFa: string;
}

export interface ShareEnvironment {
  navigator?: {
    share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
    clipboard?: {
      writeText?: (text: string) => Promise<void>;
    };
  };
  document?: {
    createElement?: (tag: string) => HTMLTextAreaElement;
    body?: {
      appendChild: (node: Node) => Node;
      removeChild: (node: Node) => Node;
    };
    execCommand?: (commandId: string) => boolean;
  };
}

function getDefaultEnv(): ShareEnvironment {
  return {
    navigator: typeof navigator !== 'undefined' ? navigator : undefined,
    document: typeof document !== 'undefined' ? document : undefined,
  };
}

/**
 * Copy a link to the clipboard using Clipboard API with a safe execCommand fallback.
 */
export async function copyChallengeLink(
  url: string,
  env: ShareEnvironment = getDefaultEnv(),
): Promise<ShareOutcome> {
  if (env.navigator?.clipboard?.writeText) {
    try {
      await env.navigator.clipboard.writeText(url);
      return {
        ok: true,
        method: 'clipboard',
        messageFa: 'لینک رقابت با موفقیت کپی شد!',
      };
    } catch {
      // Fall through to execCommand fallback
    }
  }

  if (env.document?.createElement && env.document?.body && env.document?.execCommand) {
    try {
      const textarea = env.document.createElement('textarea');
      textarea.value = url;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      env.document.body.appendChild(textarea);
      textarea.select();
      const copied = env.document.execCommand('copy');
      env.document.body.removeChild(textarea);
      if (copied) {
        return {
          ok: true,
          method: 'exec-command',
          messageFa: 'لینک رقابت با موفقیت کپی شد!',
        };
      }
    } catch {
      // Fall through to failure outcome
    }
  }

  return {
    ok: false,
    method: 'failed',
    messageFa: 'کپی خودکار ممکن نشد؛ لینک را به صورت دستی انتخاب و کپی کنید.',
  };
}

/**
 * Share a Friend Challenge using Web Share API when available, falling back to copy-link.
 */
export async function shareChallengeLink(
  payload: { title: string; text: string; url: string },
  env: ShareEnvironment = getDefaultEnv(),
): Promise<ShareOutcome> {
  if (typeof env.navigator?.share === 'function') {
    try {
      await env.navigator.share({
        title: payload.title,
        text: payload.text,
        url: payload.url,
      });
      return {
        ok: true,
        method: 'web-share',
        messageFa: 'لینک رقابت به اشتراک گذاشته شد!',
      };
    } catch (err: unknown) {
      // If user explicitly dismissed the native share sheet, report cancelled gently
      if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
        return {
          ok: false,
          method: 'cancelled',
          messageFa: 'اشتراک‌گذاری لغو شد.',
        };
      }
      // Otherwise fall back seamlessly to copy-link
    }
  }

  return copyChallengeLink(payload.url, env);
}
