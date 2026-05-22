import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as apiClient from '@/lib/apiClient';
import IngestionWorkspace from '@/app/ingest/IngestionWorkspace';

describe('IngestionWorkspace', () => {
  beforeEach(() => {
    jest.spyOn(global, 'setInterval').mockImplementation(() => 1 as unknown as NodeJS.Timeout);
    jest.spyOn(global, 'clearInterval').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders uploaded assets and existing ingestion logs', async () => {
    jest.spyOn(apiClient, 'fetchUploadHistory').mockResolvedValue({
      message: 'Upload history loaded from Supabase storage.',
      assets: [
        {
          id: 'asset-1',
          name: 'report.pdf',
          assetType: 'pdf',
          sourceType: 'file',
          status: 'uploaded',
          uploadedAt: '2026-05-22T10:00:00.000Z',
          bucketPath: '2026-05-22/report.pdf',
          bucketName: 'knowledge-base',
        },
      ],
    });
    jest.spyOn(apiClient, 'fetchIngestionHistory').mockResolvedValue({
      message: 'Ingestion jobs loaded from the ingestion API.',
      jobs: [
        {
          id: 'job-1',
          assetId: 'asset-1',
          assetName: 'report.pdf',
          assetType: 'pdf',
          sourceType: 'file',
          status: 'completed',
          startedAt: '2026-05-22T10:05:00.000Z',
          completedAt: '2026-05-22T10:06:00.000Z',
          message: 'Asset handed off for parsing and chunk preparation.',
        },
      ],
    });

    render(<IngestionWorkspace />);

    expect((await screen.findAllByText(/report\.pdf/i)).length).toBeGreaterThan(0);
    const logsSection = screen.getByText(/ingestion logs/i).closest('section');
    expect(logsSection).not.toBeNull();
    expect(
      await within(logsSection as HTMLElement).findByText(/asset handed off for parsing/i)
    ).toBeInTheDocument();
  });

  it('triggers ingestion for an uploaded asset', async () => {
    const user = userEvent.setup();

    jest.spyOn(apiClient, 'fetchUploadHistory').mockResolvedValue({
      message: 'Upload history loaded from Supabase storage.',
      assets: [
        {
          id: 'asset-1',
          name: 'report.pdf',
          assetType: 'pdf',
          sourceType: 'file',
          status: 'uploaded',
          uploadedAt: '2026-05-22T10:00:00.000Z',
          bucketPath: '2026-05-22/report.pdf',
          bucketName: 'knowledge-base',
        },
      ],
    });
    const fetchJobsSpy = jest
      .spyOn(apiClient, 'fetchIngestionHistory')
      .mockResolvedValueOnce({
        message: 'Ingestion jobs loaded from the ingestion API.',
        jobs: [],
      })
      .mockResolvedValueOnce({
        message: 'Ingestion jobs loaded from the ingestion API.',
        jobs: [
          {
            id: 'job-1',
            assetId: 'asset-1',
            assetName: 'report.pdf',
            assetType: 'pdf',
            sourceType: 'file',
            status: 'processing',
            startedAt: '2026-05-22T10:05:00.000Z',
            bucketPath: '2026-05-22/report.pdf',
            message:
              'Asset accepted by the ingestion API and queued for backend handoff.',
          },
        ],
      });
    const triggerSpy = jest.spyOn(apiClient, 'triggerIngestion').mockResolvedValue({
      message: 'Ingestion job created.',
      job: {
        id: 'job-1',
        assetId: 'asset-1',
        assetName: 'report.pdf',
        assetType: 'pdf',
        sourceType: 'file',
        status: 'processing',
        startedAt: '2026-05-22T10:05:00.000Z',
        bucketPath: '2026-05-22/report.pdf',
        message: 'Asset accepted by the ingestion API and queued for backend handoff.',
      },
    });

    render(<IngestionWorkspace />);

    const triggerButton = await screen.findByRole('button', {
      name: /trigger ingestion/i,
    });
    await user.click(triggerButton);

    expect(triggerSpy).toHaveBeenCalledWith({
      assetId: 'asset-1',
      assetName: 'report.pdf',
      assetType: 'pdf',
      sourceType: 'file',
      bucketPath: '2026-05-22/report.pdf',
      sourceUrl: undefined,
    });

    const logsSection = screen.getByText(/ingestion logs/i).closest('section');
    expect(logsSection).not.toBeNull();
    expect(
      await within(logsSection as HTMLElement).findByText(/queued for backend handoff/i)
    ).toBeInTheDocument();
    expect(fetchJobsSpy).toHaveBeenCalled();
  });
});
