import React from 'react';
import { EDITOR_SECTIONS, isSectionFilled } from './editorConfig';
import { EditorSectionId, ResumeDocument } from '../../types/resume';

interface EditorSectionNavProps {
  activeSectionId: EditorSectionId;
  document: ResumeDocument;
  onSelectSection: (sectionId: EditorSectionId) => void;
}

export const EditorSectionNav: React.FC<EditorSectionNavProps> = ({
  activeSectionId,
  document,
  onSelectSection,
}) => {
  return (
    <nav
      aria-label="Seções do currículo"
      className="border-b border-ink bg-ivory-warm/50 px-4 sm:px-6 py-2.5 overflow-x-auto"
    >
      <div className="flex items-center gap-1.5 min-w-max">
        {EDITOR_SECTIONS.map((sec) => {
          const isActive = activeSectionId === sec.id;
          const isFilled = isSectionFilled(document, sec.id);

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              aria-current={isActive ? 'step' : undefined}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-all duration-150 ${
                isActive
                  ? 'bg-ink text-ivory border-ink font-medium shadow-xs'
                  : 'bg-ivory text-ink border-paper hover:border-ink hover:bg-ivory-warm'
              }`}
            >
              <span
                className={`font-mono text-[10px] ${
                  isActive ? 'text-vermilion' : 'text-ink-subtle group-hover:text-vermilion'
                }`}
              >
                {sec.number}
              </span>
              <span>{sec.shortTitle}</span>
              {isFilled && (
                <span
                  className={`h-1.5 w-1.5 rounded-full inline-block ${
                    isActive ? 'bg-vermilion' : 'bg-ink/60'
                  }`}
                  title="Seção com informações preenchidas"
                  aria-label="preenchida"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
