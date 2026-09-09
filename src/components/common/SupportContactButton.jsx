import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import instructorService from '../../services/instructorService';

function whatsappUrl(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  const localNumber = digits.startsWith('20') ? digits.slice(2) : digits;
  const numberWithoutLeadingZero = localNumber.replace(/^0+/, '');
  return numberWithoutLeadingZero ? `https://wa.me/2${numberWithoutLeadingZero}` : null;
}

export default function SupportContactButton() {
  const { instructorId } = useParams();
  const [supportPhone, setSupportPhone] = useState('');

  useEffect(() => {
    let active = true;
    setSupportPhone('');
    if (!instructorId) return () => { active = false; };

    instructorService.get(instructorId)
      .then((response) => { if (active) setSupportPhone(response.data?.supportPhone || ''); })
      .catch(() => { if (active) setSupportPhone(''); });

    return () => { active = false; };
  }, [instructorId]);

  const href = whatsappUrl(supportPhone);
  if (!href) return null;

  return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`تواصل عبر واتساب: ${supportPhone}`} title={`تواصل عبر واتساب: ${supportPhone}`} className="fixed bottom-6 left-6 z-20 grid h-16 w-16 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"><MessageCircle size={32} fill="currentColor" strokeWidth={2.5} aria-hidden="true" /></a>;
}
