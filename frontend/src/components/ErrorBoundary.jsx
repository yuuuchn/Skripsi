import { Component } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-bg)]">
          <div className="card p-10 md:p-12 text-center max-w-md border-slate-200/60 shadow-lg animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="font-display text-xl font-extrabold text-[var(--color-text)] mb-2 tracking-tight">
              Terjadi Kesalahan
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-6 leading-relaxed">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan muat ulang halaman atau kembali ke beranda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary font-bold py-3 rounded-xl shadow-md shadow-indigo-500/10"
              >
                <RefreshCw className="w-4.5 h-4.5 text-white" />
                Muat Ulang
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="btn btn-ghost font-bold py-3 rounded-xl"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
                Beranda
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
