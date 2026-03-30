import { useState, useEffect, useRef } from "react";

/*
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * NICHE — Full Working Portal & App
 * "Ashley Madison for fetishes, across every industry"
 * Anonymous → Photos → Consent → Verify → Book
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const T = {
  color: {
    bg:"#FFFBF7",bgAlt:"#FFF5EC",bgWarm:"#FEF0E4",bgDark:"#1A1410",
    surface:"#FFFFFF",surfaceHover:"#FFF8F2",
    border:"#F0E4D8",borderLight:"#F5EDE5",borderFocus:"#E8734A",
    text:"#2D2016",textSoft:"#6B5B4E",textMuted:"#A89888",textInverse:"#FFFBF7",
    accent:"#E8734A",accentHover:"#D4623B",accentPressed:"#C05530",
    accentSoft:"rgba(232,115,74,0.10)",accentSofter:"rgba(232,115,74,0.05)",
    accentGlow:"rgba(232,115,74,0.20)",
    green:"#4CAF6E",greenSoft:"rgba(76,175,110,0.12)",
    red:"#E05252",redSoft:"rgba(224,82,82,0.10)",
    amber:"#D4A24C",amberSoft:"rgba(212,162,76,0.12)",
    purple:"#8B6CC1",purpleSoft:"rgba(139,108,193,0.10)",
    teal:"#3DAFA5",tealSoft:"rgba(61,175,165,0.10)",
    avatarGradients:[
      ["#E8734A","#FFB088"],["#8B6CC1","#C4A8F0"],["#3DAFA5","#7ED9D0"],
      ["#D4A24C","#F0D08C"],["#E06088","#F0A0B8"],["#5B8FD4","#98C0F0"],
      ["#7BC464","#B0E8A0"],["#D47850","#F0B090"],
    ],
  },
  font:{brand:"'Fraunces',Georgia,serif",body:"'DM Sans','Helvetica Neue',sans-serif",mono:"'JetBrains Mono',monospace"},
  fontSize:{xs:"11px",sm:"12px",base:"14px",md:"15px",lg:"17px",xl:"20px","2xl":"24px","3xl":"32px","4xl":"40px",hero:"clamp(32px,5vw,52px)"},
  fontWeight:{regular:400,medium:500,semi:600,bold:700,heavy:800},
  lineHeight:{tight:1.1,snug:1.3,normal:1.5,relaxed:1.65,loose:1.8},
  letterSpacing:{tight:"-0.02em",normal:"0",wide:"0.02em",wider:"0.06em",caps:"0.10em"},
  radius:{sm:"8px",md:"12px",lg:"16px",xl:"20px","2xl":"24px","3xl":"28px",full:"100px"},
  shadow:{sm:"0 1px 3px rgba(45,32,22,0.04)",md:"0 4px 12px rgba(45,32,22,0.06)",lg:"0 8px 24px rgba(45,32,22,0.08)",xl:"0 12px 40px rgba(45,32,22,0.12)",glow:"0 4px 16px rgba(232,115,74,0.25)",card:"0 2px 12px rgba(45,32,22,0.04)",cardHover:"0 12px 40px rgba(232,115,74,0.10)",modal:"0 24px 64px rgba(45,32,22,0.20)"},
  transition:{fast:"all 0.15s ease",base:"all 0.25s ease",slow:"all 0.4s ease"},
};

// ─── SEED DATA ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  {id:"barber",label:"Barber",emoji:"✂️"},{id:"massage",label:"Massage",emoji:"🤲"},
  {id:"facial",label:"Facials",emoji:"✨"},{id:"nails",label:"Nails",emoji:"💅"},
  {id:"wax",label:"Wax & Groom",emoji:"🪒"},{id:"touch",label:"Touch",emoji:"🫂"},
  {id:"dental",label:"Dental",emoji:"🦷"},{id:"trainer",label:"Trainer",emoji:"💪"},
  {id:"tailor",label:"Tailor",emoji:"📏"},{id:"photo",label:"Photography",emoji:"📸"},
  {id:"chiro",label:"Chiropractic",emoji:"🦴"},{id:"podiatry",label:"Foot Care",emoji:"🦶"},
];

const TAGS = [
  "Hair Cutting","Head Shave","Beard Play","Scalp Massage","Straight Razor","Hot Towel",
  "Deep Pressure","Light Touch","Oil Work","Foot Focus","Hand Focus","ASMR",
  "Blindfold OK","Verbal Guidance","Role Play","Latex Gloves","Sensory Play",
  "Temperature Play","Power Exchange","Worship","Body Mapping","Breath Work",
  "Dental Exam","Teeth Cleaning","Body Measurement","Spine Adjustment",
  "Clinical","Nurturing","Authoritative",
];

const BOUNDARY_TAGS = [
  "No Face Touching","No Disrobing","Clinical Only","Hands Only",
  "No Photography","Clothed Only","Quiet Environment",
];

const PROVIDERS = [
  {id:1,alias:"SteadyHands_303",initials:"SH",category:"barber",tagline:"Fetish-forward barber · 8 yrs",bio:"Slow, intentional haircuts for clients who find deep pleasure in the grooming ritual. Straight razor specialist. LGBTQ+ affirming. Every session is consent-first and sensory-rich.",tags:["Hair Cutting","Head Shave","Straight Razor","Hot Towel","ASMR"],boundaries:["No Disrobing"],rate:[80,110],rating:4.9,reviews:127,city:"Denver Metro",dist:4,vibe:"Patient & precise",responseTime:"< 1 hr",online:true,verified:true,bgCheck:true,consentCert:true,sessions:340,since:"2023",availability:["Mon","Wed","Fri","Sat"]},
  {id:2,alias:"SilkPressure",initials:"SP",category:"massage",tagline:"Licensed bodyworker · Kink-aware certified",bio:"Swedish, deep tissue, and sensual modalities. Your touch preferences are honored fully. Clear boundaries + open communication = extraordinary sessions. All orientations welcome.",tags:["Deep Pressure","Light Touch","Oil Work","Sensory Play","Body Mapping"],boundaries:["Clothed Only"],rate:[100,150],rating:4.8,reviews:89,city:"Denver Metro",dist:7,vibe:"Warm & intuitive",responseTime:"< 2 hrs",online:false,verified:true,bgCheck:true,consentCert:true,sessions:210,since:"2022",availability:["Tue","Thu","Sat","Sun"]},
  {id:3,alias:"GoldenTouch_CO",initials:"GT",category:"facial",tagline:"Esthetician · Sensation-focused facials",bio:"My facials maximize sensory engagement — textures, pressure, temperature. Every step is an experience. I welcome clients who find skin care deeply satisfying or arousing.",tags:["Light Touch","Temperature Play","ASMR","Sensory Play","Verbal Guidance"],boundaries:["No Disrobing","Quiet Environment"],rate:[75,95],rating:4.7,reviews:64,city:"Aurora",dist:12,vibe:"Gentle & precise",responseTime:"< 4 hrs",online:true,verified:true,bgCheck:false,consentCert:true,sessions:145,since:"2023",availability:["Mon","Tue","Wed","Thu","Fri"]},
  {id:4,alias:"BladeRitual",initials:"BR",category:"barber",tagline:"Old-school barber · Razor ritual specialist",bio:"Hot lather, blade on skin, the vulnerability of the chair — I understand why this matters. Extended straight-razor sessions with sensory add-ons. All genders.",tags:["Straight Razor","Hot Towel","Beard Play","Scalp Massage","Blindfold OK"],boundaries:["Clinical Only"],rate:[95,130],rating:5.0,reviews:43,city:"Lakewood",dist:9,vibe:"Confident & grounding",responseTime:"< 1 hr",online:false,verified:true,bgCheck:true,consentCert:true,sessions:180,since:"2021",availability:["Wed","Thu","Fri","Sat"]},
  {id:5,alias:"RootedPresence",initials:"RP",category:"touch",tagline:"Certified touch therapist · Consent educator",bio:"Professional platonic and sensual touch rooted in somatic consent. For the touch-deprived, boundary-curious, or anyone seeking specific sensory experiences in a safe container.",tags:["Light Touch","Deep Pressure","Body Mapping","Power Exchange","Verbal Guidance","Breath Work"],boundaries:["No Photography"],rate:[90,120],rating:4.9,reviews:71,city:"Boulder",dist:28,vibe:"Present & nurturing",responseTime:"< 2 hrs",online:true,verified:true,bgCheck:true,consentCert:true,sessions:290,since:"2022",availability:["Mon","Wed","Fri"]},
  {id:6,alias:"VelvetEdge",initials:"VE",category:"wax",tagline:"Body grooming artist · Fetish-friendly",bio:"Full-body waxing and grooming where your reasons don't need explaining. Whether it's the sensation, the aesthetic, or the vulnerability — I get it. Zero judgment.",tags:["Sensory Play","Latex Gloves","Body Mapping","Temperature Play"],boundaries:["Hands Only"],rate:[80,100],rating:4.6,reviews:38,city:"Denver Metro",dist:3,vibe:"Playful & professional",responseTime:"< 3 hrs",online:false,verified:true,bgCheck:true,consentCert:true,sessions:95,since:"2024",availability:["Tue","Thu","Sat"]},
  {id:7,alias:"PorcelainCare",initials:"PC",category:"dental",tagline:"Dental hygienist · Kink-aware practice",bio:"Extended dental cleanings and exams for clients who experience pleasure from oral care. Clinical precision in a judgment-free environment. Licensed and insured.",tags:["Dental Exam","Teeth Cleaning","Latex Gloves","Clinical","Verbal Guidance"],boundaries:["Clinical Only","Clothed Only"],rate:[120,180],rating:4.9,reviews:32,city:"Denver Metro",dist:6,vibe:"Clinical & attentive",responseTime:"< 4 hrs",online:false,verified:true,bgCheck:true,consentCert:true,sessions:78,since:"2024",availability:["Mon","Wed","Fri"]},
  {id:8,alias:"MeasureTwice",initials:"MT",category:"tailor",tagline:"Custom tailor · Fitting fetish friendly",bio:"Bespoke fittings where every measurement is taken with care and intention. I understand the intimacy of being measured. Private studio, unhurried sessions.",tags:["Body Measurement","Light Touch","Verbal Guidance","Nurturing"],boundaries:["No Photography","Quiet Environment"],rate:[100,160],rating:4.8,reviews:27,city:"Denver Metro",dist:5,vibe:"Meticulous & warm",responseTime:"< 6 hrs",online:false,verified:true,bgCheck:true,consentCert:true,sessions:62,since:"2024",availability:["Tue","Thu","Sat"]},
];

const TRUST_STAGES = [
  {key:"anonymous",emoji:"🔒",label:"Anonymous",desc:"Messaging behind aliases"},
  {key:"photos",emoji:"📸",label:"Photos",desc:"Mutual photo exchange"},
  {key:"consent",emoji:"🤝",label:"Consent",desc:"Signed activity agreement"},
  {key:"verified",emoji:"🔐",label:"Verified",desc:"ID verification complete"},
  {key:"booking",emoji:"📅",label:"Booking",desc:"Address shared, session booked"},
];

// ─── PRIMITIVES ─────────────────────────────────────────────────────────────
function Avatar({initials,size=48,idx=0,online,photo}){
  const [c1,c2]=T.color.avatarGradients[idx%T.color.avatarGradients.length];
  if(photo) return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:size>60?T.radius.xl:T.radius.lg,background:`url(${photo}) center/cover`,border:`2px solid ${T.color.border}`}}/>
      {online&&<div style={{position:"absolute",bottom:-1,right:-1,width:size*.24,height:size*.24,borderRadius:"50%",background:T.color.teal,border:`2px solid ${T.color.surface}`}}/>}
    </div>
  );
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:size>60?T.radius.xl:T.radius.lg,background:`linear-gradient(135deg,${c1},${c2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.3,fontWeight:T.fontWeight.heavy,color:"#fff",letterSpacing:T.letterSpacing.wider}}>{initials}</div>
      {online&&<div style={{position:"absolute",bottom:-1,right:-1,width:size*.24,height:size*.24,borderRadius:"50%",background:T.color.teal,border:`2px solid ${T.color.surface}`}}/>}
    </div>
  );
}

function Badge({children,variant="default",style={}}){
  const v={
    default:{bg:T.color.bgAlt,color:T.color.textMuted,border:T.color.borderLight},
    accent:{bg:T.color.accentSoft,color:T.color.accent,border:T.color.accent+"25"},
    green:{bg:T.color.greenSoft,color:T.color.green,border:T.color.green+"30"},
    red:{bg:T.color.redSoft,color:T.color.red,border:T.color.red+"30"},
    purple:{bg:T.color.purpleSoft,color:T.color.purple,border:T.color.purple+"30"},
    amber:{bg:T.color.amberSoft,color:T.color.amber,border:T.color.amber+"30"},
  };
  const s=v[variant]||v.default;
  return <span style={{display:"inline-flex",alignItems:"center",padding:"4px 11px",borderRadius:T.radius.full,fontSize:T.fontSize.sm,fontWeight:T.fontWeight.semi,color:s.color,background:s.bg,border:`1px solid ${s.border}`,whiteSpace:"nowrap",letterSpacing:T.letterSpacing.wide,...style}}>{children}</span>;
}

function Btn({variant="primary",size="md",children,onClick,disabled,full,style={}}){
  const styles={primary:{bg:T.color.accent,c:"#fff",b:"none",h:T.color.accentHover,s:T.shadow.glow},secondary:{bg:"transparent",c:T.color.textSoft,b:`1.5px solid ${T.color.border}`,h:T.color.surfaceHover,s:"none"},ghost:{bg:"transparent",c:T.color.accent,b:"none",h:T.color.accentSoft,s:"none"},danger:{bg:T.color.red,c:"#fff",b:"none",h:"#C84040",s:"0 4px 16px rgba(224,82,82,0.25)"}};
  const sizes={sm:{p:"8px 14px",f:T.fontSize.sm,r:T.radius.sm},md:{p:"12px 20px",f:T.fontSize.base,r:T.radius.md},lg:{p:"16px 28px",f:"16px",r:T.radius.lg},xl:{p:"18px 32px",f:T.fontSize.lg,r:T.radius.lg}};
  const st=styles[variant];const sz=sizes[size];const[hov,setHov]=useState(false);
  return <button type="button" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick} disabled={disabled} style={{background:disabled?T.color.border:hov?st.h:st.bg,color:disabled?T.color.textMuted:st.c,border:st.b,borderRadius:sz.r,padding:sz.p,fontSize:sz.f,fontWeight:T.fontWeight.bold,fontFamily:T.font.body,cursor:disabled?"not-allowed":"pointer",transition:T.transition.base,letterSpacing:T.letterSpacing.wide,boxShadow:hov&&!disabled?st.s:"none",opacity:disabled?.5:1,width:full?"100%":"auto",...style}}>{children}</button>;
}

function Input({label,placeholder,value,onChange,type="text",icon}){
  const[focused,setFocused]=useState(false);
  return(
    <div style={{flex:1,minWidth:"180px"}}>
      {label&&<label style={{display:"block",fontSize:T.fontSize.sm,fontWeight:T.fontWeight.bold,color:T.color.textSoft,marginBottom:"6px"}}>{label}</label>}
      <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange?.(e.target.value)}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{width:"100%",padding:"13px 16px",borderRadius:T.radius.md,fontSize:T.fontSize.base,fontFamily:T.font.body,background:focused?T.color.surface:T.color.bgAlt,border:`1.5px solid ${focused?T.color.borderFocus:T.color.border}`,color:T.color.text,outline:"none",boxSizing:"border-box",transition:T.transition.base,boxShadow:focused?`0 0 0 3px ${T.color.accentSoft}`:"none"}}/>
    </div>
  );
}

function TagChip({label,active,onClick}){
  return <button type="button" onClick={onClick} style={{padding:"6px 14px",borderRadius:T.radius.full,fontSize:T.fontSize.sm,fontWeight:T.fontWeight.semi,fontFamily:T.font.body,cursor:"pointer",transition:T.transition.fast,border:"none",background:active?T.color.accentSoft:"transparent",color:active?T.color.accent:T.color.textMuted,outline:`1px solid ${active?T.color.accent+"30":T.color.border}`}}>{label}</button>;
}

function SectionLabel({children}){return <div style={{fontSize:T.fontSize.xs,fontWeight:T.fontWeight.bold,color:T.color.textMuted,textTransform:"uppercase",letterSpacing:T.letterSpacing.caps,marginBottom:"10px"}}>{children}</div>;}

function Stat({value,label}){return <div style={{textAlign:"center"}}><div style={{fontSize:T.fontSize["2xl"],fontWeight:T.fontWeight.heavy,color:T.color.text,fontFamily:T.font.brand}}>{value}</div><div style={{fontSize:T.fontSize.xs,color:T.color.textMuted,marginTop:"2px"}}>{label}</div></div>;}

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
function GlobalStyles(){return <style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,800;1,9..144,400&display=swap');
  *{box-sizing:border-box;margin:0;}body{background:${T.color.bg};}
  ::selection{background:${T.color.accent};color:#fff;}
  input:focus,textarea:focus{border-color:${T.color.borderFocus}!important;}
  ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-thumb{background:${T.color.border};border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pop{0%{transform:scale(.85);opacity:0}60%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
  .fade-up{animation:fadeUp .5s ease both}.pop{animation:pop .4s ease both}
  .stagger-1{animation-delay:.05s}.stagger-2{animation-delay:.1s}.stagger-3{animation-delay:.15s}.stagger-4{animation-delay:.2s}.stagger-5{animation-delay:.25s}
  textarea{font-family:${T.font.body};resize:vertical;}
`}</style>;}

// ─── NAV ────────────────────────────────────────────────────────────────────
function Nav({currentView,setView,isProvider,userAlias}){
  return(
    <header style={{borderBottom:`1px solid ${T.color.border}`,padding:"12px 24px",position:"sticky",top:0,zIndex:50,background:"rgba(255,251,247,0.92)",backdropFilter:"blur(16px)"}}>
      <div style={{maxWidth:"1200px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div onClick={()=>setView("marketplace")} style={{cursor:"pointer",display:"flex",alignItems:"baseline",gap:"8px"}}>
          <span style={{fontFamily:T.font.brand,fontSize:"26px",fontWeight:T.fontWeight.heavy,color:T.color.accent,letterSpacing:T.letterSpacing.tight}}>niche</span>
          <span style={{fontSize:T.fontSize.xs,color:T.color.textMuted,letterSpacing:T.letterSpacing.caps,textTransform:"uppercase"}}>find your thing</span>
        </div>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          {["marketplace","connections","bookings"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{padding:"7px 14px",borderRadius:T.radius.sm,fontSize:T.fontSize.sm,fontWeight:currentView===v?T.fontWeight.bold:T.fontWeight.medium,border:"none",cursor:"pointer",background:currentView===v?T.color.accentSoft:"transparent",color:currentView===v?T.color.accent:T.color.textMuted,transition:T.transition.fast,textTransform:"capitalize"}}>{v==="marketplace"?"Explore":v}</button>
          ))}
          {isProvider&&<button onClick={()=>setView("dashboard")} style={{padding:"7px 14px",borderRadius:T.radius.sm,fontSize:T.fontSize.sm,fontWeight:currentView==="dashboard"?T.fontWeight.bold:T.fontWeight.medium,border:"none",cursor:"pointer",background:currentView==="dashboard"?T.color.accentSoft:"transparent",color:currentView==="dashboard"?T.color.accent:T.color.textMuted,transition:T.transition.fast}}>Dashboard</button>}
          <div style={{width:"32px",height:"32px",borderRadius:T.radius.sm,background:T.color.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:`1px solid ${T.color.accent}25`,marginLeft:"4px"}}>
            <Avatar initials={userAlias?.slice(0,2).toUpperCase()||"ME"} size={28} idx={3}/>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── LANDING PAGE ───────────────────────────────────────────────────────────
function LandingPage({onGetStarted}){
  return(
    <div style={{minHeight:"100vh",background:T.color.bg,fontFamily:T.font.body}}>
      <div style={{maxWidth:"1100px",margin:"0 auto",padding:"0 24px"}}>
        <div style={{padding:"80px 0 60px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"48px",alignItems:"center",minHeight:"80vh"}}>
          <div className="fade-up">
            <div style={{marginBottom:"24px"}}>
              <span style={{fontFamily:T.font.brand,fontSize:"48px",fontWeight:T.fontWeight.heavy,color:T.color.accent,letterSpacing:T.letterSpacing.tight}}>niche</span>
              <span style={{fontSize:T.fontSize.sm,color:T.color.textMuted,letterSpacing:T.letterSpacing.caps,textTransform:"uppercase",marginLeft:"12px"}}>find your thing</span>
            </div>
            <h1 style={{fontFamily:T.font.brand,fontSize:T.fontSize.hero,fontWeight:T.fontWeight.heavy,lineHeight:T.lineHeight.tight,color:T.color.text,margin:"0 0 16px 0",letterSpacing:T.letterSpacing.tight}}>
              Your desires.<br/><span style={{color:T.color.accent}}>Their expertise.</span><br/>Total discretion.
            </h1>
            <p style={{fontSize:T.fontSize.lg,color:T.color.textSoft,lineHeight:T.lineHeight.relaxed,margin:"0 0 32px 0",maxWidth:"440px"}}>
              Anonymous marketplace connecting people with fetish interests to willing service providers across every industry. Safe, consensual, verified.
            </p>
            <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
              <Btn size="xl" onClick={onGetStarted}>Join niche →</Btn>
              <Btn variant="secondary" size="xl" onClick={onGetStarted}>I'm a provider</Btn>
            </div>
          </div>
          <div className="fade-up stagger-2" style={{display:"grid",gap:"16px"}}>
            <div style={{background:T.color.surface,borderRadius:T.radius["2xl"],padding:"28px",border:`1px solid ${T.color.border}`,boxShadow:T.shadow.md}}>
              <div style={{fontSize:T.fontSize.lg,fontWeight:T.fontWeight.bold,color:T.color.text,marginBottom:"20px",fontFamily:T.font.brand}}>How it works</div>
              {TRUST_STAGES.map((s,i)=>(
                <div key={s.key} style={{display:"flex",gap:"14px",alignItems:"center",padding:"12px 0",borderBottom:i<4?`1px solid ${T.color.borderLight}`:"none"}}>
                  <div style={{width:"40px",height:"40px",borderRadius:T.radius.md,background:i===0?T.color.accentSoft:T.color.bgAlt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",flexShrink:0}}>{s.emoji}</div>
                  <div><div style={{fontSize:T.fontSize.base,fontWeight:T.fontWeight.bold,color:T.color.text}}>{s.label}</div><div style={{fontSize:T.fontSize.sm,color:T.color.textMuted}}>{s.desc}</div></div>
                  {i<4&&<span style={{marginLeft:"auto",color:T.color.textMuted,fontSize:T.fontSize.sm}}>→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="fade-up stagger-3" style={{padding:"40px 0 60px"}}>
          <div style={{fontSize:T.fontSize["2xl"],fontWeight:T.fontWeight.heavy,color:T.color.text,fontFamily:T.font.brand,marginBottom:"20px"}}>Every industry. Every interest.</div>
          <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
            {CATEGORIES.map(c=>(
              <div key={c.id} style={{padding:"12px 20px",borderRadius:T.radius.lg,background:T.color.surface,border:`1px solid ${T.color.border}`,display:"flex",alignItems:"center",gap:"8px",boxShadow:T.shadow.sm}}>
                <span style={{fontSize:"20px"}}>{c.emoji}</span>
                <span style={{fontSize:T.fontSize.base,fontWeight:T.fontWeight.semi,color:T.color.text}}>{c.label}</span>
              </div>
            ))}
            <div style={{padding:"12px 20px",borderRadius:T.radius.lg,background:T.color.accentSoft,border:`1px solid ${T.color.accent}25`,display:"flex",alignItems:"center",gap:"8px"}}>
              <span style={{fontSize:"20px"}}>➕</span>
              <span style={{fontSize:T.fontSize.base,fontWeight:T.fontWeight.semi,color:T.color.accent}}>& dozens more</span>
            </div>
          </div>
        </div>
        <div style={{padding:"40px 0 80px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"24px",padding:"32px",borderRadius:T.radius["2xl"],background:T.color.surface,border:`1px solid ${T.color.border}`,boxShadow:T.shadow.sm}}>
            {[{e:"🔒",t:"Anonymous First",d:"No real names until mutual consent"},{e:"🪪",t:"ID Verified",d:"Persona-powered identity verification"},{e:"🛡",t:"BG Checked",d:"Providers pass third-party screening"},{e:"🤝",t:"Consent Built In",d:"Digital consent forms + safe words"},{e:"🗑",t:"Data Minimized",d:"Messages auto-delete, PII encrypted"},{e:"💰",t:"Free to Join",d:"Providers pay 15% only when they earn"}].map(i=>(
              <div key={i.t} style={{textAlign:"center"}}>
                <div style={{fontSize:"28px",marginBottom:"8px"}}>{i.e}</div>
                <div style={{fontSize:T.fontSize.base,fontWeight:T.fontWeight.bold,color:T.color.text,marginBottom:"4px"}}>{i.t}</div>
                <div style={{fontSize:T.fontSize.sm,color:T.color.textMuted,lineHeight:T.lineHeight.relaxed}}>{i.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── VERIFICATION GATE ──────────────────────────────────────────────────────
function VerificationGate({onComplete}){
  const[step,setStep]=useState(0);
  const[alias,setAlias]=useState("");
  const[dob,setDob]=useState({m:"",d:"",y:""});
  const isOldEnough=()=>{if(!dob.m||!dob.d||!dob.y)return false;const b=new Date(+dob.y,+dob.m-1,+dob.d);return Math.floor((Date.now()-b.getTime())/(365.25*24*60*60*1000))>=18;};

  useEffect(()=>{if(step===4){const t=setTimeout(()=>setStep(5),2200);return()=>clearTimeout(t);}},[step]);

  const dots=<div style={{display:"flex",justifyContent:"center",gap:"8px",marginBottom:"24px"}}>{[0,1,2,3].map(i=><div key={i} style={{width:i===step?"28px":"8px",height:"8px",borderRadius:"4px",background:i<=step?T.color.accent:T.color.border,transition:T.transition.base}}/>)}</div>;

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:T.color.bg,padding:"24px",fontFamily:T.font.body}}>
      <div style={{maxWidth:"440px",width:"100%",textAlign:"center"}} className="pop">
        <div style={{marginBottom:"32px"}}>
          <div style={{fontFamily:T.font.brand,fontSize:"42px",fontWeight:T.fontWeight.heavy,color:T.color.accent,letterSpacing:T.letterSpacing.tight,lineHeight:1}}>niche</div>
          <div style={{fontSize:T.fontSize.sm,color:T.color.textMuted,letterSpacing:T.letterSpacing.caps,textTransform:"uppercase",marginTop:"6px"}}>find your thing</div>
        </div>
        <div style={{background:T.color.surface,borderRadius:T.radius["2xl"],padding:"36px",border:`1px solid ${T.color.border}`,boxShadow:T.shadow.md}}>

          {step===0&&<>
            <div style={{fontSize:"48px",marginBottom:"16px",animation:"float 3s ease infinite"}}>🔐</div>
            <h2 style={{fontFamily:T.font.brand,fontSize:T.fontSize["2xl"],fontWeight:T.fontWeight.heavy,color:T.color.text,margin:"0 0 10px 0"}}>Create your alias</h2>
            <p style={{fontSize:T.fontSize.md,color:T.color.textMuted,margin:"0 0 24px 0",lineHeight:T.lineHeight.relaxed}}>This is how others see you. Never your real name.</p>
            <Input placeholder="e.g., SteadyHands_303" value={alias} onChange={setAlias}/>
            <div style={{fontSize:T.fontSize.xs,color:T.color.textMuted,marginTop:"8px",marginBottom:"20px"}}>3-20 characters · letters, numbers, underscores</div>
            <Btn full size="lg" onClick={()=>alias.length>=3&&setStep(1)} disabled={alias.length<3}>Continue →</Btn>
          </>}

          {step===1&&<>
            {dots}
            <div style={{fontSize:"36px",marginBottom:"12px"}}>🎂</div>
            <h3 style={{fontFamily:T.font.brand,fontSize:T.fontSize.xl,fontWeight:T.fontWeight.bold,color:T.color.text,margin:"0 0 8px 0"}}>Date of birth</h3>
            <p style={{fontSize:T.fontSize.base,color:T.color.textMuted,margin:"0 0 24px 0"}}>Must be 18+ to use niche</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1.3fr",gap:"10px",marginBottom:"24px"}}>
              {[["MM","m",2],["DD","d",2],["YYYY","y",4]].map(([ph,k,max])=>(
                <input key={k} type="text" placeholder={ph} maxLength={max} value={dob[k]}
                  onChange={e=>setDob({...dob,[k]:e.target.value.replace(/\D/g,"")})}
                  style={{width:"100%",padding:"14px",borderRadius:T.radius.md,fontSize:"18px",fontWeight:T.fontWeight.semi,textAlign:"center",fontFamily:T.font.body,background:T.color.bgAlt,border:`1.5px solid ${T.color.border}`,color:T.color.text,outline:"none",boxSizing:"border-box"}}/>
              ))}
            </div>
            <Btn full size="lg" onClick={()=>isOldEnough()&&setStep(2)} disabled={!isOldEnough()}>Continue</Btn>
          </>}

          {step===2&&<>
            {dots}
            <div style={{fontSize:"36px",marginBottom:"12px"}}>📍</div>
            <h3 style={{fontFamily:T.font.brand,fontSize:T.fontSize.xl,fontWeight:T.fontWeight.bold,color:T.color.text,margin:"0 0 8px 0"}}>Your metro area</h3>
            <p style={{fontSize:T.fontSize.base,color:T.color.textMuted,margin:"0 0 20px 0"}}>We'll show you providers nearby</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"24px"}}>
              {["Denver Metro","Austin","Portland","Los Angeles","New York","Chicago","Seattle","Other"].map(m=>(
                <div key={m} onClick={()=>{}} style={{padding:"14px",borderRadius:T.radius.md,background:m==="Denver Metro"?T.color.accentSoft:T.color.bgAlt,border:`1.5px solid ${m==="Denver Metro"?T.color.accent+"40":T.color.border}`,cursor:"pointer",textAlign:"center",fontSize:T.fontSize.base,fontWeight:T.fontWeight.semi,color:m==="Denver Metro"?T.color.accent:T.color.textSoft,transition:T.transition.fast}}>{m}</div>
              ))}
            </div>
            <Btn full size="lg" onClick={()=>setStep(3)}>Continue</Btn>
          </>}

          {step===3&&<>
            {dots}
            <div style={{fontSize:"36px",marginBottom:"12px"}}>✨</div>
            <h3 style={{fontFamily:T.font.brand,fontSize:T.fontSize.xl,fontWeight:T.fontWeight.bold,color:T.color.text,margin:"0 0 8px 0"}}>What are you into?</h3>
            <p style={{fontSize:T.fontSize.base,color:T.color.textMuted,margin:"0 0 20px 0"}}>Select interests to help us match you (optional)</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"24px",justifyContent:"center"}}>
              {TAGS.slice(0,15).map(t=><TagChip key={t} label={t} active={false} onClick={()=>{}}/>)}
            </div>
            <Btn full size="lg" onClick={()=>setStep(4)}>Enter niche ✨</Btn>
            <button onClick={()=>setStep(4)} style={{background:"none",border:"none",color:T.color.textMuted,fontSize:T.fontSize.sm,cursor:"pointer",marginTop:"12px"}}>Skip for now</button>
          </>}

          {step===4&&<div style={{padding:"12px 0"}}>
            <div style={{width:"48px",height:"48px",border:`3px solid ${T.color.border}`,borderTopColor:T.color.accent,borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 20px"}}/>
            <h3 style={{fontFamily:T.font.brand,fontSize:T.fontSize.xl,fontWeight:T.fontWeight.bold,color:T.color.text,margin:"0 0 8px 0"}}>Setting up your space...</h3>
            <p style={{fontSize:T.fontSize.base,color:T.color.textMuted}}>This only takes a moment</p>
          </div>}

          {step===5&&<div className="pop">
            <div style={{fontSize:"56px",marginBottom:"12px"}}>🎉</div>
            <h3 style={{fontFamily:T.font.brand,fontSize:T.fontSize["2xl"],fontWeight:T.fontWeight.heavy,color:T.color.text,margin:"0 0 8px 0"}}>Welcome, {alias}!</h3>
            <p style={{fontSize:T.fontSize.md,color:T.color.textMuted,margin:"0 0 28px 0",lineHeight:T.lineHeight.relaxed}}>You're in. Everyone here is anonymous until mutual consent. Explore freely.</p>
            <Btn full size="xl" onClick={()=>onComplete(alias)}>Start exploring →</Btn>
          </div>}
        </div>
        <p style={{fontSize:T.fontSize.xs,color:T.color.textMuted,marginTop:"16px"}}>18+ only · Anonymous by default · Your data is encrypted</p>
      </div>
    </div>
  );
}

// ─── MARKETPLACE ────────────────────────────────────────────────────────────
function Marketplace({onSelectProvider}){
  const[cat,setCat]=useState("all");
  const[search,setSearch]=useState("");
  const[activeTags,setActiveTags]=useState([]);
  const toggleTag=t=>setActiveTags(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);
  const filtered=PROVIDERS.filter(p=>{
    if(cat!=="all"&&p.category!==cat)return false;
    if(search){const q=search.toLowerCase();if(!p.alias.toLowerCase().includes(q)&&!p.bio.toLowerCase().includes(q)&&!p.tags.some(t=>t.toLowerCase().includes(q)))return false;}
    if(activeTags.length>0&&!activeTags.some(t=>p.tags.includes(t)))return false;
    return true;
  });

  return(
    <div style={{maxWidth:"1200px",margin:"0 auto",padding:"28px 24px"}}>
      <div className="fade-up" style={{marginBottom:"28px"}}>
        <h1 style={{fontFamily:T.font.brand,fontSize:"clamp(28px,4vw,40px)",fontWeight:T.fontWeight.heavy,lineHeight:T.lineHeight.tight,color:T.color.text,margin:"0 0 8px 0"}}>
          Explore providers <span style={{color:T.color.accent}}>near you</span>
        </h1>
        <p style={{fontSize:T.fontSize.md,color:T.color.textSoft,margin:"0 0 20px 0"}}>Everyone is anonymous. Connect when you're ready.</p>
        <Input placeholder="🔍  Search by alias, service, interest..." value={search} onChange={setSearch}/>
      </div>
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"16px"}} className="fade-up stagger-1">
        <Btn variant={cat==="all"?"primary":"secondary"} size="sm" onClick={()=>setCat("all")}>All</Btn>
        {CATEGORIES.map(c=><Btn key={c.id} variant={cat===c.id?"primary":"secondary"} size="sm" onClick={()=>setCat(c.id)}>{c.emoji} {c.label}</Btn>)}
      </div>
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"28px"}} className="fade-up stagger-2">
        {TAGS.slice(0,10).map(t=><TagChip key={t} label={t} active={activeTags.includes(t)} onClick={()=>toggleTag(t)}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:"18px"}}>
        {filtered.map((p,i)=><ProviderCard key={p.id} p={p} idx={i} onClick={()=>onSelectProvider(p)}/>)}
      </div>
      {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:"48px",marginBottom:"12px"}}>🤷</div><h3 style={{fontSize:"18px",fontWeight:T.fontWeight.bold,color:T.color.textSoft}}>No matches</h3><p style={{fontSize:T.fontSize.base,color:T.color.textMuted}}>Try different filters.</p></div>}
    </div>
  );
}

function ProviderCard({p,idx,onClick}){
  const[hov,setHov]=useState(false);
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="fade-up" style={{animationDelay:`${idx*50}ms`,background:T.color.surface,borderRadius:T.radius.xl,padding:"24px",border:`1px solid ${hov?T.color.accent+"40":T.color.border}`,boxShadow:hov?T.shadow.cardHover:T.shadow.card,transition:T.transition.base,cursor:"pointer",transform:hov?"translateY(-3px)":"none"}}>
      <div style={{display:"flex",gap:"14px",marginBottom:"14px"}}>
        <Avatar initials={p.initials} size={50} idx={idx} online={p.online}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"3px"}}>
            <span style={{fontSize:T.fontSize.lg,fontWeight:T.fontWeight.bold,color:T.color.text}}>{p.alias}</span>
            {p.verified&&<span title="Platform Verified" style={{fontSize:"13px"}}>✅</span>}
          </div>
          <div style={{fontSize:T.fontSize.base,color:T.color.textMuted}}>{CATEGORIES.find(c=>c.id===p.category)?.emoji} {p.tagline}</div>
        </div>
        <div style={{padding:"6px 12px",borderRadius:T.radius.sm,background:T.color.bgWarm,alignSelf:"flex-start"}}>
          <span style={{fontSize:T.fontSize.lg,fontWeight:T.fontWeight.heavy,color:T.color.accent}}>${p.rate[0]}–{p.rate[1]}</span>
        </div>
      </div>
      <p style={{fontSize:T.fontSize.base,color:T.color.textSoft,lineHeight:T.lineHeight.relaxed,margin:"0 0 14px 0",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.bio}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"14px"}}>
        {p.tags.slice(0,3).map(t=><Badge key={t} variant="accent">{t}</Badge>)}
        {p.tags.length>3&&<Badge>+{p.tags.length-3}</Badge>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"12px",borderTop:`1px solid ${T.color.borderLight}`}}>
        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
          <span style={{color:T.color.amber}}>★</span>
          <span style={{fontSize:T.fontSize.base,fontWeight:T.fontWeight.bold,color:T.color.text}}>{p.rating}</span>
          <span style={{fontSize:T.fontSize.sm,color:T.color.textMuted}}>({p.reviews})</span>
        </div>
        <span style={{fontSize:T.fontSize.sm,color:T.color.textMuted}}>~{p.dist} mi · {p.city}</span>
      </div>
    </div>
  );
}

// ─── PROVIDER PROFILE ───────────────────────────────────────────────────────
function ProviderProfile({p,idx,onBack,onConnect}){
  return(
    <div style={{maxWidth:"720px",margin:"0 auto",padding:"28px 24px"}}>
      <Btn variant="secondary" size="sm" onClick={onBack} style={{marginBottom:"20px"}}>← Back</Btn>
      <div style={{background:T.color.surface,borderRadius:T.radius["2xl"],padding:"32px",border:`1px solid ${T.color.border}`,boxShadow:T.shadow.card,marginBottom:"20px"}} className="fade-up">
        <div style={{display:"flex",gap:"20px",flexWrap:"wrap",marginBottom:"20px"}}>
          <Avatar initials={p.initials} size={76} idx={idx} online={p.online}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap",marginBottom:"6px"}}>
              <h2 style={{fontFamily:T.font.brand,margin:0,fontSize:T.fontSize["2xl"],fontWeight:T.fontWeight.heavy,color:T.color.text}}>{p.alias}</h2>
              {p.verified&&<Badge variant="green">✅ Verified</Badge>}
              {p.bgCheck&&<Badge variant="green">🛡 BG Check</Badge>}
              {p.consentCert&&<Badge variant="purple">🎓 Consent Cert</Badge>}
            </div>
            <p style={{margin:"0 0 8px 0",fontSize:T.fontSize.base,color:T.color.textMuted}}>{CATEGORIES.find(c=>c.id===p.category)?.emoji} {p.tagline}</p>
            <div style={{display:"flex",gap:"16px",flexWrap:"wrap",fontSize:T.fontSize.sm,color:T.color.textMuted}}>
              <span><span style={{color:T.color.amber}}>★</span> <b style={{color:T.color.text}}>{p.rating}</b> ({p.reviews})</span>
              <span>📍 {p.city} · ~{p.dist} mi</span>
              <span>⚡ {p.responseTime}</span>
              <span>📆 Member since {p.since}</span>
            </div>
          </div>
          <div style={{padding:"14px 20px",borderRadius:T.radius.lg,background:T.color.bgWarm,textAlign:"center",alignSelf:"flex-start"}}>
            <div style={{fontSize:"28px",fontWeight:T.fontWeight.heavy,color:T.color.accent}}>${p.rate[0]}–{p.rate[1]}</div>
            <div style={{fontSize:T.fontSize.sm,color:T.color.textMuted}}>per session</div>
          </div>
        </div>
        <p style={{fontSize:T.fontSize.md,color:T.color.textSoft,lineHeight:T.lineHeight.relaxed,margin:"0 0 20px 0"}}>{p.bio}</p>
        <div style={{display:"flex",gap:"16px",marginBottom:"20px"}}>
          <Stat value={p.sessions} label="Sessions"/><Stat value={p.reviews} label="Reviews"/><Stat value={p.rating} label="Rating"/>
        </div>
        <Badge variant="purple" style={{marginBottom:"20px"}}>{p.vibe}</Badge>
        <div style={{marginBottom:"20px"}}>
          <SectionLabel>Interests & Specialties</SectionLabel>
          <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>{p.tags.map(t=><Badge key={t} variant="accent">{t}</Badge>)}</div>
        </div>
        {p.boundaries.length>0&&<div style={{marginBottom:"20px"}}>
          <SectionLabel>Boundaries</SectionLabel>
          <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>{p.boundaries.map(t=><Badge key={t} variant="red">{t}</Badge>)}</div>
        </div>}
        <div>
          <SectionLabel>Availability</SectionLabel>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
              <span key={d} style={{padding:"7px 14px",borderRadius:T.radius.sm,fontSize:T.fontSize.sm,fontWeight:T.fontWeight.semi,background:p.availability.includes(d)?T.color.accentSoft:T.color.bgAlt,color:p.availability.includes(d)?T.color.accent:T.color.textMuted,border:`1px solid ${p.availability.includes(d)?T.color.accent+"30":T.color.borderLight}`}}>{d}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{background:T.color.surface,borderRadius:T.radius["2xl"],padding:"28px",border:`1px solid ${T.color.border}`,boxShadow:T.shadow.card,marginBottom:"20px"}} className="fade-up stagger-1">
        <h3 style={{fontFamily:T.font.brand,fontSize:T.fontSize.xl,fontWeight:T.fontWeight.bold,color:T.color.text,margin:"0 0 16px 0"}}>🤝 How connections work</h3>
        {[{n:"1",t:"Message anonymously — get to know each other",d:false},{n:"2",t:"Exchange photos (mutual consent)",d:false},{n:"3",t:"Agree on activities & sign consent form",d:false},{n:"4",t:"Verify identity (Persona ID check)",d:false},{n:"5",t:"Book session — address shared only now",d:false}].map(s=>(
          <div key={s.n} style={{display:"flex",gap:"14px",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.color.borderLight}`}}>
            <div style={{width:"32px",height:"32px",borderRadius:T.radius.sm,background:T.color.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:T.fontSize.sm,fontWeight:T.fontWeight.heavy,color:T.color.accent,flexShrink:0}}>{s.n}</div>
            <span style={{fontSize:T.fontSize.base,color:T.color.text}}>{s.t}</span>
          </div>
        ))}
      </div>
      <Btn full size="xl" onClick={onConnect} style={{borderRadius:T.radius.lg}}>💬 Send a message to {p.alias}</Btn>
    </div>
  );
}

// ─── CONNECTION / MESSAGING VIEW (with trust ladder) ────────────────────────
function ConnectionView({provider,idx,onBack}){
  const[stage,setStage]=useState(0);
  const[msgs,setMsgs]=useState([
    {id:1,type:"system",text:"🔒 Conversation started · Both anonymous"},
  ]);
  const[input,setInput]=useState("");
  const[consentSigning,setConsentSigning]=useState(false);
  const[verifying,setVerifying]=useState(false);
  const[verified,setVerified]=useState(false);
  const[booked,setBooked]=useState(false);
  const[selectedDay,setSelectedDay]=useState(null);
  const[selectedTime,setSelectedTime]=useState(null);
  const msgEnd=useRef(null);

  useEffect(()=>{msgEnd.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const send=()=>{
    if(!input.trim())return;
    setMsgs(m=>[...m,{id:Date.now(),type:"own",text:input,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);
    setInput("");
    setTimeout(()=>{
      const replies=["That sounds great — I'm definitely open to discussing that.","Let me know what you're comfortable with and we can go from there.","I appreciate you being upfront. That's exactly the kind of communication I value.","Absolutely — consent and comfort are my top priorities."];
      setMsgs(m=>[...m,{id:Date.now()+1,type:"reply",text:replies[Math.floor(Math.random()*replies.length)],time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);
    },1500);
  };

  const advanceStage=(nextStage)=>{
    const labels=["","📸 Photos exchanged — both consented","🤝 Consent form signed by both parties","🔐 Both identities verified — real names revealed","📅 Session booked — address shared"];
    setMsgs(m=>[...m,{id:Date.now(),type:"system",text:labels[nextStage]}]);
    setStage(nextStage);
  };

  const times=["10:00 AM","11:30 AM","1:00 PM","2:30 PM","4:00 PM"];

  return(
    <div style={{maxWidth:"800px",margin:"0 auto",padding:"20px 24px",display:"flex",flexDirection:"column",height:"calc(100vh - 56px)"}}>
      <div style={{display:"flex",alignItems:"center",gap:"14px",padding:"12px 0",borderBottom:`1px solid ${T.color.border}`,marginBottom:"12px",flexShrink:0}}>
        <Btn variant="ghost" size="sm" onClick={onBack}>←</Btn>
        <Avatar initials={provider.initials} size={40} idx={idx} online={provider.online}/>
        <div style={{flex:1}}>
          <div style={{fontWeight:T.fontWeight.bold,color:T.color.text}}>{stage>=3?`${provider.alias} (Alex)`:provider.alias}</div>
          <div style={{fontSize:T.fontSize.sm,color:T.color.textMuted}}>{CATEGORIES.find(c=>c.id===provider.category)?.emoji} {provider.tagline}</div>
        </div>
        <div style={{display:"flex",gap:"4px"}}>
          {TRUST_STAGES.map((s,i)=>(
            <div key={s.key} title={s.label} style={{width:"24px",height:"24px",borderRadius:T.radius.sm,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",background:i<=stage?T.color.accentSoft:T.color.bgAlt,border:`1px solid ${i<=stage?T.color.accent+"30":T.color.borderLight}`,opacity:i<=stage?1:.5}}>{s.emoji}</div>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
        {msgs.map(m=>{
          if(m.type==="system") return <div key={m.id} style={{textAlign:"center",margin:"16px 0"}}><span style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"8px 16px",borderRadius:T.radius.full,background:T.color.bgWarm,border:`1px solid ${T.color.border}`,fontSize:T.fontSize.sm,color:T.color.textSoft,fontWeight:T.fontWeight.semi}}>{m.text}</span></div>;
          const isOwn=m.type==="own";
          return <div key={m.id} style={{display:"flex",justifyContent:isOwn?"flex-end":"flex-start",marginBottom:"10px",animation:"slideIn .3s ease"}}>
            {!isOwn&&<Avatar initials={provider.initials} size={28} idx={idx} style={{marginRight:"8px",alignSelf:"flex-end"}}/>}
            <div style={{maxWidth:"320px",padding:"12px 16px",borderRadius:T.radius.lg,borderBottomRightRadius:isOwn?"4px":T.radius.lg,borderBottomLeftRadius:isOwn?T.radius.lg:"4px",background:isOwn?T.color.accent:T.color.bgAlt,color:isOwn?"#fff":T.color.text,fontSize:T.fontSize.base,lineHeight:T.lineHeight.relaxed}}>
              {m.text}
              <div style={{fontSize:T.fontSize.xs,color:isOwn?"rgba(255,255,255,0.6)":T.color.textMuted,marginTop:"4px",textAlign:"right"}}>{m.time}</div>
            </div>
          </div>;
        })}
        <div ref={msgEnd}/>
      </div>
      {stage===0&&!consentSigning&&(
        <div style={{padding:"12px 0",borderTop:`1px solid ${T.color.borderLight}`,display:"flex",gap:"8px",flexShrink:0,flexWrap:"wrap"}}>
          <Btn variant="secondary" size="sm" onClick={()=>advanceStage(1)}>📸 Exchange photos</Btn>
          <span style={{fontSize:T.fontSize.xs,color:T.color.textMuted,alignSelf:"center"}}>Both must agree</span>
        </div>
      )}
      {stage===1&&(
        <div style={{padding:"12px 0",borderTop:`1px solid ${T.color.borderLight}`,display:"flex",gap:"8px",flexShrink:0,flexWrap:"wrap"}}>
          <Btn size="sm" onClick={()=>setConsentSigning(true)}>🤝 I'd like to meet in person</Btn>
          <span style={{fontSize:T.fontSize.xs,color:T.color.textMuted,alignSelf:"center"}}>Starts consent form</span>
        </div>
      )}
      {consentSigning&&stage===1&&(
        <div style={{padding:"16px",borderTop:`1px solid ${T.color.borderLight}`,flexShrink:0,background:T.color.bgAlt,borderRadius:`${T.radius.lg} ${T.radius.lg} 0 0`}}>
          <div style={{fontWeight:T.fontWeight.bold,color:T.color.text,marginBottom:"12px"}}>🤝 Consent Form</div>
          <SectionLabel>Agreed Activities</SectionLabel>
          <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"12px"}}>{provider.tags.map(t=><Badge key={t} variant="accent">{t}</Badge>)}</div>
          <SectionLabel>Hard Limits</SectionLabel>
          <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"12px"}}>{provider.boundaries.map(t=><Badge key={t} variant="red">{t}</Badge>)}</div>
          <SectionLabel>Safe Word Protocol</SectionLabel>
          <div style={{display:"flex",gap:"6px",marginBottom:"16px"}}><Badge variant="green">🟢 Green = Good</Badge><Badge variant="amber">🟡 Yellow = Slow down</Badge><Badge variant="red">🔴 Red = Stop</Badge></div>
          <Btn full onClick={()=>{setConsentSigning(false);advanceStage(2);}}>Sign & send consent form ✍️</Btn>
        </div>
      )}
      {stage===2&&!verifying&&(
        <div style={{padding:"12px 0",borderTop:`1px solid ${T.color.borderLight}`,display:"flex",gap:"8px",flexShrink:0,flexWrap:"wrap"}}>
          <Btn size="sm" onClick={()=>{setVerifying(true);setTimeout(()=>{setVerifying(false);setVerified(true);advanceStage(3);},2500);}}>🔐 Verify my identity</Btn>
          <span style={{fontSize:T.fontSize.xs,color:T.color.textMuted,alignSelf:"center"}}>Persona ID + selfie check</span>
        </div>
      )}
      {verifying&&(
        <div style={{padding:"20px",borderTop:`1px solid ${T.color.borderLight}`,textAlign:"center",flexShrink:0}}>
          <div style={{width:"36px",height:"36px",border:`3px solid ${T.color.border}`,borderTopColor:T.color.accent,borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 12px"}}/>
          <div style={{fontSize:T.fontSize.sm,color:T.color.textMuted}}>Verifying identity with Persona...</div>
        </div>
      )}
      {stage===3&&!booked&&(
        <div style={{padding:"16px",borderTop:`1px solid ${T.color.borderLight}`,flexShrink:0,background:T.color.bgAlt,borderRadius:`${T.radius.lg} ${T.radius.lg} 0 0`}}>
          <div style={{fontWeight:T.fontWeight.bold,color:T.color.text,marginBottom:"12px"}}>📅 Book a Session</div>
          <SectionLabel>Select a day</SectionLabel>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
            {provider.availability.map(d=>(
              <button key={d} onClick={()=>{setSelectedDay(d);setSelectedTime(null);}} style={{padding:"8px 16px",borderRadius:T.radius.sm,fontSize:T.fontSize.sm,fontWeight:T.fontWeight.bold,border:"none",cursor:"pointer",background:selectedDay===d?T.color.accent:T.color.surface,color:selectedDay===d?"#fff":T.color.textSoft,transition:T.transition.fast}}>{d}</button>
            ))}
          </div>
          {selectedDay&&<><SectionLabel>Select a time</SectionLabel>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"16px"}}>
              {times.map(t=>(
                <button key={t} onClick={()=>setSelectedTime(t)} style={{padding:"8px 14px",borderRadius:T.radius.sm,fontSize:T.fontSize.sm,fontWeight:T.fontWeight.semi,border:"none",cursor:"pointer",background:selectedTime===t?T.color.accent:T.color.surface,color:selectedTime===t?"#fff":T.color.textSoft,transition:T.transition.fast}}>{t}</button>
              ))}
            </div></>}
          {selectedDay&&selectedTime&&(
            <Btn full onClick={()=>{setBooked(true);advanceStage(4);}}>Confirm booking · {selectedDay} at {selectedTime} · ${provider.rate[0]}</Btn>
          )}
        </div>
      )}
      {booked&&(
        <div style={{padding:"20px",borderTop:`1px solid ${T.color.borderLight}`,textAlign:"center",flexShrink:0,background:T.color.greenSoft,borderRadius:`${T.radius.lg} ${T.radius.lg} 0 0`}}>
          <div style={{fontSize:"32px",marginBottom:"8px"}}>🎉</div>
          <div style={{fontWeight:T.fontWeight.bold,color:T.color.green,marginBottom:"4px"}}>Session booked!</div>
          <div style={{fontSize:T.fontSize.sm,color:T.color.textSoft}}>Address will be shared 24hrs before your session. Reminders will be sent.</div>
        </div>
      )}
      {!consentSigning&&!verifying&&!booked&&(
        <div style={{display:"flex",gap:"8px",paddingTop:"12px",flexShrink:0}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Type a message..." style={{flex:1,padding:"12px 16px",borderRadius:T.radius.md,fontSize:T.fontSize.base,fontFamily:T.font.body,background:T.color.bgAlt,border:`1.5px solid ${T.color.border}`,color:T.color.text,outline:"none"}}/>
          <Btn onClick={send} disabled={!input.trim()}>Send</Btn>
        </div>
      )}
    </div>
  );
}

// ─── CONNECTIONS LIST ───────────────────────────────────────────────────────
function ConnectionsList({onSelectConnection}){
  const connections=[
    {id:1,provider:PROVIDERS[0],stage:2,lastMsg:"That sounds perfect — let me know when you'd like to exchange photos.",time:"2m ago",unread:true},
    {id:2,provider:PROVIDERS[1],stage:0,lastMsg:"Hi! I saw your profile and I'm curious about your deep pressure sessions.",time:"1hr ago",unread:false},
    {id:3,provider:PROVIDERS[6],stage:3,lastMsg:"Great — both verified! Ready to book when you are.",time:"Yesterday",unread:true},
  ];
  return(
    <div style={{maxWidth:"720px",margin:"0 auto",padding:"28px 24px"}}>
      <h2 style={{fontFamily:T.font.brand,fontSize:T.fontSize["2xl"],fontWeight:T.fontWeight.heavy,color:T.color.text,margin:"0 0 20px 0"}}>Connections</h2>
      <div style={{display:"grid",gap:"12px"}}>
        {connections.map(c=>(
          <div key={c.id} onClick={()=>onSelectConnection(c.provider,c.provider.id-1)} style={{display:"flex",gap:"14px",padding:"18px",borderRadius:T.radius.xl,background:T.color.surface,border:`1px solid ${T.color.border}`,cursor:"pointer",transition:T.transition.base,boxShadow:T.shadow.card}} className="fade-up">
            <Avatar initials={c.provider.initials} size={48} idx={c.provider.id-1} online={c.provider.online}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <span style={{fontWeight:T.fontWeight.bold,color:T.color.text}}>{c.provider.alias}</span>
                  <span style={{fontSize:"14px"}}>{TRUST_STAGES[c.stage].emoji}</span>
                  <Badge variant={c.stage>=3?"green":"default"} style={{fontSize:"10px",padding:"2px 8px"}}>{TRUST_STAGES[c.stage].label}</Badge>
                </div>
                <span style={{fontSize:T.fontSize.xs,color:T.color.textMuted}}>{c.time}</span>
              </div>
              <p style={{fontSize:T.fontSize.sm,color:T.color.textMuted,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.lastMsg}</p>
            </div>
            {c.unread&&<div style={{width:"10px",height:"10px",borderRadius:"50%",background:T.color.accent,flexShrink:0,alignSelf:"center"}}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BOOKINGS LIST ──────────────────────────────────────────────────────────
function BookingsList(){
  const bookings=[
    {id:1,provider:PROVIDERS[0],date:"Apr 5",time:"2:30 PM",status:"confirmed",rate:95},
    {id:2,provider:PROVIDERS[6],date:"Apr 8",time:"10:00 AM",status:"requested",rate:150},
    {id:3,provider:PROVIDERS[1],date:"Mar 22",time:"4:00 PM",status:"completed",rate:120},
  ];
  return(
    <div style={{maxWidth:"720px",margin:"0 auto",padding:"28px 24px"}}>
      <h2 style={{fontFamily:T.font.brand,fontSize:T.fontSize["2xl"],fontWeight:T.fontWeight.heavy,color:T.color.text,margin:"0 0 20px 0"}}>My Bookings</h2>
      <div style={{display:"grid",gap:"12px"}}>
        {bookings.map(b=>(
          <div key={b.id} style={{display:"flex",gap:"14px",padding:"18px",borderRadius:T.radius.xl,background:T.color.surface,border:`1px solid ${T.color.border}`,boxShadow:T.shadow.card}} className="fade-up">
            <Avatar initials={b.provider.initials} size={48} idx={b.provider.id-1}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:T.fontWeight.bold,color:T.color.text,marginBottom:"4px"}}>{b.provider.alias}</div>
              <div style={{fontSize:T.fontSize.sm,color:T.color.textMuted}}>{b.date} at {b.time}</div>
            </div>
            <div style={{textAlign:"right",alignSelf:"center"}}>
              <div style={{fontSize:T.fontSize.lg,fontWeight:T.fontWeight.heavy,color:T.color.text}}>${b.rate}</div>
              <Badge variant={b.status==="confirmed"?"green":b.status==="requested"?"amber":"default"} style={{fontSize:"10px",padding:"2px 8px",textTransform:"capitalize"}}>{b.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROVIDER DASHBOARD ─────────────────────────────────────────────────────
function ProviderDashboard(){
  return(
    <div style={{maxWidth:"900px",margin:"0 auto",padding:"28px 24px"}}>
      <h2 style={{fontFamily:T.font.brand,fontSize:T.fontSize["2xl"],fontWeight:T.fontWeight.heavy,color:T.color.text,margin:"0 0 24px 0"}}>Provider Dashboard</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"16px",marginBottom:"32px"}} className="fade-up">
        {[{v:"$4,280",l:"This month"},{v:"34",l:"Sessions"},{v:"4.9",l:"Avg rating"},{v:"12",l:"Active connections"},{v:"< 1hr",l:"Response time"}].map(s=>(
          <div key={s.l} style={{padding:"20px",borderRadius:T.radius.xl,background:T.color.surface,border:`1px solid ${T.color.border}`,textAlign:"center",boxShadow:T.shadow.card}}>
            <div style={{fontSize:T.fontSize["2xl"],fontWeight:T.fontWeight.heavy,color:T.color.accent,fontFamily:T.font.brand}}>{s.v}</div>
            <div style={{fontSize:T.fontSize.xs,color:T.color.textMuted,marginTop:"4px"}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:"32px"}} className="fade-up stagger-1">
        <h3 style={{fontFamily:T.font.brand,fontSize:T.fontSize.xl,fontWeight:T.fontWeight.bold,color:T.color.text,margin:"0 0 16px 0"}}>Pending Requests</h3>
        {[{alias:"CuriousSoul_42",interest:"Interested in extended straight razor session with blindfold",tags:["Straight Razor","Blindfold OK","ASMR"],time:"15m ago"},
          {alias:"QuietSeeker",interest:"Looking for a clinical dental experience with verbal narration",tags:["Dental Exam","Verbal Guidance","Latex Gloves"],time:"2hr ago"}
        ].map(r=>(
          <div key={r.alias} style={{display:"flex",gap:"14px",padding:"18px",borderRadius:T.radius.xl,background:T.color.surface,border:`1px solid ${T.color.border}`,marginBottom:"12px",boxShadow:T.shadow.card}}>
            <Avatar initials={r.alias.slice(0,2).toUpperCase()} size={44} idx={Math.floor(Math.random()*8)}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                <span style={{fontWeight:T.fontWeight.bold,color:T.color.text}}>{r.alias}</span>
                <span style={{fontSize:T.fontSize.xs,color:T.color.textMuted}}>{r.time}</span>
              </div>
              <p style={{fontSize:T.fontSize.sm,color:T.color.textSoft,margin:"0 0 8px 0"}}>{r.interest}</p>
              <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>{r.tags.map(t=><Badge key={t} variant="accent" style={{fontSize:"10px",padding:"2px 8px"}}>{t}</Badge>)}</div>
            </div>
            <div style={{display:"flex",gap:"8px",alignSelf:"center"}}>
              <Btn size="sm">Accept</Btn>
              <Btn variant="secondary" size="sm">Decline</Btn>
            </div>
          </div>
        ))}
      </div>
      <div className="fade-up stagger-2">
        <h3 style={{fontFamily:T.font.brand,fontSize:T.fontSize.xl,fontWeight:T.fontWeight.bold,color:T.color.text,margin:"0 0 16px 0"}}>Today's Schedule</h3>
        {[{time:"2:30 PM",alias:"SteadyHands_303",type:"Straight Razor + Scalp",status:"confirmed",rate:95},{time:"5:00 PM",alias:"QuietSeeker",type:"Extended Dental Exam",status:"confirmed",rate:150}].map(s=>(
          <div key={s.time} style={{display:"flex",gap:"14px",alignItems:"center",padding:"16px",borderRadius:T.radius.lg,background:T.color.surface,border:`1px solid ${T.color.border}`,marginBottom:"10px",boxShadow:T.shadow.card}}>
            <div style={{padding:"8px 14px",borderRadius:T.radius.sm,background:T.color.accentSoft,fontWeight:T.fontWeight.bold,color:T.color.accent,fontSize:T.fontSize.sm,flexShrink:0}}>{s.time}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:T.fontWeight.bold,color:T.color.text}}>{s.alias}</div>
              <div style={{fontSize:T.fontSize.sm,color:T.color.textMuted}}>{s.type}</div>
            </div>
            <Badge variant="green">{s.status}</Badge>
            <span style={{fontWeight:T.fontWeight.heavy,color:T.color.text}}>${s.rate}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App(){
  const[appState,setAppState]=useState("landing");
  const[view,setView]=useState("marketplace");
  const[alias,setAlias]=useState("");
  const[selectedProvider,setSelectedProvider]=useState(null);
  const[selectedIdx,setSelectedIdx]=useState(0);
  const[activeConnection,setActiveConnection]=useState(null);

  if(appState==="landing") return <><GlobalStyles/><LandingPage onGetStarted={()=>setAppState("onboarding")}/></>;
  if(appState==="onboarding") return <><GlobalStyles/><VerificationGate onComplete={(a)=>{setAlias(a);setAppState("app")}}/></>;

  return(
    <div style={{minHeight:"100vh",background:T.color.bg,fontFamily:T.font.body,color:T.color.text}}>
      <GlobalStyles/>
      <Nav currentView={view} setView={(v)=>{setView(v);setSelectedProvider(null);setActiveConnection(null);}} isProvider={true} userAlias={alias}/>
      {view==="marketplace"&&!selectedProvider&&!activeConnection&&(
        <Marketplace onSelectProvider={(p)=>{setSelectedProvider(p);setSelectedIdx(PROVIDERS.indexOf(p));}}/>
      )}
      {view==="marketplace"&&selectedProvider&&!activeConnection&&(
        <ProviderProfile p={selectedProvider} idx={selectedIdx} onBack={()=>setSelectedProvider(null)} onConnect={()=>{setActiveConnection(selectedProvider);}}/>
      )}
      {activeConnection&&(
        <ConnectionView provider={activeConnection} idx={PROVIDERS.indexOf(activeConnection)} onBack={()=>{setActiveConnection(null);}}/>
      )}
      {view==="connections"&&!activeConnection&&(
        <ConnectionsList onSelectConnection={(p,i)=>{setActiveConnection(p);setSelectedIdx(i);}}/>
      )}
      {view==="bookings"&&<BookingsList/>}
      {view==="dashboard"&&<ProviderDashboard/>}
    </div>
  );
}
