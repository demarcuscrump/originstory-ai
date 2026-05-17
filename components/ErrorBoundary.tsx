import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('originStorySave');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-900 text-white p-8 text-center border-8 border-black">
          <h1 className="text-4xl font-black mb-4 uppercase">CRITICAL FAILURE</h1>
          <p className="font-mono mb-2 text-red-200">The multiverse has collapsed.</p>
          <div className="bg-black/50 p-4 rounded mb-8 text-left font-mono text-xs overflow-auto max-w-lg max-h-32 border border-red-500">
            {this.state.error?.message}
          </div>
          <Button variant="danger" onClick={this.handleReset}>
            RESET UNIVERSE (CLEAR SAVE)
          </Button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}