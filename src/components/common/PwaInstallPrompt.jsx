import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, MoreVertical, Share, Smartphone, X } from 'lucide-react';
import { matchPath, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DISMISSAL_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;
const DISMISSAL_STORAGE_PREFIX = 'pwa-install-dismissed:';

function getAuthenticatedUserKey(user) {
  const id = user?._id || user?.id || user?.email;
  return id ? String(id) : null;
}

function isIosDevice() {
  const { userAgent, platform, maxTouchPoints } = window.navigator;
  return /iPad|iPhone|iPod/i.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1);
}

function isStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isProtectedRoute(routes, pathname) {
  const route = routes.find(({ path }) => matchPath({ path, end: true }, pathname));
  if (!route) return false;
  const usesRoleShorthand = route.auth && route.auth !== 'guest' && route.auth !== 'required';
  return route.auth === 'required' || usesRoleShorthand || Boolean(route.roles?.length);
}

function readDismissal(userKey) {
  if (!userKey) return false;
  try {
    const dismissedUntil = Number(localStorage.getItem(`${DISMISSAL_STORAGE_PREFIX}${encodeURIComponent(userKey)}`));
    return dismissedUntil > Date.now();
  } catch {
    return false;
  }
}

function storeDismissal(userKey) {
  if (!userKey) return;
  try {
    localStorage.setItem(
      `${DISMISSAL_STORAGE_PREFIX}${encodeURIComponent(userKey)}`,
      String(Date.now() + DISMISSAL_PERIOD_MS)
    );
  } catch {
    // The in-memory guard below still prevents repeated prompts this session.
  }
}

export default function PwaInstallPrompt({ installPrompt, appInstalled, onInstallPromptConsumed, routes }) {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const [mode, setMode] = useState(null);
  const [dialogUserKey, setDialogUserKey] = useState(null);
  const [busy, setBusy] = useState(false);
  const [iosDevice, setIosDevice] = useState(false);
  const actionRef = useRef(null);
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);
  const handledUsersRef = useRef(new Set());
  const userKey = getAuthenticatedUserKey(user);
  const eligible = Boolean(user && !loading && !appInstalled && userKey && isProtectedRoute(routes, pathname));

  const closeDialog = useCallback(({ dismiss = false } = {}) => {
    if (dismiss) storeDismissal(userKey);
    handledUsersRef.current.add(userKey);
    setMode(null);
  }, [userKey]);

  useEffect(() => {
    if (!eligible || mode || handledUsersRef.current.has(userKey) || isStandalone()) return undefined;
    if (readDismissal(userKey)) return undefined;

    let isIos = false;
    try {
      isIos = isIosDevice();
    } catch {
      // If platform detection is unavailable, the generic browser guidance remains safe.
    }
    setIosDevice(isIos);

    const timeoutId = window.setTimeout(() => {
      previousFocusRef.current = document.activeElement;
      handledUsersRef.current.add(userKey);
      setDialogUserKey(userKey);
      setMode('prompt');
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [eligible, installPrompt, mode, userKey]);

  useEffect(() => {
    if (mode && (!eligible || dialogUserKey !== userKey)) {
      setMode(null);
      setBusy(false);
    }
  }, [dialogUserKey, eligible, mode, userKey]);

  useEffect(() => {
    if (!mode) return undefined;
    actionRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) closeDialog({ dismiss: true });
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button:not([disabled])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!dialogRef.current?.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current instanceof HTMLElement) previousFocusRef.current.focus();
    };
    // closeDialog is intentionally stable for the lifetime of an open dialog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, busy, userKey, closeDialog]);

  function showInstructions() {
    handledUsersRef.current.add(userKey);
    setMode('instructions');
  }

  async function handlePrimaryAction() {
    if (mode === 'instructions') {
      closeDialog();
      return;
    }

    if (!installPrompt) {
      showInstructions();
      return;
    }

    setBusy(true);
    try {
      const promptEvent = installPrompt;
      onInstallPromptConsumed();
      await promptEvent.prompt();
      await promptEvent.userChoice;
      closeDialog();
    } catch {
      onInstallPromptConsumed();
      showInstructions();
    } finally {
      setBusy(false);
    }
  }

  if (!mode || !eligible || dialogUserKey !== userKey || typeof document === 'undefined') return null;

  const instructions = iosDevice
    ? [
        { icon: Share, text: 'اضغط على زر المشاركة في Safari.' },
        { icon: Smartphone, text: 'اختر «إضافة إلى الشاشة الرئيسية».' },
        { icon: Download, text: 'اضغط «إضافة» للتأكيد.' },
      ]
    : [
        { icon: MoreVertical, text: 'افتح قائمة المتصفح (⋮ أو ⋯).' },
        { icon: Smartphone, text: 'اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».' },
        { icon: Download, text: 'اتبع رسالة التأكيد التي يعرضها المتصفح.' },
      ];

  return createPortal(
    <div className="fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-slate-950/45 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]" dir="rtl">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-install-title"
        aria-describedby="pwa-install-description"
        className="relative my-auto w-full max-w-md rounded-3xl border border-surface-border bg-surface-default p-6 text-ink-900 shadow-2xl dark:border-white/10 dark:bg-[#0c1c30] dark:text-white sm:p-7"
      >
        <button
          type="button"
          aria-label="إغلاق نافذة تثبيت التطبيق"
          disabled={busy}
          onClick={() => closeDialog({ dismiss: true })}
          className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-500 transition hover:bg-surface-muted hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:text-white"
        >
          <X size={19} aria-hidden="true" />
        </button>

        <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
          <Download size={25} aria-hidden="true" />
        </div>
        <h2 id="pwa-install-title" className="pe-8 text-xl font-extrabold">{mode === 'instructions' ? 'طريقة تثبيت التطبيق' : 'ثبّت تطبيق المنصة'}</h2>
        <p id="pwa-install-description" className="mt-3 leading-7 text-ink-600 dark:text-slate-300">
          {mode === 'instructions'
            ? iosDevice
              ? 'افتح المنصة في Safari، ثم اتبع الخطوات التالية لإضافتها إلى الشاشة الرئيسية.'
              : 'قد يختلف اسم الخيار حسب المتصفح. ابحث عن تثبيت التطبيق أو إضافته إلى الشاشة الرئيسية من قائمة المتصفح.'
            : 'خلّي الوصول للكورسات والمحاضرات والواجبات أسهل، وضيف المنصة إلى الشاشة الرئيسية على جهازك.'}
        </p>

        {mode === 'instructions' && (
          <ol className="mt-5 space-y-3">
            {instructions.map(({ icon: Icon, text }, index) => (
              <li key={text} className="flex items-start gap-3 rounded-2xl bg-surface-muted/70 p-3 text-sm leading-6 dark:bg-white/5">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-default text-brand-700 dark:bg-white/10 dark:text-brand-300">
                  <Icon size={15} aria-hidden="true" />
                </span>
                <span><span className="me-1 font-bold">{index + 1}.</span>{text}</span>
              </li>
            ))}
          </ol>
        )}

        {mode === 'instructions' && iosDevice && (
          <p className="mt-4 text-sm leading-6 text-ink-500 dark:text-slate-400">إذا لم تظهر المشاركة، افتح الموقع في Safari ثم جرّب مرة أخرى.</p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          {mode === 'prompt' && (
            <button
              type="button"
              disabled={busy}
              onClick={() => closeDialog({ dismiss: true })}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl bg-surface-muted px-4 py-2.5 font-semibold text-ink-700 transition hover:bg-surface-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-200"
            >
              ليس الآن
            </button>
          )}
          <button
            ref={actionRef}
            type="button"
            disabled={busy}
            onClick={handlePrimaryAction}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-2.5 font-bold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
          >
            {mode === 'instructions' ? 'حسنًا' : busy ? 'جارٍ فتح التثبيت…' : 'تثبيت التطبيق'}
            {mode === 'prompt' && <Download size={17} aria-hidden="true" />}
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}
