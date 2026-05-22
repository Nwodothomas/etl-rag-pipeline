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
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <label htmlFor={inputId} className="block mb-2 font-semibold">
        Upload File
      </label>
      <input
        id={inputId}
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload
      </button>
    </form>
  );
}
