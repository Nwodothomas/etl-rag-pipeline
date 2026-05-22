'use client';

import React, { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const inputId = 'upload-file';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      console.log('Uploading file:', file.name);
      // TODO: call backend API
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-950">Upload source</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Stage 1 keeps the existing local file flow simple. Stage 2 will add
          URL mode, richer validation, and API submission states.
        </p>
      </div>
      <label htmlFor={inputId} className="mb-2 block font-semibold">
        Upload File
      </label>
      <input
        id={inputId}
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-3 block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600"
      />
      <p className="mb-4 text-sm text-slate-500">
        Supported pipeline targets will include documents, spreadsheets, text,
        video, and URLs.
      </p>
      <button
        type="submit"
        className="rounded-full bg-sky-700 px-4 py-2 text-white transition hover:bg-sky-800"
      >
        Upload
      </button>
    </form>
  );
}
