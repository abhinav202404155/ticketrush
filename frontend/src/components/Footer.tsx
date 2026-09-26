export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white">
              🎟️
            </span>
            TicketRush
          </div>
          <p className="text-center text-xs text-slate-500 sm:text-right">
            A student major project — autoscaling microservices ticket booking platform.
            <br className="hidden sm:block" />
            Built with React, Node.js, PostgreSQL, Redis &amp; Kubernetes.
          </p>
        </div>
      </div>
    </footer>
  );
}
