import React, { ReactNode } from 'react';
import { AlertCircleIcon } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error(`Error in ${this.props.name || 'component'}:`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center w-full h-full p-4 bg-destructive/10 border border-destructive rounded-lg">
            <div className="text-center">
              <AlertCircleIcon className="w-8 h-8 text-destructive mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">
                Error in {this.props.name || 'component'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
