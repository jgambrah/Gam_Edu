import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const h = vi.hoisted(() => ({ reloadAppFresh: vi.fn() }));
vi.mock('@/lib/app-recovery', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/app-recovery')>()),
  reloadAppFresh: h.reloadAppFresh,
}));

import { AppCrashScreen } from './app-crash-screen';

beforeEach(() => {
  h.reloadAppFresh.mockReset();
  h.reloadAppFresh.mockResolvedValue(undefined);
  window.sessionStorage.clear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('App crash screen — what the person sees on their phone', () => {
  it('USE CASE: shows real, clearly labelled buttons to reload and to try again', () => {
    render(<AppCrashScreen error={new Error('Boom')} reset={() => {}} />);

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    const reload = screen.getByRole('button', { name: 'Reload app' });
    const retry = screen.getByRole('button', { name: 'Try again' });

    // Styled inline (the app stylesheet may be gone), with a visible fill/border and a finger-sized height.
    expect(reload).toHaveStyle({ background: '#4f46e5', color: '#ffffff', minHeight: '52px' });
    expect(retry).toHaveStyle({ border: '2px solid #c7d2fe', minHeight: '52px' });
  });

  it('USE CASE: "Reload app" reloads the app and shows that it is working', async () => {
    const user = userEvent.setup();
    render(<AppCrashScreen error={new Error('Boom')} reset={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Reload app' }));

    expect(h.reloadAppFresh).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Reloading…' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  });

  it('USE CASE: "Try again" retries the page without reloading', async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<AppCrashScreen error={new Error('Boom')} reset={reset} />);

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(reset).toHaveBeenCalledTimes(1);
    expect(h.reloadAppFresh).not.toHaveBeenCalled();
  });

  it('USE CASE: tells the person what to do if it keeps happening, and shows details for support', () => {
    render(<AppCrashScreen error={Object.assign(new TypeError('x is not a function'), { digest: 'd-42' })} reset={() => {}} />);

    expect(screen.getByText(/close the app fully and open it again/i)).toBeInTheDocument();
    expect(screen.getByTestId('crash-details')).toHaveTextContent('Details for support: TypeError: x is not a function • Ref d-42');
  });

  it('USE CASE: a phone running an old version reloads by itself, once', async () => {
    const stale = Object.assign(new Error('Loading chunk 8839 failed.'), { name: 'ChunkLoadError' });
    const first = render(<AppCrashScreen error={stale} reset={() => {}} />);

    await waitFor(() => expect(h.reloadAppFresh).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('heading', { name: 'Getting the latest version…' })).toBeInTheDocument();
    first.unmount();

    // It failed again straight after the reload: do not loop, show the buttons instead.
    render(<AppCrashScreen error={stale} reset={() => {}} />);
    expect(screen.getByRole('button', { name: 'Reload app' })).toBeEnabled();
    expect(h.reloadAppFresh).toHaveBeenCalledTimes(1);
  });

  it('an ordinary error never reloads by itself', () => {
    render(<AppCrashScreen error={new Error('Missing or insufficient permissions')} reset={() => {}} />);
    expect(h.reloadAppFresh).not.toHaveBeenCalled();
  });
});
