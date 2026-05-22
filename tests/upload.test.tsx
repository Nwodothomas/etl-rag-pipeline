import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UploadForm from '@/app/upload/UploadForm';

describe('UploadForm', () => {
  it('renders the upload form controls', () => {
    render(<UploadForm />);

    expect(screen.getByLabelText(/upload file/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /upload/i })
    ).toBeInTheDocument();
  });

  it('logs the selected file name on submit', async () => {
    const user = userEvent.setup();
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<UploadForm />);

    const fileInput = screen.getByLabelText(/upload file/i);
    const file = new File(['test content'], 'report.pdf', {
      type: 'application/pdf',
    });

    await user.upload(fileInput, file);
    await user.click(screen.getByRole('button', { name: /upload/i }));

    expect(logSpy).toHaveBeenCalledWith('Uploading file:', 'report.pdf');

    logSpy.mockRestore();
  });
});
