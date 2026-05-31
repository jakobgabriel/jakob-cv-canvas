import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render-time errors anywhere in the child tree and shows a friendly
 * fallback instead of an unrecoverable white screen (e.g. if resume/config
 * data fails to load or a component throws).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Surface the error for debugging / analytics without crashing the app.
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="min-h-screen flex items-center justify-center bg-gradient-hero px-4"
        >
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-2xl font-display font-medium">Something went wrong</h1>
            <p className="text-muted-foreground">
              An unexpected error occurred while loading this page. Please try reloading.
            </p>
            <Button onClick={this.handleReload}>Reload page</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
