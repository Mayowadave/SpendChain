import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 text-center animate-fade-in">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                An Unexpected Error Occurred
              </h2>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                SpendChain encountered a temporary component error. Your wallet state and data remain completely safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 text-left font-mono text-[11px] text-rose-300 max-h-32 overflow-y-auto">
                <span className="font-bold text-rose-400 block mb-1">Error Details:</span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs font-mono transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white font-bold text-xs font-mono transition-colors flex items-center space-x-2 cursor-pointer border border-white/10"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
