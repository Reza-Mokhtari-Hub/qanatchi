import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Top-level RTL Persian Error Boundary to prevent blank white screens if an
 * unexpected runtime error or unsupported browser quirk occurs.
 * Preserves saved LocalStorage progress and provides one-click reload recovery.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Intentionally omit telemetry/external error reporting to preserve zero-tracking policy
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          role="alert"
          data-testid="app-error-boundary"
          className="min-h-dvh w-full bg-[#14110E] text-[#F5ECD7] flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full rounded-2xl bg-[#1D1712] border border-[#5A4530] p-6 text-center shadow-2xl">
            <h1 className="text-xl font-bold text-[#F2CA70]">خطای غیرمنتظره در اجرای بازی</h1>
            <p className="mt-3 text-sm text-[#D7C6AA] leading-relaxed">
              پیشرفت ذخیره‌شده شما در مرورگر محفوظ است. برای ادامه بازی، صفحه را دوباره بارگذاری کنید.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-5 min-h-[48px] px-6 rounded-xl bg-[#E6B34B] hover:bg-[#F0C160] text-[#1A140D] font-bold text-sm transition-colors cursor-pointer"
            >
              بارگذاری مجدد بازی
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
