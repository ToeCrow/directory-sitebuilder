export function DatabaseUnavailable({ message }: { message: string }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Could not load from the database
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        The page ran on Vercel, but the server could not query Postgres. This
        is not a browser-to-backend call — the Next.js server is the client.
      </p>
      <pre className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800">
        {message}
      </pre>
    </main>
  );
}
