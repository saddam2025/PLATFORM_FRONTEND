// src/pages/parent/ParentActivityPage.jsx
export const route = {
  path: '/:instructorId/parent/activity',
  index: false,
  auth: 'parent',
  title: 'النشاط والرسائل'
};

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
// FIX: need `children` too, for fallback when no child is selected yet
import { children as mockChildren, activities as mockActivities } from '../../mocks/parentData';
import { useSelectedChild } from '../../contexts/SelectedChildContext';

function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export default function ParentActivityPage() {
  const { selectedChildId } = useSelectedChild();
  // FIX: was `?? null` with no fallback — on first load selectedChildId is null,
  // so activeChildId stayed null and the lookup below always failed.
  const activeChildId = selectedChildId ?? (mockChildren && mockChildren[0] && mockChildren[0].id) ?? null;

  const taFeedback = useMemo(
    () => [
      {
        id: 'ta1',
        taName: 'مساعد أحمد',
        avatar: null,
        comment: 'أداء جيد في الواجب الأخير، لكن يحتاج لتحسين الدقة في الحلول.',
        relatedTo: 'واجب: مسائل جبر',
        date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'ta2',
        taName: 'مساعدة سارة',
        avatar: null,
        comment: 'الطالب شارك بنشاط في النقاش اليومي، أحسنت المتابعة.',
        relatedTo: 'درس: الكسور',
        date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'ta3',
        taName: 'مساعد كريم',
        avatar: null,
        comment: 'هناك ملاحظة على تسليم الواجب رقم 3، يرجى مراجعة التعليقات.',
        relatedTo: 'واجب: مسائل تطبيقية',
        date: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'ta4',
        taName: 'مساعدة ليلى',
        avatar: null,
        comment: 'الطفل يحتاج إلى دعم إضافي في حل المسائل الهندسية.',
        relatedTo: 'اختبار قصير: الهندسة',
        date: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
      }
    ],
    []
  );

  // FIX: mockActivities is an object keyed by childId ({ 'child-1': [...], 'child-2': [...] }),
  // not a flat array. The previous `.filter((a) => a.childId === activeChildId)` call on an
  // object threw "mockActivities.filter is not a function" and crashed this page every time.
  const activities = useMemo(() => {
    return (mockActivities && mockActivities[activeChildId]) || [];
  }, [activeChildId]);

  const [messages, setMessages] = useState(() => [
    { id: 'm1', from: 'admin', text: 'مرحبًا، تم تحديث جدول الامتحانات.', time: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString() },
    { id: 'm2', from: 'parent', text: 'شكرًا على الإشعار، هل يمكن الحصول على تفاصيل أكثر؟', time: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() },
    { id: 'm3', from: 'admin', text: 'بالطبع، سنرسل التفاصيل عبر البريد الإلكتروني اليوم.', time: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const text = inputValue.trim();
    if (!text) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      from: 'parent',
      text,
      time: new Date().toISOString()
    };
    setMessages((s) => [...s, newMsg]);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sortedTaFeedback = useMemo(() => {
    return [...taFeedback].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [taFeedback]);

  return (
    <div className="space-y-6" dir="rtl">
      <section className="rounded-2xl bg-surface-default shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">ملاحظات المساعدين</h2>
          <div className="text-sm text-ink-500">{sortedTaFeedback.length} ملاحظة</div>
        </div>

        <div className="space-y-3">
          {sortedTaFeedback.map((f) => (
            <div key={f.id} className="bg-surface-default rounded-xl p-3 shadow-card">
              <div className="flex items-start gap-3">
                <Avatar src={f.avatar} name={f.taName} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-ink-900">{f.taName}</div>
                    <div className="text-xs text-ink-500">{formatDateTime(f.date)}</div>
                  </div>
                  <div className="text-sm text-ink-700 mt-2">{f.comment}</div>
                  {f.relatedTo && <div className="text-xs text-ink-500 mt-2">متعلق بـ: {f.relatedTo}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-surface-default shadow-card p-4 flex flex-col" style={{ minHeight: 320 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">الدعم الإداري</h2>
          <div className="text-sm text-ink-500">{messages.length} رسالة</div>
        </div>

        <div
          ref={messagesRef}
          className="flex-1 overflow-auto space-y-3 p-2 border border-surface-border rounded-md bg-white"
          style={{ maxHeight: 320 }}
        >
          {messages.length === 0 ? (
            <div className="text-center text-ink-600 py-6">لا توجد رسائل بعد</div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-full ${m.from === 'parent' ? 'ml-auto text-right' : 'mr-auto text-left'} `}
              >
                <div className={`inline-block rounded-lg p-3 ${m.from === 'parent' ? 'bg-brand-50 text-ink-900' : 'bg-surface-muted text-ink-900'}`}>
                  <div className="text-sm">{m.text}</div>
                  <div className="text-xs text-ink-500 mt-2">{formatDateTime(m.time)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالة..."
            className="flex-1"
            dir="rtl"
          />
          <Button variant="primary" onClick={sendMessage}>
            إرسال
          </Button>
        </div>
      </section>

      <section className="rounded-2xl bg-surface-default shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">النشاط الأخير</h2>
          <div className="text-sm text-ink-500">{activities.length} عنصر</div>
        </div>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-ink-600">لا توجد أنشطة حديثة</div>
          ) : (
            activities
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500 mt-1" />
                    <div className="w-px bg-surface-border flex-1" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-ink-900">{act.title}</div>
                      <div className="text-xs text-ink-500">{formatDateTime(act.date)}</div>
                    </div>
                    {act.description && <div className="text-sm text-ink-600 mt-1">{act.description}</div>}
                    {act.meta && <div className="text-xs text-ink-500 mt-2">{act.meta}</div>}
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
}