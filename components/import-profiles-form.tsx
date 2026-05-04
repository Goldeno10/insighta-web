"use client";

import { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { importProfilesCsv, type ImportProfilesResult } from "@/app/actions/profile-import";

export function ImportProfilesForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ImportProfilesResult | null>(null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      const r = await importProfilesCsv(fd);
      setResult(r);
      if (r.ok) {
        e.currentTarget.reset();
        setFileLabel(null);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="csv-file"
            className="mb-2 block text-sm font-medium text-teal-900"
          >
            CSV file
          </label>
          <div className="relative rounded-xl border border-dashed border-teal-300/90 bg-teal-50/40 px-4 py-10 text-center transition hover:border-teal-400 hover:bg-teal-50/70">
            <FileUp
              className="mx-auto mb-3 text-teal-500"
              size={36}
              aria-hidden
            />
            <input
              id="csv-file"
              name="file"
              type="file"
              accept=".csv,text/csv"
              required
              disabled={pending}
              onChange={(ev) => {
                const f = ev.target.files?.[0];
                setFileLabel(f ? f.name : null);
              }}
              className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
            <p className="text-sm font-medium text-teal-900">
              {fileLabel ?? "Drop a file here or click to browse"}
            </p>
            <p className="mt-1 text-xs text-teal-800/60">
              Multipart field name <code className="rounded bg-teal-100/80 px-1 py-0.5">file</code>{" "}
              · UTF-8 CSV with a header row
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:opacity-60 sm:w-auto"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Uploading and importing…
            </>
          ) : (
            "Run import"
          )}
        </button>
      </form>

      {result && (
        <div
          className={
            result.ok
              ? "rounded-xl border border-teal-200 bg-white p-5 shadow-sm"
              : "rounded-xl border border-red-200 bg-red-50/80 p-5 text-red-900"
          }
          role={result.ok ? "status" : "alert"}
        >
          {!result.ok ? (
            <p className="text-sm font-medium">{result.message}</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-teal-950">
                Import completed
              </p>
              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-lg bg-teal-50/80 px-3 py-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-teal-800/70">
                    Rows processed
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums text-teal-900">
                    {result.total_rows}
                  </dd>
                </div>
                <div className="rounded-lg bg-teal-50/80 px-3 py-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-teal-800/70">
                    Inserted
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums text-teal-700">
                    {result.inserted}
                  </dd>
                </div>
                <div className="rounded-lg bg-teal-50/80 px-3 py-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-teal-800/70">
                    Skipped
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums text-teal-800">
                    {result.skipped}
                  </dd>
                </div>
              </dl>
              {Object.keys(result.reasons).length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-800/70">
                    Skip reasons
                  </p>
                  <ul className="max-h-48 overflow-auto rounded-lg border border-teal-100 bg-teal-50/50 px-3 py-2 font-mono text-xs text-teal-900">
                    {Object.entries(result.reasons).map(([k, v]) => (
                      <li key={k} className="flex justify-between gap-4 py-0.5">
                        <span>{k}</span>
                        <span className="tabular-nums text-teal-700">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
