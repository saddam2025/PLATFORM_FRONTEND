// src/pages/admin/TenantSettingsPage.jsx
export const route = {
  path: '/:instructorId/admin/settings',
  index: false,
  auth: 'admin',
  title: 'إعدادات المنصة'
};

import React, { useContext, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import api from '../../services/api';
import authService from '../../services/authService';
// FIX: real hook file is src/hooks/useAuth.js — there is no src/contexts/AuthContext.jsx.
import { useAuth } from '../../hooks/useAuth';
import { ThemeContext } from '../../contexts/ThemeProvider';

// Shared select/textarea styling matching Input.jsx's `.input` look.
const fieldClasses =
  'w-full rounded-md border border-surface-border bg-surface-default px-3 py-2 text-sm text-ink-900 outline-none focus:ring-2 focus:ring-brand-500';

// Mock course list for the lecture access code generator (section 4).
// No backend endpoint yet — matches every other page built so far.
const MOCK_COURSES = [
  { id: 'c1', title: 'أساسيات الجبر' },
  { id: 'c2', title: 'الهندسة' },
  { id: 'c3', title: 'الإحصاء' }
];

function generateCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export default function TenantSettingsPage() {
  const { instructorId } = useParams();
  const { user, updateUser = () => {} } = useAuth() || {};

  // ============================================================
  // My Profile — avatar upload (independent from tenant branding)
  // ============================================================
  const avatarInputRef = useRef(null);
  const avatarObjectUrlRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');

  const clearAvatarPreview = () => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    setAvatarPreview(null);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0] || null;
    setAvatarError('');
    setAvatarSuccess('');
    clearAvatarPreview();
    setAvatarFile(null);

    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAvatarError('يرجى اختيار صورة بصيغة JPEG أو PNG أو WebP فقط.');
      event.target.value = '';
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setAvatarError('حجم الصورة يجب ألا يتجاوز 3 ميجابايت.');
      event.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    avatarObjectUrlRef.current = previewUrl;
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || avatarUploading) return;
    setAvatarUploading(true);
    setAvatarError('');
    setAvatarSuccess('');
    try {
      const response = await authService.uploadAvatar(avatarFile);
      const avatarUrl = response?.data?.data?.avatarUrl;
      if (!avatarUrl) throw new Error('لم يُرجع الخادم رابط الصورة الجديدة.');

      // Keep both field names during the transition from older mock user data.
      updateUser({ avatarUrl, avatar: avatarUrl });
      clearAvatarPreview();
      setAvatarFile(null);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
      setAvatarSuccess('تم تحديث صورتك الشخصية بنجاح.');
    } catch (error) {
      // api.js rejects with the backend JSON body, so this preserves its
      // specific validation message when one is available.
      setAvatarError(error?.message || 'تعذر رفع الصورة. حاول مرة أخرى.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // ============================================================
  // Section 1 — Branding
  // ============================================================
  const { theme, toggleTheme } = useContext(ThemeContext) || {};
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [brandName, setBrandName] = useState('');

  const handleLogoChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setLogoFile(f);
    setLogoPreview(f ? URL.createObjectURL(f) : null);
  };

  // ThemeContext only exposes a toggle function (see Navbar.jsx), not a direct
  // setter, so selecting a specific option here only calls toggleTheme() when
  // it actually differs from the current theme.
  const handleThemeSelect = (nextTheme) => {
    if (nextTheme !== theme && typeof toggleTheme === 'function') {
      toggleTheme();
    }
  };

  // ============================================================
  // Section 2 — Paymob Gateway Integration
  // ============================================================
  const [paymobApiKey, setPaymobApiKey] = useState('');
  const [paymobIntegrationId, setPaymobIntegrationId] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [paymentSaved, setPaymentSaved] = useState(false);

  const handleSavePayment = () => {
    // Mock save — no real API endpoint yet.
    // In production: await api.post(`/instructors/${instructorId}/payment-settings`, { paymobApiKey, paymobIntegrationId })
    // eslint-disable-next-line no-console
    console.log('Payment settings:', { paymobApiKey, paymobIntegrationId });
    setPaymentSaved(true);
    setTimeout(() => setPaymentSaved(false), 3000);
  };

  // ============================================================
  // Section 3 — Assistant Manager
  // ============================================================
  const [assistants, setAssistants] = useState([
    {
      id: 'a1',
      name: 'مساعد أحمد',
      email: 'ahmed@example.com',
      inviteStatus: 'active',
      permissions: { can_upload_video: true, can_grade_exams: true, can_generate_access_codes: false }
    },
    {
      id: 'a2',
      name: 'مساعدة سارة',
      email: 'sara@example.com',
      inviteStatus: 'pending',
      permissions: { can_upload_video: false, can_grade_exams: true, can_generate_access_codes: true }
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    can_upload_video: false,
    can_grade_exams: false,
    can_generate_access_codes: false
  });
  const [editingId, setEditingId] = useState(null);
  const [editingPermissions, setEditingPermissions] = useState({});
  const [editError, setEditError] = useState('');

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      can_upload_video: false,
      can_grade_exams: false,
      can_generate_access_codes: false
    });
    setInviteLink('');
    setFormError('');
  };

  const handleFormChange = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [key]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setFormError('');
    setInviteLink('');
    try {
      const payload = {
        name: form.name,
        email: form.email,
        permissions: {
          can_upload_video: !!form.can_upload_video,
          can_grade_exams: !!form.can_grade_exams,
          can_generate_access_codes: !!form.can_generate_access_codes
        }
      };

      // FIX: api.js's baseURL already includes /api/v1 — prefixing it again
      // here would call /api/v1/api/v1/instructors/... and 404.
      const res = await api.post(`/instructors/${instructorId}/assistants`, payload);

      const data = res?.data || res;
      const newAssistant = data.assistant || {
        id: `a-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        inviteStatus: 'pending',
        permissions: payload.permissions
      };

      setAssistants((s) => [newAssistant, ...s]);
      if (data.inviteLink) {
        setInviteLink(data.inviteLink);
      } else {
        setInviteLink(`${window.location.origin}/invite/${newAssistant.id}`);
      }
      resetForm();
      setShowForm(true); // keep the panel open so the invite link stays visible
    } catch (err) {
      // FIX: replaced alert() with an inline banner, consistent with the
      // pattern used across every other page (RegisterForm, AssignmentGradingPage, etc.)
      setFormError(err?.message || 'فشل إنشاء المساعد. حاول مرة أخرى.');
    } finally {
      setCreating(false);
    }
  };

  const [copyFeedback, setCopyFeedback] = useState('');
  const copyInvite = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyFeedback('تم نسخ رابط الدعوة');
    } catch {
      setCopyFeedback('فشل النسخ');
    }
    setTimeout(() => setCopyFeedback(''), 2500);
  };

  const startEdit = (assistant) => {
    setEditingId(assistant.id);
    setEditingPermissions({ ...assistant.permissions });
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingPermissions({});
    setEditError('');
  };

  const toggleEditPermission = (key) => {
    setEditingPermissions((p) => ({ ...p, [key]: !p[key] }));
  };

  const savePermissions = async (assistantId) => {
    const assistant = assistants.find((a) => a.id === assistantId);
    if (!assistant) return;
    try {
      const payload = { permissions: editingPermissions };
      // FIX: same double /api/v1 issue as the create call above.
      const res = await api.patch(`/instructors/${instructorId}/assistants/${assistantId}`, payload);
      const updated = res?.data?.assistant || { ...assistant, permissions: editingPermissions };
      setAssistants((list) => list.map((a) => (a.id === assistantId ? updated : a)));
      setEditingId(null);
      setEditingPermissions({});
    } catch (err) {
      setEditError(err?.message || 'فشل تحديث الصلاحيات. حاول مرة أخرى.');
    }
  };

  const permissionLabel = (key) => {
    if (key === 'can_upload_video') return 'رفع الفيديوهات';
    if (key === 'can_grade_exams') return 'تصحيح الاختبارات';
    if (key === 'can_generate_access_codes') return 'توليد أكواد الوصول';
    return key;
  };

  // ============================================================
  // Section 4 — Lecture Access Codes
  // ============================================================
  const [codeCount, setCodeCount] = useState(5);
  const [codeCourseId, setCodeCourseId] = useState(MOCK_COURSES[0].id);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [codesCopyFeedback, setCodesCopyFeedback] = useState('');

  const handleGenerateCodes = () => {
    const n = Math.max(1, Number(codeCount) || 1);
    const codes = Array.from({ length: n }, () => generateCode());
    setGeneratedCodes(codes);
  };

  const copyAllCodes = async () => {
    if (generatedCodes.length === 0) return;
    try {
      await navigator.clipboard.writeText(generatedCodes.join('\n'));
      setCodesCopyFeedback('تم نسخ جميع الأكواد');
    } catch {
      setCodesCopyFeedback('فشل النسخ');
    }
    setTimeout(() => setCodesCopyFeedback(''), 2500);
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">إعدادات المنصة</h1>
          <p className="text-sm text-ink-500 mt-1">
            {user?.name ? `مرحباً ${user.name} — ` : ''}إدارة الهوية البصرية والدفع والمساعدين وأكواد الوصول
          </p>
        </div>

        {/* Separate personal profile from tenant-wide branding settings. */}
        <section className="rounded-2xl bg-surface-default shadow-card p-6 mb-4">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                avatarUrl={avatarPreview || user?.avatarUrl || user?.avatar}
                name={user?.name || 'المستخدم'}
                size="lg"
              />
              <div>
                <h2 className="text-lg font-semibold text-ink-900">ملفي الشخصي</h2>
                <p className="mt-1 text-sm text-ink-500">غيّر صورتك الشخصية. الصيغ المدعومة: JPEG وPNG وWebP، حتى 3 ميجابايت.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={avatarInputRef}
                id="avatarUpload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleAvatarChange}
              />
              <Button type="button" variant="ghost" onClick={() => avatarInputRef.current?.click()} disabled={avatarUploading}>
                تغيير الصورة
              </Button>
              <Button type="button" variant="primary" onClick={handleAvatarUpload} disabled={!avatarFile || avatarUploading}>
                {avatarUploading ? 'جاري الرفع...' : 'حفظ الصورة'}
              </Button>
            </div>
          </div>

          {avatarError && <div role="alert" className="mt-4 rounded-md bg-danger-soft p-3 text-sm text-danger-DEFAULT">{avatarError}</div>}
          {avatarSuccess && <div role="status" className="mt-4 rounded-md bg-success-soft p-3 text-sm text-success-DEFAULT">{avatarSuccess}</div>}
        </section>

        {/* Section 1: Branding */}
        <section className="rounded-2xl bg-surface-default shadow-card p-6 mb-4">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">الهوية البصرية</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">شعار المنصة</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full text-sm" />
              {logoPreview && (
                <img src={logoPreview} alt="معاينة الشعار" className="mt-3 w-24 h-24 object-cover rounded-lg border border-surface-border" />
              )}
            </div>

            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-ink-700 mb-1">اسم العلامة التجارية</label>
              <Input id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-ink-700 mb-2">المظهر الافتراضي</label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-ink-700">
                <input type="radio" name="theme" checked={theme === 'light'} onChange={() => handleThemeSelect('light')} />
                فاتح
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-ink-700">
                <input type="radio" name="theme" checked={theme === 'dark'} onChange={() => handleThemeSelect('dark')} />
                داكن
              </label>
            </div>
          </div>
        </section>

        {/* Section 2: Paymob Gateway Integration */}
        <section className="rounded-2xl bg-surface-default shadow-card p-6 mb-4">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">بوابة الدفع (Paymob)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="paymobApiKey" className="block text-sm font-medium text-ink-700 mb-1">مفتاح Paymob API</label>
              <div className="relative">
                <Input
                  id="paymobApiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={paymobApiKey}
                  onChange={(e) => setPaymobApiKey(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey((s) => !s)}
                  className="absolute inset-y-0 left-3 flex items-center text-xs text-ink-500"
                  aria-label={showApiKey ? 'إخفاء المفتاح' : 'إظهار المفتاح'}
                >
                  {showApiKey ? 'إخفاء' : 'إظهار'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="paymobIntegrationId" className="block text-sm font-medium text-ink-700 mb-1">معرّف التكامل (Integration ID)</label>
              <Input id="paymobIntegrationId" value={paymobIntegrationId} onChange={(e) => setPaymobIntegrationId(e.target.value)} />
            </div>
          </div>

          <p className="text-xs text-ink-500 mt-3">
            هذه البيانات تضمن تحويل جميع المبيعات مباشرة إلى حسابك الخاص دون عمولة المنصة.
          </p>

          {paymentSaved && (
            <div className="rounded-md p-3 bg-success-soft text-success-DEFAULT mt-3 text-sm">تم حفظ إعدادات الدفع بنجاح.</div>
          )}

          <div className="mt-4">
            <Button type="button" variant="primary" onClick={handleSavePayment}>حفظ إعدادات الدفع</Button>
          </div>
        </section>

        {/* Section 3: Assistant Manager */}
        <section className="rounded-2xl bg-surface-default shadow-card p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-ink-900">إدارة المساعدين</h2>
              <div className="text-sm text-ink-500 mt-1">أضف أو عدل صلاحيات المساعدين هنا</div>
            </div>
            {/* FIX: previously two separate buttons both toggled showForm and did
                the same thing (one in the page header, one here) — consolidated
                into a single toggle to avoid duplicated, confusing controls. */}
            <Button onClick={() => setShowForm((s) => !s)} variant="primary">
              {showForm ? 'إغلاق النموذج' : 'إضافة مساعد'}
            </Button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="mb-4 border border-surface-border rounded-lg p-4">
              {formError && (
                <div className="rounded-md p-3 bg-danger-soft text-danger-DEFAULT mb-3 text-sm">{formError}</div>
              )}

              {/* FIX: Input.jsx has no `label` prop — wrapped with explicit <label>s. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="assistantName" className="block text-sm font-medium text-ink-700 mb-1">الاسم</label>
                  <Input id="assistantName" name="name" value={form.name} onChange={handleFormChange('name')} required />
                </div>
                <div>
                  <label htmlFor="assistantEmail" className="block text-sm font-medium text-ink-700 mb-1">البريد الإلكتروني</label>
                  <Input id="assistantEmail" name="email" type="email" value={form.email} onChange={handleFormChange('email')} required />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm font-medium text-ink-900 mb-2">الصلاحيات</div>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.can_upload_video} onChange={handleFormChange('can_upload_video')} />
                    <span className="text-sm text-ink-700">رفع الفيديوهات</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.can_grade_exams} onChange={handleFormChange('can_grade_exams')} />
                    <span className="text-sm text-ink-700">تصحيح الاختبارات</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.can_generate_access_codes} onChange={handleFormChange('can_generate_access_codes')} />
                    <span className="text-sm text-ink-700">توليد أكواد الوصول</span>
                  </label>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Button type="submit" variant="primary" disabled={creating}>
                  {creating ? 'جاري الإنشاء...' : 'إنشاء ودعوة'}
                </Button>
                {/* FIX: variant="outline" doesn't exist in Button.jsx (only primary/ghost/subtle). */}
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); resetForm(); }}>
                  إلغاء
                </Button>
              </div>

              {inviteLink && (
                <div className="mt-4">
                  <label htmlFor="inviteLink" className="block text-sm font-medium text-ink-700 mb-1">رابط الدعوة</label>
                  <div className="flex items-center gap-3">
                    <Input id="inviteLink" value={inviteLink} readOnly />
                    <Button type="button" variant="primary" onClick={copyInvite}>نسخ</Button>
                  </div>
                  {copyFeedback && <p className="text-xs text-ink-500 mt-1">{copyFeedback}</p>}
                </div>
              )}
            </form>
          )}

          {editError && (
            <div className="rounded-md p-3 bg-danger-soft text-danger-DEFAULT mb-3 text-sm">{editError}</div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-right" dir="rtl">
              <thead>
                <tr className="text-xs text-ink-500">
                  <th className="py-2 px-3">الاسم</th>
                  <th className="py-2 px-3">البريد</th>
                  <th className="py-2 px-3">الحالة</th>
                  <th className="py-2 px-3">الصلاحيات</th>
                  <th className="py-2 px-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {assistants.map((a) => (
                  <tr key={a.id} className="border-t border-surface-border">
                    <td className="py-3 px-3 text-sm font-medium">{a.name}</td>
                    <td className="py-3 px-3 text-sm text-ink-700">{a.email}</td>
                    <td className="py-3 px-3">
                      {a.inviteStatus === 'active' ? (
                        <Badge variant="success">نشط</Badge>
                      ) : (
                        // FIX: variant="warning" doesn't exist in Badge.jsx
                        // (only brand/info/success/danger/neutral). Spec calls
                        // for pending=neutral explicitly.
                        <Badge variant="neutral">قيد الدعوة</Badge>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {editingId === a.id ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          {['can_upload_video', 'can_grade_exams', 'can_generate_access_codes'].map((key) => (
                            <label key={key} className="inline-flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={!!editingPermissions[key]}
                                onChange={() => toggleEditPermission(key)}
                              />
                              <span>{permissionLabel(key)}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          {Object.entries(a.permissions || {}).map(([k, v]) => (
                            <Badge key={k} variant={v ? 'brand' : 'neutral'} className="text-xs">
                              {permissionLabel(k)}{v ? '' : ' (مقيد)'}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {editingId === a.id ? (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="primary" onClick={() => savePermissions(a.id)}>حفظ</Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>إلغاء</Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => startEdit(a)}>تعديل الصلاحيات</Button>
                      )}
                    </td>
                  </tr>
                ))}
                {assistants.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-ink-500">لا يوجد مساعدين بعد</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Lecture Access Codes */}
        <section className="rounded-2xl bg-surface-default shadow-card p-6 mb-4">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">أكواد الوصول للمحاضرات</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label htmlFor="codeCount" className="block text-sm font-medium text-ink-700 mb-1">عدد الأكواد</label>
              <Input id="codeCount" type="number" min={1} value={codeCount} onChange={(e) => setCodeCount(e.target.value)} />
            </div>
            <div>
              <label htmlFor="codeCourse" className="block text-sm font-medium text-ink-700 mb-1">المحاضرة</label>
              <select id="codeCourse" value={codeCourseId} onChange={(e) => setCodeCourseId(e.target.value)} className={fieldClasses}>
                {MOCK_COURSES.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <Button type="button" variant="primary" onClick={handleGenerateCodes}>توليد</Button>
          </div>

          {generatedCodes.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-ink-700">{generatedCodes.length} كود تم توليده</span>
                <Button size="sm" variant="subtle" onClick={copyAllCodes}>نسخ الكل</Button>
              </div>
              {codesCopyFeedback && <p className="text-xs text-ink-500 mb-2">{codesCopyFeedback}</p>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {generatedCodes.map((code) => (
                  <div key={code} className="rounded-md bg-surface-muted px-3 py-2 text-center text-sm font-mono text-ink-900">
                    {code}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
