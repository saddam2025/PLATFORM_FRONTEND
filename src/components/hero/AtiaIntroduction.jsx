import React from 'react';
import { Star } from 'lucide-react';
import Button from '../ui/Button';
import GeometricHero from './GeometricHero';
import './AtiaIntroduction.css';

export default function AtiaIntroduction({ showActions = false, onPrimary, onSecondary, primaryLabel = 'ابدأ دلوقتي', secondaryLabel = 'شوف المحتوى' }) {
  return (
    <section className="atia-intro" dir="ltr">
      <div className="atia-intro__art">
        <GeometricHero artworkOnly personSrc="/assets/instructor-transparent.png" personAlt="مستر عطية كامل" />
      </div>
      <div className="atia-intro__copy" dir="rtl">
        <span className="atia-intro__badge">كلمة من المستر</span>
        <h1 className="atia-intro__title">مستر عطية كامل</h1>
        <h2 className="atia-intro__lead">20 سنة خبرة في تدريس الرياضيات… وخبرة أكبر في فهم الطالب.</h2>
        <div className="atia-intro__paragraphs">
          <p>مستر عطية كامل، مدرس رياضيات بخبرة تمتد لأكثر من 20 عامًا في تدريس طلاب المرحلة الثانوية، ومناهج البكالوريا والثانوية العامة والأزهر الشريف.</p>
          <p>على مدار السنين، كانت الفكرة الأساسية عنده دايمًا واحدة:</p>
          <p className="atia-intro__emphasis">الرياضيات مش حفظ قوانين… الرياضيات فهم وطريقة تفكير.</p>
        </div>
        <p className="atia-intro__signature">مستر عطية كامل <span>مدرس الرياضيات</span></p>
        <blockquote className="atia-intro__quote"><Star size={20} aria-hidden="true" /><p>«اشتغل على نفسك، وخد بالأسباب…<br />واللي بيتعب النهارده، بكرة هيشوف نتيجة تعبه»</p></blockquote>
        {showActions && <div className="atia-intro__actions">
          <Button size="lg" onClick={onPrimary}>{primaryLabel}</Button>
          <Button variant="ghost" size="lg" className="!bg-white/10 !text-white hover:!bg-white/20" onClick={onSecondary}>{secondaryLabel}</Button>
        </div>}
      </div>
    </section>
  );
}
