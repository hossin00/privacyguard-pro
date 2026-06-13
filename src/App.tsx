import { useState } from 'react';
import { Shield, Eye, Lock, CheckCircle, AlertTriangle, X, ChevronRight, RefreshCw } from 'lucide-react';
import { ai } from './utils/ai';

interface Check { id:string; title:string; desc:string; risk:'high'|'medium'|'low'; checked:boolean; tip:string; }

const CHECKS: Check[] = [
  {id:'1',title:'Browser location access',desc:'Websites can track your exact location',risk:'high',checked:false,tip:'Revoke location permission in browser settings → Site Settings → Location'},
  {id:'2',title:'Camera & microphone',desc:'Apps may access without clear indication',risk:'high',checked:false,tip:'Check Settings → Privacy → Camera/Microphone and disable for untrusted apps'},
  {id:'3',title:'Third-party cookies',desc:'Advertisers track you across all websites',risk:'high',checked:false,tip:'Enable "Block third-party cookies" in your browser privacy settings'},
  {id:'4',title:'Search history',desc:'Search engines build detailed profiles',risk:'medium',checked:false,tip:'Use private mode or switch to DuckDuckGo for private searches'},
  {id:'5',title:'Autofill passwords',desc:'Saved passwords can be at risk',risk:'medium',checked:false,tip:'Use a dedicated password manager instead of browser autofill'},
  {id:'6',title:'Notification permissions',desc:'Too many apps have notification access',risk:'low',checked:false,tip:'Review Settings → Notifications and disable for non-essential apps'},
  {id:'7',title:'App background activity',desc:'Apps run and collect data in background',risk:'medium',checked:false,tip:'Disable background refresh for apps that don\'t need it in Settings'},
  {id:'8',title:'Social login buttons',desc:'"Login with Google/Facebook" tracks behavior',risk:'medium',checked:false,tip:'Create separate accounts with unique email aliases instead'},
  {id:'9',title:'Public WiFi usage',desc:'Unencrypted networks expose your traffic',risk:'high',checked:false,tip:'Use a VPN on public WiFi or stick to HTTPS sites only'},
  {id:'10',title:'Two-factor authentication',desc:'Accounts without 2FA are vulnerable',risk:'high',checked:false,tip:'Enable 2FA on all important accounts: email, banking, social media'},
];

export default function App() {
  const [checks, setChecks] = useState<Check[]>(() => {
    try { return JSON.parse(localStorage.getItem('pg_checks')||'null')||CHECKS; } catch { return CHECKS; }
  });
  const [aiTip, setAiTip]   = useState('');
  const [aiLoad, setAiL]    = useState(false);
  const [filter, setFilter] = useState<'all'|'high'|'medium'|'low'>('all');

  const toggle = (id: string) => {
    const updated = checks.map(c => c.id===id?{...c,checked:!c.checked}:c);
    setChecks(updated);
    localStorage.setItem('pg_checks', JSON.stringify(updated));
  };

  const score = Math.round((checks.filter(c=>c.checked).length/checks.length)*100);
  const scoreColor = score >= 80?'#10b981':score>=50?'#f59e0b':'#ef4444';
  const remaining = checks.filter(c=>!c.checked);
  const filtered = filter==='all'?checks:checks.filter(c=>c.risk===filter);

  const getAdvice = async () => {
    setAiL(true);
    const issues = remaining.slice(0,4).map(c=>c.title).join(', ');
    const res = await ai(`Give 2-3 specific, actionable privacy tips for someone who hasn't fixed: ${issues}`, 'You are a privacy expert. Give brief, practical tips. Use bullet points starting with •');
    setAiTip(res); setAiL(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'16px 20px',borderBottom:'1px solid #1e1b2e',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#8b5cf6,#6d28d9)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px #8b5cf630'}}><Shield size={16} color="white"/></div>
          <div><div style={{fontWeight:'700',fontSize:'16px',color:'white',lineHeight:1}}>PrivacyGuard</div>
          <div style={{fontSize:'11px',color:'#4c1d95',marginTop:'2px'}}>Privacy Score: <span style={{color:scoreColor,fontWeight:'600'}}>{score}%</span></div></div>
        </div>
      </header>

      <div style={{flex:1,overflow:'auto',padding:'16px 20px'}}>
        {/* Score ring */}
        <div style={{textAlign:'center',marginBottom:'20px',padding:'20px',background:'#14101e',border:'1px solid #1e1b2e',borderRadius:'16px'}}>
          <div style={{fontSize:'48px',fontWeight:'700',color:scoreColor,marginBottom:'4px'}}>{score}%</div>
          <div style={{fontSize:'13px',color:'#4c1d95',marginBottom:'8px'}}>Privacy Score</div>
          <div style={{height:'6px',background:'#1e1b2e',borderRadius:'3px',overflow:'hidden',maxWidth:'200px',margin:'0 auto 12px'}}>
            <div style={{width:`${score}%`,height:'100%',background:scoreColor,borderRadius:'3px',transition:'width 0.5s ease'}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px'}}>
            {(['high','medium','low'] as const).map(r=>{
              const cnt = checks.filter(c=>c.risk===r&&!c.checked).length;
              const colors = {high:'#ef4444',medium:'#f59e0b',low:'#10b981'};
              return <div key={r} style={{background:colors[r]+'10',border:`1px solid ${colors[r]}20`,borderRadius:'8px',padding:'8px',cursor:'pointer'}} onClick={()=>setFilter(filter===r?'all':r)}>
                <div style={{fontSize:'16px',fontWeight:'700',color:colors[r]}}>{cnt}</div>
                <div style={{fontSize:'10px',color:colors[r]+'90',textTransform:'capitalize'}}>{r} risk</div>
              </div>;
            })}
          </div>
        </div>

        {/* AI tip */}
        <button onClick={getAdvice} disabled={aiLoad||remaining.length===0} style={{display:'flex',alignItems:'center',gap:'8px',width:'100%',padding:'12px 16px',borderRadius:'12px',background:'#8b5cf615',border:'1px solid #8b5cf625',color:'#c4b5fd',fontSize:'13px',fontWeight:'500',cursor:'pointer',fontFamily:'Inter',marginBottom:'14px',transition:'all 0.2s'}}>
          {aiLoad?<RefreshCw size={14} style={{animation:'spin 1s linear infinite'}}/>:<Shield size={14}/>}
          Get AI privacy recommendations
        </button>
        {aiTip&&<div style={{padding:'14px',borderRadius:'12px',background:'#8b5cf610',border:'1px solid #8b5cf625',marginBottom:'14px',fontSize:'13px',color:'#c4b5fd',lineHeight:'1.7',whiteSpace:'pre-wrap'}}>{aiTip}</div>}

        {/* Checklist */}
        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          {filtered.map(c=>{
            const colors={high:'#ef4444',medium:'#f59e0b',low:'#10b981'};
            const col=colors[c.risk];
            return <div key={c.id} style={{background:'#14101e',border:`1px solid ${c.checked?col+'30':'#1e1b2e'}`,borderRadius:'12px',padding:'14px',transition:'all 0.2s',cursor:'pointer'}} onClick={()=>toggle(c.id)}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'10px'}}>
                <div style={{width:'22px',height:'22px',borderRadius:'50%',border:`2px solid ${c.checked?col:'#2d2b3e'}`,background:c.checked?col+'20':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:'1px',transition:'all 0.2s'}}>
                  {c.checked&&<div style={{width:'8px',height:'8px',borderRadius:'50%',background:col}}/>}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'3px'}}>
                    <span style={{fontSize:'13px',fontWeight:'500',color:c.checked?'#6b7280':'white',textDecoration:c.checked?'line-through':'none'}}>{c.title}</span>
                    <span style={{fontSize:'10px',padding:'1px 6px',borderRadius:'4px',background:col+'20',color:col,textTransform:'uppercase',fontWeight:'600'}}>{c.risk}</span>
                  </div>
                  <div style={{fontSize:'12px',color:'#4c1d95'}}>{c.desc}</div>
                  {!c.checked&&<div style={{fontSize:'11px',color:'#6b5fa0',marginTop:'5px',lineHeight:'1.5'}}>💡 {c.tip}</div>}
                </div>
              </div>
            </div>;
          })}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}