import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div className="flex h-full items-center justify-center text-stone-400 text-sm p-8 text-center">
          <div>
            <p className="mb-2 font-semibold text-stone-300">Something went wrong</p>
            <p className="text-xs text-stone-500">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="mt-4 rounded-lg bg-fuchsia-600 px-4 py-2 text-xs font-medium text-white"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
