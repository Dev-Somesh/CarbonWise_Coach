import React from 'react';

export type TextPart = { type: 'text' | 'bold'; content: string };

function parseBoldParts(text: string): TextPart[] {
  const parts: TextPart[] = [];
  const re = /\*\*(.*?)\*\*/g;
  let last = 0;
  let match;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: 'text', content: text.slice(last, match.index) });
    parts.push({ type: 'bold', content: match[1] });
    last = re.lastIndex;
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) });
  return parts;
}

function renderParts(parts: TextPart[]) {
  return parts.map((p, i) =>
    p.type === 'bold'
      ? <strong key={i} className="font-extrabold text-emerald-400">{p.content}</strong>
      : <React.Fragment key={i}>{p.content}</React.Fragment>
  );
}

export function renderFormattedText(raw: string): React.ReactNode[] {
  return raw.split('\n').map((line, i) => {
    if (line.trim().startsWith('###')) {
      return <h4 key={i} className="text-sm font-bold text-emerald-300 mt-3 mb-1">{line.replace('###', '').trim()}</h4>;
    }
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      const clean = line.replace(/^[\s*-]+/, '');
      return (
        <li key={i} className="list-disc ml-5 text-xs sm:text-sm text-slate-300 leading-relaxed my-1">
          {renderParts(parseBoldParts(clean))}
        </li>
      );
    }
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-xs sm:text-sm text-slate-300 leading-relaxed my-1">
        {renderParts(parseBoldParts(line))}
      </p>
    );
  });
}
