// src/pages/student/CheckoutPage.jsx
export const route = {
  path: '/:instructorId/checkout/:courseId',
  index: false,
  auth: 'required',
  roles: ['student'],
  title: 'الدفع',
};

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';
import courseService from '../../services/courseService';

function stageLabel(stageId) {
  const stages = {
    'grade-7': 'الصف السابع',
    'grade-8': 'الصف الثامن',
    'grade-9': 'الصف التاسع',
    'grade-10': 'الصف العاشر',
    'grade-11': 'الصف الحادي عشر',
    'grade-12': 'الصف الثاني عشر'
  };
  return stages[stageId] || stageId;
}

export default function CheckoutPage() {
  const { instructorId, courseId } = useParams();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [orderError, setOrderError] = useState('');
  const [paymobLoading, setPaymobLoading] = useState(false);
  const [paymobError, setPaymobError] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');

  const isSubscription = courseId === 'subscription';
  const stageId = searchParams.get('stageId');

  useEffect(() => {
    let active = true;

    if (isSubscription) {
      setLoadingOrder(false);
      setCourse(null);
      setOrderError(stageId ? '' : 'لم يتم تحديد المرحلة الدراسية للاشتراك.');
      return () => { active = false; };
    }

    setLoadingOrder(true);
    setOrderError('');
    courseService.get(instructorId, courseId)
      .then((response) => {
        if (active) setCourse(response?.data?.data || null);
      })
      .catch((error) => {
        if (active) setOrderError(error?.message || 'تعذر تحميل تفاصيل الدورة.');
      })
      .finally(() => {
        if (active) setLoadingOrder(false);
      });

    return () => { active = false; };
  }, [courseId, instructorId, isSubscription, stageId]);

  const startPaymobCheckout = async () => {
    setPaymobLoading(true);
    setPaymobError('');

    try {
      const response = isSubscription
        ? await api.post(`/subscriptions/${stageId}/checkout`, { instructorId, paymentMethod: 'paymob' })
        : await api.post(`/courses/${courseId}/checkout/paymob`);
      const nextIframeUrl = response?.data?.data?.iframeUrl;
      if (!nextIframeUrl) throw new Error('لم تُرجع بوابة الدفع رابط الإطار المطلوب.');
      setIframeUrl(nextIframeUrl);
    } catch (error) {
      setPaymobError(error?.message || 'تعذر بدء عملية الدفع الإلكتروني.');
    } finally {
      setPaymobLoading(false);
    }
  };

  const orderTitle = isSubscription ? 'اشتراك شهري' : (course?.title_ar || course?.title_en);
  const orderPrice = isSubscription ? null : course?.price;

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">الدفع</h1>
        <p className="text-sm text-ink-500 mt-1">
          {isSubscription ? 'إتمام الاشتراك الشهري' : 'إتمام عملية الشراء'}
        </p>
      </div>

      {loadingOrder && <div className="rounded-xl bg-surface-default p-4 text-center text-sm text-ink-500">جارٍ تحميل تفاصيل الطلب...</div>}
      {orderError && <div role="alert" className="rounded-xl bg-danger-soft p-4 text-center text-sm text-danger-DEFAULT">{orderError}</div>}

      {!loadingOrder && !orderError && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <section className="bg-surface-default rounded-2xl shadow-card p-6">
              <h2 className="text-lg font-semibold text-ink-900">الدفع الإلكتروني</h2>
              <p className="mt-2 text-sm text-ink-600">
                سيتم فتح بوابة Paymob الآمنة لإتمام الدفع عند توفرها للخطة المختارة.
              </p>

              {paymobError && <div role="alert" className="mt-4 rounded-xl bg-danger-soft p-4 text-sm text-danger-DEFAULT">{paymobError}</div>}

              {!iframeUrl && (
                <Button className="mt-5" variant="primary" onClick={startPaymobCheckout} disabled={paymobLoading}>
                  {paymobLoading ? 'جارٍ فتح بوابة الدفع...' : 'الدفع عبر Paymob'}
                </Button>
              )}

              {iframeUrl && (
                <iframe
                  title="بوابة دفع Paymob"
                  src={iframeUrl}
                  className="mt-5 h-[680px] w-full rounded-xl border border-surface-border"
                  allow="payment"
                />
              )}
            </section>
          </div>

          <aside className="bg-surface-default rounded-2xl shadow-card p-6 h-fit space-y-4">
            <h2 className="text-lg font-semibold text-ink-900">ملخص الطلب</h2>
            <div className="flex items-center justify-between text-sm gap-3">
              <span className="text-ink-600">{orderTitle}</span>
              {isSubscription && stageId && <Badge variant="neutral">{stageLabel(stageId)}</Badge>}
            </div>
            <div className="border-t border-surface-border pt-4 flex items-center justify-between">
              <span className="font-semibold text-ink-900">المجموع</span>
              <span className="font-semibold text-ink-900">
                {typeof orderPrice === 'number' ? `${orderPrice} ج.م` : 'يُحدده الخادم عند تفعيل الاشتراك'}
              </span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
