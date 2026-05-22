import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as apiClient from '@/lib/apiClient';
import UploadForm from '@/app/upload/UploadForm';

describe('UploadForm', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the upload form controls', () => {
    render(<UploadForm />);

    expect(screen.getByRole('button', { name: /file source/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /url source/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/upload file/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /validate and upload/i })
    ).toBeInTheDocument();
  });

  it('shows a validation error when no file is selected', async () => {
    const user = userEvent.setup();

    render(<UploadForm />);

    await user.click(screen.getByRole('button', { name: /validate and upload/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /select a file before preparing the upload payload/i
    );
  });

  it('uploads a valid file request through the API client', async () => {
    const user = userEvent.setup();
    const createUploadSpy = jest
      .spyOn(apiClient, 'createUpload')
      .mockResolvedValue({
        message: 'File uploaded to Supabase storage.',
        asset: {
          id: 'asset-file-1',
          name: 'report.pdf',
          assetType: 'pdf',
          sourceType: 'file',
          status: 'uploaded',
          uploadedAt: '2026-05-22T10:00:00.000Z',
          sizeBytes: 12,
          mimeType: 'application/pdf',
          bucketName: 'knowledge-base',
          bucketPath: '2026-05-22/asset-file-1-report.pdf',
        },
      });

    render(<UploadForm />);

    const fileInput = screen.getByLabelText(/upload file/i);
    const file = new File(['test content'], 'report.pdf', {
      type: 'application/pdf',
    });

    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /validate and upload/i }));

    const summary = await screen.findByRole('region', {
      name: /prepared upload summary/i,
    });

    expect(createUploadSpy).toHaveBeenCalledTimes(1);
    expect(within(summary).getByText(/upload contract sent successfully/i)).toBeInTheDocument();
    expect(within(summary).getByText(/report\.pdf/i)).toBeInTheDocument();
    expect(within(summary).getByText(/^pdf$/i)).toBeInTheDocument();
    expect(screen.getByText(/file uploaded to supabase storage/i)).toBeInTheDocument();
    expect(screen.getByText(/knowledge-base/i)).toBeInTheDocument();
  });

  it('switches to url mode and sends a url request', async () => {
    const user = userEvent.setup();
    const createUploadSpy = jest
      .spyOn(apiClient, 'createUpload')
      .mockResolvedValue({
        message: 'URL source registered for later ingestion.',
        asset: {
          id: 'asset-url-1',
          name: 'https://example.com/knowledge/article',
          assetType: 'url',
          sourceType: 'url',
          status: 'queued',
          uploadedAt: '2026-05-22T10:05:00.000Z',
          sourceUrl: 'https://example.com/knowledge/article',
        },
      });

    render(<UploadForm />);

    await user.click(screen.getByRole('button', { name: /url source/i }));
    await user.type(
      screen.getByLabelText(/source url/i),
      'https://example.com/knowledge/article'
    );
    await user.click(screen.getByRole('button', { name: /validate and upload/i }));

    const summary = await screen.findByRole('region', {
      name: /prepared upload summary/i,
    });

    expect(createUploadSpy).toHaveBeenCalledWith({
      sourceType: 'url',
      assetType: 'url',
      sourceUrl: 'https://example.com/knowledge/article',
    });
    expect(within(summary).getByText(/upload contract sent successfully/i)).toBeInTheDocument();
    expect(
      within(summary).getByText('https://example.com/knowledge/article')
    ).toBeInTheDocument();
    expect(within(summary).getAllByText(/^url$/i)).toHaveLength(2);
  });
});
