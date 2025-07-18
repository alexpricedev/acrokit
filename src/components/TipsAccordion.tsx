import { useState } from 'react';

interface TipsAccordionProps {
  flyerTips?: string[];
  baseTips?: string[];
  spotterTips?: string[];
}

interface TipSection {
  title: string;
  icon: string;
  tips: string[];
  color: string;
}

export function TipsAccordion({
  flyerTips,
  baseTips,
  spotterTips,
}: TipsAccordionProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const sections: TipSection[] = [
    {
      title: 'Flyer Tips',
      icon: '🕊️',
      tips: flyerTips || [],
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'Base Tips',
      icon: '🏔️',
      tips: baseTips || [],
      color: 'bg-green-50 border-green-200',
    },
    {
      title: 'Spotter Tips',
      icon: '👁️',
      tips: spotterTips || [],
      color: 'bg-amber-50 border-amber-200',
    },
  ];

  // Don't render if no tips are available
  const hasAnyTips = sections.some(section => section.tips.length > 0);
  if (!hasAnyTips) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 mb-3">💡 Tips & Techniques</h3>
      {sections.map((section, index) => {
        const sectionId = `section-${index}`;
        const isOpen = openSections.has(sectionId);
        const hasTips = section.tips.length > 0;

        return (
          <div key={sectionId} className={`border rounded-lg ${section.color}`}>
            <button
              onClick={() => toggleSection(sectionId)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-black/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium text-gray-900">
                  {section.title}
                </span>
                {hasTips && (
                  <span className="text-sm text-gray-500">
                    ({section.tips.length} tip
                    {section.tips.length !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="px-4 pb-4">
                {hasTips ? (
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li
                        key={tipIndex}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No tips available for {section.title.toLowerCase()}.
                    <br />
                    <span className="text-gray-400">
                      Have suggestions? Share them in the comments!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
