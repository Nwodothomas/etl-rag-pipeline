'use client';

import React, { useMemo, useState } from 'react';

import Loader from '@/components/Loader';
import StatusBadge from '@/components/StatusBadge';
import { createUpload } from '@/lib/apiClient';
import type { KnowledgeAsset, UploadRequest, UploadSourceType } from '@/lib/types';
import {
  getAcceptedFileTypes,
  validateFileUpload,
  validateUrlUpload,
} from '@/lib/upload';

type SubmissionState =
  | 'idle'
  | 'validating'
  | 'uploading'
  | 'ready'
  | 'success'
  | 'error';

type UploadFormProps = {
  onUploadComplete?: (asset: KnowledgeAsset) => void;
};

export default function UploadForm({ onUploadComplete }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [sourceType, setSourceType] = useState<UploadSourceType>('file');
  const [urlValue, setUrlValue] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [preparedRequest, setPreparedRequest] = useState<UploadRequest | null>(null);
  const [uploadedAsset, setUploadedAsset] = useState<KnowledgeAsset | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const inputId = 'upload-file';
  const urlId = 'upload-url';

  const helperText = useMemo(() => {
    if (sourceType === 'file') {
      return 'Supported types: PDF, DOC, DOCX, XLS, XLSX, TXT, and common video formats up to 50 MB.';
    }

    return 'Provide a public http or https URL. URL scraping and backend normalization will be added in later stages.';
  }, [sourceType]);

  const resetFeedback = () => {
    setErrors([]);
    setPreparedRequest(null);
    setUploadedAsset(null);
    setSuccessMessage('');
    setSubmissionState('idle');
  };

  const handleSourceTypeChange = (nextSourceType: UploadSourceType) => {
    setSourceType(nextSourceType);
    resetFeedback();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    resetFeedback();
    setSubmissionState('validating');

    await new Promise((resolve) => {
      setTimeout(resolve, 150);
    });

    const validationResult =
      sourceType === 'file' ? validateFileUpload(file) : validateUrlUpload(urlValue);

    if (!validationResult.valid || !validationResult.request) {
      setErrors(validationResult.errors);
      setSubmissionState('error');
      return;
    }

    setPreparedRequest(validationResult.request);
    setSubmissionState('uploading');

    try {
      const response =
        sourceType === 'file'
          ? await createUpload(buildFileFormData(validationResult.request, file))
          : await createUpload(validationResult.request);

      setUploadedAsset(response.asset);
      setSuccessMessage(response.message);
      setSubmissionState('success');
      onUploadComplete?.(response.asset);
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : 'Upload request failed unexpectedly.',
      ]);
      setSubmissionState('error');
    }
  };

  const buildFileFormData = (
    request: UploadRequest,
    selectedFile: File | null
  ) => {
    if (!selectedFile) {
      throw new Error('A file is required before sending the upload request.');
    }

    const formData = new FormData();
    formData.set('sourceType', request.sourceType);
    formData.set('assetType', request.assetType);
    formData.set('file', selectedFile);

    return formData;
  };

  const selectedSourceSummary =
    sourceType === 'file'
      ? file?.name ?? 'No file selected yet'
      : urlValue.trim() || 'No URL entered yet';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-950">Upload source</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Stage 2 adds source selection, client-side validation, and prepared
          request details before we connect the form to the real upload API.
        </p>
      </div>

      <div className="mb-5">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Source mode
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            aria-pressed={sourceType === 'file'}
            onClick={() => handleSourceTypeChange('file')}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              sourceType === 'file'
                ? 'border-sky-700 bg-sky-50 text-sky-900'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="block font-semibold">File source</span>
            <span className="mt-1 block text-sm text-inherit">
              Local files for bucket upload.
            </span>
          </button>
          <button
            type="button"
            aria-pressed={sourceType === 'url'}
            onClick={() => handleSourceTypeChange('url')}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              sourceType === 'url'
                ? 'border-sky-700 bg-sky-50 text-sky-900'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="block font-semibold">URL source</span>
            <span className="mt-1 block text-sm text-inherit">
              Web content to ingest later through the backend.
            </span>
          </button>
        </div>
      </div>

      {sourceType === 'file' ? (
        <div key="file-mode">
          <label htmlFor={inputId} className="mb-2 block font-semibold">
            Upload file
          </label>
          <input
            id={inputId}
            type="file"
            accept={getAcceptedFileTypes()}
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              resetFeedback();
            }}
            className="mb-3 block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600"
          />
        </div>
      ) : (
        <div key="url-mode">
          <label htmlFor={urlId} className="mb-2 block font-semibold">
            Source URL
          </label>
          <input
            id={urlId}
            type="url"
            placeholder="https://example.com/knowledge/article"
            value={urlValue}
            onChange={(e) => {
              setUrlValue(e.target.value);
              resetFeedback();
            }}
            className="mb-3 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500"
          />
        </div>
      )}

      <div className="mb-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Source snapshot</p>
        <p className="mt-2 break-all">{selectedSourceSummary}</p>
        <p className="mt-3">{helperText}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={
            submissionState === 'validating' || submissionState === 'uploading'
          }
          className="rounded-full bg-sky-700 px-4 py-2 text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-sky-400"
        >
          Validate and upload
        </button>
        {submissionState === 'validating' ? (
          <Loader label="Validating source..." />
        ) : null}
        {submissionState === 'uploading' ? (
          <Loader label="Sending request to upload API..." />
        ) : null}
        {submissionState === 'ready' ? <StatusBadge status="queued" /> : null}
        {submissionState === 'success' && uploadedAsset ? (
          <StatusBadge status={uploadedAsset.status} />
        ) : null}
      </div>

      {errors.length > 0 ? (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <p className="font-semibold">The upload payload needs attention.</p>
          <ul className="mt-2 list-disc pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {preparedRequest ? (
        <section
          aria-label="Prepared upload summary"
          className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
        >
          <p className="font-semibold">
            {submissionState === 'success'
              ? 'Upload contract sent successfully'
              : 'Ready for API submission'}
          </p>
          <p className="mt-2 leading-6">
            {submissionState === 'success'
              ? successMessage
              : 'The source has passed UI validation and a typed request has been prepared for the upload API.'}
          </p>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <dt className="font-medium">Source type</dt>
              <dd className="mt-1">{preparedRequest.sourceType}</dd>
            </div>
            <div>
              <dt className="font-medium">Asset type</dt>
              <dd className="mt-1">{preparedRequest.assetType}</dd>
            </div>
            {preparedRequest.fileName ? (
              <div>
                <dt className="font-medium">File name</dt>
                <dd className="mt-1 break-all">{preparedRequest.fileName}</dd>
              </div>
            ) : null}
            {preparedRequest.sourceUrl ? (
              <div className="md:col-span-2">
                <dt className="font-medium">Source URL</dt>
                <dd className="mt-1 break-all">{preparedRequest.sourceUrl}</dd>
              </div>
            ) : null}
            {typeof preparedRequest.sizeBytes === 'number' ? (
              <div>
                <dt className="font-medium">Size (bytes)</dt>
                <dd className="mt-1">{preparedRequest.sizeBytes}</dd>
              </div>
            ) : null}
            {preparedRequest.mimeType ? (
              <div>
                <dt className="font-medium">Mime type</dt>
                <dd className="mt-1">{preparedRequest.mimeType}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {uploadedAsset ? (
        <section className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
          <p className="font-semibold">Upload result</p>
          <dl className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <dt className="font-medium">Asset ID</dt>
              <dd className="mt-1 break-all">{uploadedAsset.id}</dd>
            </div>
            <div>
              <dt className="font-medium">Stored status</dt>
              <dd className="mt-1">{uploadedAsset.status}</dd>
            </div>
            {uploadedAsset.bucketName ? (
              <div>
                <dt className="font-medium">Bucket</dt>
                <dd className="mt-1">{uploadedAsset.bucketName}</dd>
              </div>
            ) : null}
            {uploadedAsset.bucketPath ? (
              <div className="md:col-span-2">
                <dt className="font-medium">Bucket path</dt>
                <dd className="mt-1 break-all">{uploadedAsset.bucketPath}</dd>
              </div>
            ) : null}
            {uploadedAsset.sourceUrl ? (
              <div className="md:col-span-2">
                <dt className="font-medium">Registered URL</dt>
                <dd className="mt-1 break-all">{uploadedAsset.sourceUrl}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}
    </form>
  );
}
