export const STAGES = [
  { id: 'grade-7', label: 'اولى اعدادي' },
  { id: 'grade-8', label: 'تانية اعدادي' },
  { id: 'grade-9', label: 'تالتة اعدادي' },
  { id: 'grade-10', label: 'اولى ثانوي' },
  { id: 'baccalaureate-1', label: 'أولى بكالوريا' },
  { id: 'baccalaureate-2', label: 'تانية بكالوريا' },
  { id: 'grade-11', label: 'تانية ثانوي' },
  { id: 'grade-12', label: 'تالتة ثانوي' }
];

export const stageLabel = (stage) => STAGES.find((item) => item.id === stage)?.label || stage;
