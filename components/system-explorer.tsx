'use client';
import { useState } from 'react';
import { ArrowUpRight, Layers3, Network, Smartphone } from 'lucide-react';
const layers = [
  {
    label: 'Interface',
    name: 'Web + mobile',
    icon: Smartphone,
    detail:
      'Web dApp and mobile wallet. Different interfaces, one connected ecosystem.',
  },
  {
    label: 'Logic',
    name: 'Smart contracts',
    icon: Layers3,
    detail: 'Smart contracts connect product interactions with the blockchain.',
  },
  {
    label: 'Systems',
    name: 'Infrastructure',
    icon: Network,
    detail: 'Chain watchers, background workers and supporting infrastructure.',
  },
];
export function SystemExplorer() {
  const [active, setActive] = useState(0);
  return (
    <section
      className="system-explorer"
      aria-label="Explore the layers of Decentroneum"
    >
      <div className="system-top">
        <span className="tiny-label">SYSTEM STUDY / 001</span>
        <span className="system-status">
          <span /> DECENTRONEUM
        </span>
      </div>
      <div className="system-scene" aria-hidden="true">
        <div className="scene-axis axis-v" />
        <div className="scene-axis axis-h" />
        {[2, 1, 0].map((index) => {
          const Icon = layers[index].icon;
          return (
            <div
              key={index}
              className={`system-plane plane-${index} ${active === index ? 'plane-active' : ''}`}
            >
              <span className="plane-corner">0{index + 1}</span>
              <Icon size={36} strokeWidth={1} />
              <span>{layers[index].name}</span>
            </div>
          );
        })}
        <span className="scene-caption">INTERFACE → LOGIC → SYSTEMS</span>
      </div>
      <div className="system-tabs" aria-label="System layers">
        {layers.map((layer, index) => (
          <button
            key={layer.label}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <span>0{index + 1}</span>
            {layer.label}
          </button>
        ))}
      </div>
      <p className="system-detail" aria-live="polite">
        {layers[active].detail}
      </p>
      <a
        className="text-link"
        href="https://nippysky.com/ventures/decentroneum"
        target="_blank"
        rel="noreferrer"
      >
        Under the hood at NIPPYSKY <ArrowUpRight size={16} />
      </a>
    </section>
  );
}
