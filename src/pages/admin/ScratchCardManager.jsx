// src/pages/admin/ScratchCardManager.jsx
export const route = {
  path: '/:instructorId/admin/scratchcards',
  index: false,
  auth: 'required',
  roles: ['admin', 'assistant', 'teacher'],
  title: 'أكواد التفعيل',
};

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const MOCK_LECTURES = [
  { id: 'course-101', title: 'أساسيات الجبر' },
  { id: 'course-102', title: 'الهندسة المستوية' },
  { id: 'course-103', title: 'التفاضل والتكامل' },
];

function generateCode() {
  return Array.from({ length: 4 }, () =>
    Math.random().toString(36).substring(2, 6).toUpperCase()
  ).join('-');
}

function maskCode(code) {
  const parts = code.split('-');
  return parts.map((p, idx) => (idx === parts.length - 1 ? p : '••••')).join('-');
}

export default function ScratchCardManager() {
  const { instructorId } = useParams();
  const { user } = useAuth();

  const role = user?.role || null;
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const canGenerate = role === 'admin' || permissions.includes('can_generate_access_codes');

  const [activeTab, setActiveTab] = useState('scratchcard'); // 'scratchcard' | 'lectureCodes'

  // --- Scratch cards state ---
  const [scCount, setScCount] = useState(10);
  const [scBatchId, setScBatchId] = useState('');
  const [scValue, setScValue] = useState(50);
  const [scInventory, setScInventory] = useState([
    {
      code: generateCode(),
      value: 50,
      isRedeemed: true,
      redeemedBy: 'أحمد محمود',
      redeemedAt: '2026-07-10T12:00:00Z',
      batchId: 'BATCH-A',
    },
    {
      code: generateCode(),
      value: 100,
      isRedeemed: false,
      redeemedBy: null,
      redeemedAt: null,
      batchId: 'BATCH-A',
    },
  ]);
  const [scSearch, setScSearch] = useState('');
  const [revealedCodes, setRevealedCodes] = useState({});

  const handleGenerateScratchCards = (e) => {
    e.preventDefault();
    const batch = scBatchId.trim() || `BATCH-${Date.now().toString().slice(-4)}`;
    const newCards = Array.from({ length: Number(scCount) || 0 }, () => ({
      code: generateCode(),
      value: Number(scValue) || 0,
      isRedeemed: false,
      redeemedBy: null,
      redeemedAt: null,
      batchId: batch,
    }));
    setScInventory((prev) => [...newCards, ...prev]);
    setScBatchId('');
  };

  const filteredInventory = scInventory.filter((c) =>
    c.batchId.toLowerCase().includes(scSearch.trim().toLowerCase())
  );

  const toggleReveal = (code) => {
    setRevealedCodes((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  // --- Lecture access codes state ---
  const [lcCount, setLcCount] = useState(10);
  const [lcLectureId, setLcLectureId] = useState(MOCK_LECTURES[0]?.id || '');
  const [lcGenerated, setLcGenerated] = useState([]);
  const [lcCopied, setLcCopied] = useState(false);

  const handleGenerateLectureCodes = (e) => {
    e.preventDefault();
    if (!canGenerate) return;
    const codes = Array.from({ length: Number(lcCount) || 0 }, () => generateCode());
    setLcGenerated(codes);
  };

  const handleCopyAllLectureCodes = async () => {
    try {
      await navigator.clipboard.writeText(lcGenerated.join('\n'));
      setLcCopied(true);
      setTimeout(() => setLcCopied(false), 2000);
    } catch {
      // clipboard API unavailable; fail silently
    }
  };

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">أكواد التفعيل</h1>
        <p className="text-sm text-ink-500 mt-1">إدارة بطاقات الشحن وأكواد الوصول للمحاضرات</p>
      </div>

      {!canGenerate && (
        <Badge variant="danger">
          لا تملك صلاحية توليد الأكواد — تواصل مع المدرس لمنحك هذه الصلاحية
        </Badge>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('scratchcard')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'scratchcard'
              ? 'bg-brand-500 text-ink-900'
              : 'bg-surface-default border border-surface-border text-ink-700'
          }`}
        >
          بطاقات الشحن
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('lectureCodes')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'lectureCodes'
              ? 'bg-brand-500 text-ink-900'
              : 'bg-surface-default border border-surface-border text-ink-700'
          }`}
        >
          أكواد المحاضرات
        </button>
      </div>

      {/* Tab 1: Scratch cards */}
      {activeTab === 'scratchcard' && (
        <div className="space-y-6">
          <form
            onSubmit={handleGenerateScratchCards}
            className="bg-surface-default rounded-2xl shadow-card p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">عدد البطاقات</label>
              <Input
                type="number"
                min={1}
                value={scCount}
                onChange={(e) => setScCount(e.target.value)}
                disabled={!canGenerate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">معرف الدفعة</label>
              <Input
                value={scBatchId}
                onChange={(e) => setScBatchId(e.target.value)}
                placeholder="مثال: BATCH-JUL26"
                disabled={!canGenerate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">القيمة</label>
              <Input
                type="number"
                min={0}
                value={scValue}
                onChange={(e) => setScValue(e.target.value)}
                disabled={!canGenerate}
              />
            </div>
            <Button type="submit" variant="primary" disabled={!canGenerate}>
              توليد
            </Button>
          </form>

          <div className="bg-surface-default rounded-2xl shadow-card p-6 space-y-4">
            <Input
              placeholder="ابحث حسب معرف الدفعة..."
              value={scSearch}
              onChange={(e) => setScSearch(e.target.value)}
            />

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b border-surface-border text-ink-500">
                    <th className="py-2 px-3 font-medium">الكود</th>
                    <th className="py-2 px-3 font-medium">القيمة</th>
                    <th className="py-2 px-3 font-medium">الحالة</th>
                    <th className="py-2 px-3 font-medium">تم الاستخدام بواسطة</th>
                    <th className="py-2 px-3 font-medium">تاريخ الاستخدام</th>
                    <th className="py-2 px-3 font-medium">الدفعة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((card) => (
                    <tr key={card.code} className="border-b border-surface-border">
                      <td className="py-2 px-3 font-mono">
                        <div className="flex items-center gap-2">
                          <span>{revealedCodes[card.code] ? card.code : maskCode(card.code)}</span>
                          <button
                            type="button"
                            onClick={() => toggleReveal(card.code)}
                            className="text-xs text-brand-700 underline"
                          >
                            {revealedCodes[card.code] ? 'إخفاء' : 'إظهار'}
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-3">{card.value} ج.م</td>
                      <td className="py-2 px-3">
                        <Badge variant={card.isRedeemed ? 'success' : 'neutral'}>
                          {card.isRedeemed ? 'مستخدم' : 'متاح'}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">{card.redeemedBy || '—'}</td>
                      <td className="py-2 px-3">
                        {card.redeemedAt ? new Date(card.redeemedAt).toLocaleDateString('ar') : '—'}
                      </td>
                      <td className="py-2 px-3">{card.batchId}</td>
                    </tr>
                  ))}
                  {filteredInventory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-ink-500">
                        لا توجد بطاقات مطابقة
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Lecture access codes */}
      {activeTab === 'lectureCodes' && (
        <div className="space-y-6">
          <form
            onSubmit={handleGenerateLectureCodes}
            className="bg-surface-default rounded-2xl shadow-card p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">عدد الأكواد</label>
              <Input
                type="number"
                min={1}
                value={lcCount}
                onChange={(e) => setLcCount(e.target.value)}
                disabled={!canGenerate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">المحاضرة</label>
              <select
                value={lcLectureId}
                onChange={(e) => setLcLectureId(e.target.value)}
                disabled={!canGenerate}
                className="input w-full"
              >
                {MOCK_LECTURES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary" disabled={!canGenerate}>
              توليد
            </Button>
          </form>

          {lcGenerated.length > 0 && (
            <div className="bg-surface-default rounded-2xl shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink-900">
                  الأكواد المولدة ({lcGenerated.length})
                </h2>
                <Button variant="ghost" size="sm" onClick={handleCopyAllLectureCodes}>
                  {lcCopied ? 'تم النسخ' : 'نسخ الكل'}
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {lcGenerated.map((code) => (
                  <div
                    key={code}
                    className="px-3 py-2 rounded-lg bg-surface-muted font-mono text-sm text-center text-ink-800"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
