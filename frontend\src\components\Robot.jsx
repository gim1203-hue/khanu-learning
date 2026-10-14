import { useState } from 'react';
import { Palette, Sparkles } from 'lucide-react';

const colors = ['violet', 'mint', 'rose', 'blue'];
export default function Robot({ mode = 'idle', compact = false }) {
  const [color, setColor] = useState(() => localStorage.getItem('khanu-robot-color') || 'violet');
  const cycle = () => {
    const next = colors[(colors.indexOf(color) + 1) % colors.length];
    setColor(next); localStorage.setItem('khanu-robot-color', next);
  };
  return <div className={`khanu-card ${compact ? 'compact' : ''}`}>
    <div className="robot-headline"><span className="robot-live"><i /> LIVE VIEW</span><button className="palette-button" onClick={cycle} title="Change Khanu's colors" aria-label="Change Khanu's colors"><Palette size={15} /></button></div>
    <div className="robot-scene" data-mode={mode} data-color={color} aria-label={`Khanu is ${mode}`}>
      <div className="robot-orbit orbit-a" /><div className="robot-orbit orbit-b" /><div className="bot-shadow" />
      <div className="bot"><div className="bot-antenna"><i /></div><div className="bot-ear left" /><div className="bot-ear right" />
        <div className="bot-head"><div className="bot-brow left" /><div className="bot-brow right" /><div className="bot-eyes"><i /><i /></div><div className="bot-cheek left" /><div className="bot-cheek right" /><div className="bot-mouth" /></div>
        <div className="bot-neck" /><div className="bot-body"><div className="bot-core"><Sparkles size={16} /></div><i /></div><div className="bot-arm left"><i /></div><div className="bot-arm right"><i /></div>
      </div><span className="bot-spark one">✦</span><span className="bot-spark two">✧</span>
    </div>
    <div className="robot-caption"><strong>Khanu</strong><span>{mode === 'thinking' ? 'Thinking with you…' : mode === 'speaking' ? 'Found a match!' : 'Your study buddy'}</span></div>
    <div className="voice-bars" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} />)}</div>
  </div>;
}
