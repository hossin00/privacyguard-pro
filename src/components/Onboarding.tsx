import { useState } from 'react';
const SLIDES = [{"accent": "#8b5cf6", "icon": "\ud83d\udeab", "title": "Know who's\nwatching you", "desc": "PrivacyGuard reveals all active permissions on your device \u2014 and helps you take control."}, {"accent": "#8b5cf6", "icon": "\ud83d\udee1\ufe0f", "title": "Block trackers\ninstantly", "desc": "Identify and disable unnecessary permissions that expose your location, camera, and contacts."}, {"accent": "#8b5cf6", "icon": "\u2705", "title": "Your privacy\nchecklist", "desc": "A guided checklist to harden your digital privacy step by step. Simple, clear, actionable."}];
export function Onboarding({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#0a0a0f', overflow:'hidden', position:'relative' }}>
      <div style={{ position:'absolute', top:'-10%', left:'50%', transform:'translateX(-50%)', width:'350px', height:'350px',
        borderRadius:'50%', background:slide.accent+'0a', filter:'blur(80px)', transition:'background 0.5s', pointerEvents:'none' }}/>
      <div style={{ padding:'20px 24px', display:'flex', justifyContent:'flex-end' }}>
        <button onClick={onDone} style={{ color:'#8b5cf660', fontSize:'14px', background:'none', border:'none', cursor:'pointer', fontFamily:'Inter, sans-serif' }}>Skip</button>
      </div>
      <div key={idx} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'20px 32px', textAlign:'center', animation:'slideIn 0.35s ease' }}>
        <div style={{ width:'100px', height:'100px', borderRadius:'28px',
          background:slide.accent+'15', border:`1px solid ${slide.accent}30`,
          display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'32px',
          boxShadow:`0 12px 40px ${slide.accent}15`, fontSize:'48px' }}>
          {slide.icon}
        </div>
        <h2 style={{ fontFamily:'Inter, sans-serif', fontWeight:'700', fontSize:'30px', lineHeight:'1.2',
          color:'white', marginBottom:'16px', whiteSpace:'pre-line' }}>{slide.title}</h2>
        <p style={{ color:'#8b5cf680', fontSize:'15px', lineHeight:'1.7', maxWidth:'280px' }}>{slide.desc}</p>
      </div>
      <div style={{ padding:'16px 24px 44px' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginBottom:'20px' }}>
          {SLIDES.map((_,i)=><button key={i} onClick={()=>setIdx(i)}
            style={{ width:i===idx?'24px':'6px', height:'6px', borderRadius:'3px',
              background:i===idx?slide.accent:'#ffffff15', border:'none', cursor:'pointer', padding:0, transition:'all 0.3s' }}/>)}
        </div>
        <button onClick={()=>idx===SLIDES.length-1?onDone():setIdx(idx+1)}
          style={{ width:'100%', padding:'16px', background:slide.accent, color:'white', border:'none',
            borderRadius:'14px', fontSize:'16px', fontWeight:'600', cursor:'pointer',
            fontFamily:'Inter, sans-serif', boxShadow:`0 8px 24px ${slide.accent}40`, transition:'all 0.2s' }}>
          {idx===SLIDES.length-1?'Get started →':'Continue'}
        </button>
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}
