'use client';

import './SiteBackground.css';

export function SiteBackground() {
  return (
    <div className="premium-background">
      {/* Deep navy base with subtle gradient */}
      <div className="bg-layer bg-base" />
      
      {/* Radial glow layers for depth */}
      <div className="bg-layer bg-glow-teal-1" />
      <div className="bg-layer bg-glow-teal-2" />
      <div className="bg-layer bg-glow-green" />
      <div className="bg-layer bg-glow-orange" />
      
      {/* Atmospheric overlay with grain */}
      <div className="bg-layer bg-atmosphere" />
      
      {/* Floating light particles (anime-inspired) */}
      <div className="particle particle-1" />
      <div className="particle particle-2" />
      <div className="particle particle-3" />
      <div className="particle particle-4" />
      <div className="particle particle-5" />
      
      {/* Subtle light beams */}
      <div className="light-beam beam-1" />
      <div className="light-beam beam-2" />
      
      {/* Gradient mesh overlay for premium feel */}
      <div className="bg-layer bg-mesh" />
      
      {/* Final light fade for sections */}
      <div className="bg-layer bg-fade-to-light" />
    </div>
  );
}
