// src/pages/student/CheckoutPage.jsx
export const route = {
  path: '/:instructorId/checkout/:courseId',
  index: false,
  auth: 'required',
  roles: ['student'],
  title: 'الدفع',
};

import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const MOCK_COURSE = {
  title: 'أساسيات الجبر',
  price: 150,
};

const MOCK_SUBSCRIPTION = {
  title: 'اشتراك شهري',
  price: 300,
};

export default function CheckoutPage() {
  const { instructorId, courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isSubscription = courseId === 'subscription';
  const stageId = searchParams.get('stageId');
  const order = isSubscription ? MOCK_SUBSCRIPTION : MOCK_COURSE;

  const [method, setMethod] = useState('scratchcard');

  // Scratch card state
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [activating, setActivating] = useState(false);
  const [success, setSuccess] = useState(false);

  // Paymob state
  const [paymobLoading, setPaymobLoading] = useState(true);

  React.useEffect(() => {
    if (method === 'paymob') {
      setPaymobLoading(true);
      const t = setTimeout(() => setPaymobLoading(false), 1200);
      return () => clearTimeout(t);
    }
  }, [method]);

  const handleActivate = (e) => {
    e.preventDefault();
    setCodeError('');
    if (!code.trim()) {
      setCodeError('الرجاء إدخال الكود');
      return;
    }

    setActivating(true);
    setTimeout(() => {
      setActivating(false);
      if (code.trim() === 'VALID123') {
        setSuccess(true);
        setTimeout(() => {
          if (isSubscription) {
            navigate(`/${instructorId}/dashboard`);
          } else {
            navigate(`/${instructorId}/player/${courseId}`);
          }
        }, 1500);
      } else {
        setCodeError('الكود غير صالح أو مستخدم من قبل');
      }
    }, 600);
  };

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">الدفع</h1>
        <p className="text-sm text-ink-500 mt-1">
          {isSubscription ? 'إتمام الاشتراك الشهري' : 'إتمام عملية الشراء'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment methods */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMethod('scratchcard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                method === 'scratchcard'
                  ? 'bg-brand-500 text-ink-900'
                  : 'bg-surface-default border border-surface-border text-ink-700'
              }`}
            >
              بطاقة شحن
            </button>
            <button
              type="button"
              onClick={() => setMethod('paymob')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                method === 'paymob'
                  ? 'bg-brand-500 text-ink-900'
                  : 'bg-surface-default border border-surface-border text-ink-700'
              }`}
            >
              الدفع الإلكتروني
            </button>
          </div>

          {method === 'scratchcard' && (
            <div className="bg-surface-default rounded-2xl shadow-card p-6">
              {success ? (
                <div className="rounded-md p-4 bg-success-soft text-success-DEFAULT text-sm">
                  تم التفعيل بنجاح! جارٍ التحويل...
                </div>
              ) : (
                <form onSubmit={handleActivate} className="space-y-4">
                  <div>
                    <label htmlFor="scratchcode" className="block text-sm font-medium text-ink-700 mb-1">
                      كود بطاقة الشحن
                    </label>
                    <Input
                      id="scratchcode"
                      name="scratchcode"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setCodeError('');
                      }}
                      placeholder="أدخل الكود هنا"
                      error={codeError}
                    />
                  </div>
                  <Button type="submit" variant="primary" disabled={activating}>
                    {activating ? 'جارٍ التفعيل...' : 'تفعيل'}
                  </Button>
                </form>
              )}
            </div>
          )}

          {method === 'paymob' && (
            <div className="bg-surface-default rounded-2xl shadow-card p-6">
              {paymobLoading ? (
                <div className="h-64 rounded-xl bg-surface-muted animate-pulse flex items-center justify-center text-ink-500 text-sm">
                  جاري تحميل بوابة الدفع...
                </div>
              ) : (
                // TODO(backend): replace this placeholder with the real Paymob
                // iframe integration once the payment gateway endpoint/keys
                // are wired up server-side (see TenantSettingsPage's Paymob
                // section for where the API key/integration ID are configured).
                <div className="bg-surface-muted rounded-xl h-64 flex items-center justify-center text-ink-500">
                  بوابة الدفع (Paymob)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-surface-default rounded-2xl shadow-card p-6 h-fit space-y-4">
          <h2 className="text-lg font-semibold text-ink-900">ملخص الطلب</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-600">{order.title}</span>
            {isSubscription && stageId && <Badge variant="neutral">{stageId}</Badge>}
          </div>
          <div className="border-t border-surface-border pt-4 flex items-center justify-between">
            <span className="font-semibold text-ink-900">المجموع</span>
            <span className="font-semibold text-ink-900">{order.price} ج.م</span>
          </div>
        </div>
      </div>
    </div>
  );
}