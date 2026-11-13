import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';

const h = vi.hoisted(() => ({ toast: vi.fn(), currentUser: { uid: 'u1', providerData: [] } as any }));
vi.mock('@/hooks/use-toast', () => ({ toast: h.toast }));
vi.mock('firebase/auth', () => ({ getAuth: () => ({ currentUser: h.currentUser }) }));

import { DATA_NOTICE_GAP_MS, FirebaseErrorListener, resetDataNoticesForTests } from './FirebaseErrorListener';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const readError = (path = 'quizAttempts') => new FirestorePermissionError({ operation: 'list', path });
const writeError = (path = 'students/s1') => new FirestorePermissionError({ operation: 'update', path, requestResourceData: { a: 1 } });
const emit = (e: FirestorePermissionError) => act(() => { errorEmitter.emit('permission-error', e); });

beforeEach(() => {
  h.toast.mockReset();
  h.currentUser = { uid: 'u1', providerData: [] };
  resetDataNoticesForTests();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-12T08:00:00Z'));
});
afterEach(() => { vi.useRealTimers(); });

describe('Database error listener — one failed read must not take the whole app down', () => {
  it('USE CASE: a list that cannot load no longer crashes the app (it used to throw to the bare error screen)', () => {
    const view = render(<><FirebaseErrorListener /><p>Dashboard is still here</p></>);

    expect(() => emit(readError())).not.toThrow();

    expect(view.getByText('Dashboard is still here')).toBeInTheDocument();
  });

  it('USE CASE: the person is told, once, that some information could not be loaded', () => {
    render(<FirebaseErrorListener />);
    emit(readError());

    expect(h.toast).toHaveBeenCalledTimes(1);
    expect(h.toast.mock.calls[0][0].title).toBe('Some information could not be loaded');
    expect(h.toast.mock.calls[0][0].variant).toBeUndefined();
  });

  it('USE CASE: a failed save is reported as a save that did not go through', () => {
    render(<FirebaseErrorListener />);
    emit(writeError());

    expect(h.toast).toHaveBeenCalledTimes(1);
    expect(h.toast.mock.calls[0][0]).toMatchObject({ variant: 'destructive', title: 'Your change was not saved' });
  });

  it('USE CASE: ten reads failing together show one notice, not ten; a later failure shows again', () => {
    render(<FirebaseErrorListener />);
    for (let i = 0; i < 10; i++) emit(readError(`collection${i}`));
    expect(h.toast).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(DATA_NOTICE_GAP_MS + 1000);
    emit(readError());
    expect(h.toast).toHaveBeenCalledTimes(2);
  });

  it('a failed save is still reported straight after a failed read', () => {
    render(<FirebaseErrorListener />);
    emit(readError());
    emit(writeError());
    expect(h.toast).toHaveBeenCalledTimes(2);
  });

  it('USE CASE: signing out (which closes every open list) shows no notice and does not crash', () => {
    render(<FirebaseErrorListener />);
    h.currentUser = null;

    expect(() => emit(readError())).not.toThrow();
    expect(h.toast).not.toHaveBeenCalled();
  });

  it('SAFETY: the app survives even if showing the notice fails', () => {
    h.toast.mockImplementation(() => { throw new Error('toast broke'); });
    render(<FirebaseErrorListener />);
    expect(() => emit(readError())).not.toThrow();
  });

  it('every failure is logged for support', () => {
    render(<FirebaseErrorListener />);
    emit(readError('quizAttempts'));
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Database read failed (list /databases/(default)/documents/quizAttempts)'),
      expect.anything()
    );
  });

  it('stops listening when it is removed from the page', () => {
    const view = render(<FirebaseErrorListener />);
    view.unmount();
    errorEmitter.emit('permission-error', readError());
    expect(h.toast).not.toHaveBeenCalled();
  });
});
