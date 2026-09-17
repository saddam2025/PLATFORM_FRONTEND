import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import 'mathlive';
import normalizeMathLatex from './normalizeMathLatex';

const QUICK_SYMBOLS = [
  { label: '√', latex: '\\sqrt{}', title: 'جذر تربيعي' }, { label: '³√', latex: '\\sqrt[3]{}', title: 'جذر تكعيبي' },
  { label: 'a⁄b', latex: '\\frac{}{}', title: 'كسر' }, { label: 'xⁿ', latex: '^{}', title: 'أس' },
  { label: '∑', latex: '\\sum_{}^{}', title: 'مجموع' }, { label: 'π', latex: '\\pi', title: 'باي' },
  { label: '≤', latex: '\\le', title: 'أصغر من أو يساوي' }, { label: '≥', latex: '\\ge', title: 'أكبر من أو يساوي' },
  { label: '±', latex: '\\pm', title: 'موجب أو سالب' }, { label: '°', latex: '^\\circ', title: 'درجة' }, { label: '∫', latex: '\\int_{}^{}', title: 'تكامل' },
];
const ARABIC_SYMBOLS = [
  { label: 'قⁿᵣ', latex: '\\text{ق}_{r}^{n}', title: 'توافيق: ق أس n وتحت r' },
  { label: 'تⁿᵣ', latex: '\\text{ت}_{r}^{n}', title: 'تباديل: ت أس n وتحت r' },
  { label: '%', latex: '\\%', title: 'النسبة المئوية' },
];

function parseSegments(value) {
  const segments = [];
  const pattern = /\$([^$\r\n]*)\$/g;
  let cursor = 0;
  let match;
  while ((match = pattern.exec(value)) !== null) {
    if (match.index > cursor) segments.push({ kind: 'text', value: value.slice(cursor, match.index) });
    segments.push({ kind: 'math', value: match[1] });
    cursor = pattern.lastIndex;
  }
  // Keep an editable text area after a final equation. Older questions can
  // end exactly at `$...$`, and authors still need somewhere to continue.
  if (cursor < value.length || segments.length === 0 || segments.at(-1)?.kind === 'math') segments.push({ kind: 'text', value: value.slice(cursor) });
  return segments;
}

function serializeSegments(segments) {
  return segments.map((segment) => segment.kind === 'math' ? `$${segment.value}$` : segment.value).join('');
}

function VisualMathField({ latex, onChange, onRemove, composer = false }) {
  const fieldRef = useRef(null);
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return undefined;
    const handleInput = () => onChange(normalizeMathLatex(field.getValue('latex-unstyled')));
    field.value = latex;
    field.addEventListener('input', handleInput);
    return () => field.removeEventListener('input', handleInput);
  }, []);
  const insert = (snippet) => fieldRef.current?.insert(snippet, { focus: true });
  return <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-3" dir="ltr">
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2" dir="rtl"><span className="text-xs font-medium text-brand-700">{composer ? 'اكتب المعادلة ثم أضفها إلى النص' : 'معادلة مرئية — اضغط داخلها للكتابة أو لفتح لوحة الرموز'}</span>{onRemove && <button type="button" onClick={onRemove} className="text-xs text-danger-DEFAULT hover:underline">حذف المعادلة</button>}</div>
    <math-field ref={fieldRef} virtual-keyboard-mode="onfocus" smart-fence aria-label="محرر معادلة رياضية" style={{ display: 'block', minHeight: '3rem', width: '100%', border: '1px solid var(--color-surface-border, #d1d5db)', borderRadius: '0.5rem', background: 'white', padding: '0.5rem 0.75rem', fontSize: '1.35rem' }} />
    <div className="mt-2 flex flex-wrap gap-1" role="toolbar" aria-label="اختصارات المعادلة">{QUICK_SYMBOLS.map((symbol) => <button key={symbol.label} type="button" title={symbol.title} onClick={() => insert(symbol.latex)} className="rounded border border-surface-border bg-surface-default px-2 py-1 text-sm font-semibold text-ink-800 hover:border-brand-500 hover:text-brand-700">{symbol.label}</button>)}{ARABIC_SYMBOLS.map((symbol) => <button key={symbol.label} type="button" title={symbol.title} onClick={() => insert(symbol.latex)} className="rounded border border-surface-border bg-surface-default px-2 py-1 text-sm font-semibold text-ink-800 hover:border-brand-500 hover:text-brand-700">{symbol.label}</button>)}</div>
  </div>;
}
VisualMathField.propTypes = { latex: PropTypes.string.isRequired, onChange: PropTypes.func.isRequired, onRemove: PropTypes.func, composer: PropTypes.bool };

export default function MathEquationInput({ label, value, onChange, placeholder, error, maxLength = 1000 }) {
  const segments = parseSegments(value);
  const textRefs = useRef({});
  const [insertion, setInsertion] = useState(null);
  const [draftEquation, setDraftEquation] = useState('');
  const replaceSegments = (nextSegments) => {
    const nextValue = serializeSegments(nextSegments);
    if (nextValue.length <= maxLength) onChange(nextValue);
  };
  const updateSegment = (index, nextValue) => replaceSegments(segments.map((segment, segmentIndex) => segmentIndex === index ? { ...segment, value: nextValue } : segment));
  const removeMath = (index) => replaceSegments(segments.filter((_, segmentIndex) => segmentIndex !== index));
  const openEquationComposer = (index) => {
    const textarea = textRefs.current[index];
    const text = segments[index]?.value || '';
    const start = textarea?.selectionStart ?? text.length;
    const end = textarea?.selectionEnd ?? text.length;
    setInsertion({ index, start, end });
    setDraftEquation('');
  };
  const addEquationToText = () => {
    if (!insertion || !draftEquation.trim()) return;
    const text = segments[insertion.index]?.value || '';
    replaceSegments([...segments.slice(0, insertion.index), { kind: 'text', value: text.slice(0, insertion.start) }, { kind: 'math', value: draftEquation }, { kind: 'text', value: text.slice(insertion.end) }, ...segments.slice(insertion.index + 1)]);
    setInsertion(null);
    setDraftEquation('');
  };
  return <div className="space-y-2"><label className="block text-sm text-ink-700">{label}</label><p className="text-xs text-ink-500">اكتب النص كالمعتاد، ثم اضغط «أضف معادلة»؛ لن تظهر أوامر LaTeX.</p><div className={`space-y-3 rounded-xl border p-3 ${error ? 'border-danger-DEFAULT' : 'border-surface-border'}`} dir="rtl">{segments.map((segment, index) => segment.kind === 'math'
    ? <VisualMathField key={`math-${index}`} latex={segment.value} onChange={(nextValue) => updateSegment(index, nextValue)} onRemove={() => removeMath(index)} />
    : <div key={`text-${index}`} className="space-y-1"><textarea ref={(element) => { textRefs.current[index] = element; }} value={segment.value} onChange={(event) => updateSegment(index, event.target.value)} placeholder={placeholder} rows={segment.value.includes('\n') ? 3 : 2} className="w-full resize-y rounded-md border border-surface-border bg-surface-default px-3 py-2 text-sm text-ink-900 outline-none focus:ring-2 focus:ring-brand-500" /><button type="button" onClick={() => openEquationComposer(index)} className="text-xs font-medium text-brand-700 hover:underline">+ أضف معادلة</button></div>)}{insertion && <div className="space-y-3 border-t border-surface-border pt-3"><VisualMathField latex={draftEquation} onChange={setDraftEquation} composer /><p className="text-xs text-ink-500">اكتبي المعادلة في المربع أعلاه أو اختاري رمزًا؛ بعدها يتفعّل زر الإضافة.</p><div className="flex flex-wrap gap-2"><button type="button" onClick={addEquationToText} disabled={!draftEquation.trim()} className="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">إضافة المعادلة إلى النص</button><button type="button" onClick={() => setInsertion(null)} className="rounded-md border border-surface-border bg-surface-default px-3 py-2 text-sm text-ink-700">إلغاء</button></div></div>}</div>{error && <p className="text-xs text-danger-DEFAULT">{error}</p>}</div>;
}
MathEquationInput.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.string.isRequired, onChange: PropTypes.func.isRequired, placeholder: PropTypes.string, error: PropTypes.string, maxLength: PropTypes.number };
