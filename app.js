// ===== STATION MASTER PREP — APP LOGIC =====
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const Store = {
  get(k, def=null){ try { const v=localStorage.getItem('sm_'+k); return v?JSON.parse(v):def; } catch(e){ return def; } },
  set(k,v){ try { localStorage.setItem('sm_'+k, JSON.stringify(v)); } catch(e){} },
  remove(k){ localStorage.removeItem('sm_'+k); }
};

const State = {
  profile: Store.get('profile', null),
  receipt: Store.get('receipt', null),
  progress: Store.get('progress', {dayDone:{}, streak:0, lastActive:null}),
  scores: Store.get('scores', []),
  errors: Store.get('errors', []),
  bookmarks: Store.get('bookmarks', []),
  watched: Store.get('watched', {}),
  answers: Store.get('answers', {}),
  theme: Store.get('theme', 'light'),
  xp: Store.get('xp', 0),
  dailyGoal: Store.get('dailyGoal', 20),
  onboardingDone: Store.get('onboardingDone', false)
};

function save(){ 
  Store.set('profile', State.profile);
  Store.set('receipt', State.receipt);
  Store.set('progress', State.progress);
  Store.set('scores', State.scores);
  Store.set('errors', State.errors);
  Store.set('bookmarks', State.bookmarks);
  Store.set('watched', State.watched);
  Store.set('answers', State.answers);
  Store.set('theme', State.theme);
  Store.set('xp', State.xp);
  Store.set('dailyGoal', State.dailyGoal);
  Store.set('onboardingDone', State.onboardingDone);
}

// Theme
function applyTheme(){
  document.documentElement.setAttribute('data-theme', State.theme);
  const btn = $('#themeBtn');
  if(btn) btn.textContent = State.theme==='dark'?'☀️':'🌙';
}
applyTheme();
$('#themeBtn').addEventListener('click', ()=>{ State.theme = State.theme==='dark'?'light':'dark'; applyTheme(); save(); });

// Sidebar
const sidebar = $('#sidebar'), overlay = $('#overlay'), menuBtn = $('#menuBtn');
function openSidebar(){ sidebar.classList.add('open'); overlay.classList.add('show'); }
function closeSidebar(){ sidebar.classList.remove('open'); overlay.classList.remove('show'); }
menuBtn.addEventListener('click', openSidebar);
overlay.addEventListener('click', closeSidebar);
$$('#nav .nav-link').forEach(a=>a.addEventListener('click', closeSidebar));

// Toast
function toast(msg){ const t=$('.toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); }

// Router
const view = $('#view');
function route(){ 
  if(!State.onboardingDone){ location.hash='#onboard'; }
  const hash = (location.hash||'#onboard').replace('#','') || (State.onboardingDone?'home':'onboard');
  $$('#nav .nav-link').forEach(a=>a.classList.toggle('active', a.dataset.route===hash));
  $$('#bottomnav .bnav-link').forEach(a=>a.classList.toggle('active', a.dataset.route===hash));
  render(hash);
  closeSidebar();
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', route);

function render(r){ 
  switch(r){
    case 'onboard': view.innerHTML = renderOnboard(); bindOnboard(); break;
    case 'home': view.innerHTML = renderHome(); bindHome(); break;
    case 'profile': view.innerHTML = renderProfile(); bindProfile(); break;
    case 'plan': view.innerHTML = renderPlan(); bindPlan(); break;
    case 'topics': view.innerHTML = renderTopics(); bindTopics(); break;
    case 'questions': view.innerHTML = renderQuestions(); bindQuestions(); break;
    case 'mock': view.innerHTML = renderMock(); bindMock(); break;
    case 'videos': view.innerHTML = renderVideos(); bindVideos(); break;
    case 'cbat': view.innerHTML = renderCbat(); bindCbat(); break;
    case 'formulas': view.innerHTML = renderFormulas(); bindFormulas(); break;
    case 'errors': view.innerHTML = renderErrors(); bindErrors(); break;
    case 'backup': view.innerHTML = renderBackup(); bindBackup(); break;
    default: view.innerHTML = renderHome(); bindHome();
  }
  updateSidebarProfile();
}

function updateSidebarProfile(){
  const sp = $('#sidebarProfile');
  if(!sp) return;
  if(State.profile && State.profile.name){
    const done = Object.keys(State.progress.dayDone||{}).length;
    sp.innerHTML = `<strong>${State.profile.name}</strong><br><small>Day ${done}/40 • Streak ${State.progress.streak||0}</small>`;
  } else {
    sp.innerHTML = 'Set up profile →';
  }
  sp.onclick = ()=>{ location.hash='#profile'; };
}

// ===== ONBOARDING =====
function renderOnboard(){
  return `
  <div class="onboard">
    <div class="step-dots" id="stepDots"></div>
    <div id="onboardStep"></div>
  </div>`;
}
let onboardStep = 0;
const onboardSteps = [
  {title:'Welcome to Rank #1 Prep 🎯',sub:'Let\'s set up in 60 seconds. Your data stays on this device.',fields:[{id:'name',label:'Your name',type:'text'}]},
  {title:'When is your exam?',sub:'We\'ll count down for you.',fields:[{id:'dob',label:'Date of birth',type:'date'},{id:'target',label:'Target exam date',type:'date'}]},
  {title:'Daily goal',sub:'How many questions per day?',fields:[{id:'goal',label:'Daily question goal',type:'number',val:20}]},
  {title:'You\'re in! 🎉',sub:'First success in under 90 seconds. Let\'s go.',fields:[]}
];
function bindOnboard(){
  const dots = $('#stepDots');
  dots.innerHTML = onboardSteps.map((s,i)=>`<div class="step-dot ${i===onboardStep?'active':''}"></div>`).join('');
  const step = onboardSteps[onboardStep];
  const area = $('#onboardStep');
  area.innerHTML = `
    <h1>${step.title}</h1>
    <p>${step.sub}</p>
    ${step.fields.map(f=>`<label class="label">${f.label}</label><input class="input" id="ob_${f.id}" type="${f.type}" value="${f.val||''}">`).join('')}
    <div style="display:flex;gap:8px;justify-content:center;margin-top:16px;">
      ${onboardStep>0?'<button class="btn btn-secondary" id="obBack">Back</button>':''}
      <button class="btn" id="obNext">${onboardStep===onboardSteps.length-1?'Start learning →':'Next'}</button>
    </div>`;
  if($('#obBack')) $('#obBack').addEventListener('click', ()=>{ onboardStep--; bindOnboard(); });
  $('#obNext').addEventListener('click', ()=>{
    if(onboardStep===0){ State.profile = State.profile||{}; State.profile.name = $('#ob_name').value.trim()||'Aspirant'; }
    if(onboardStep===1){ State.profile = State.profile||{}; State.profile.dob = $('#ob_dob').value; State.profile.targetDate = $('#ob_target').value; State.profile.category='UR'; }
    if(onboardStep===2){ State.dailyGoal = +$('#ob_goal').value || 20; }
    if(onboardStep===onboardSteps.length-1){
      State.onboardingDone = true; State.xp = 50; State.progress.streak = 1; State.progress.lastActive = new Date().toDateString();
      save(); confetti(); toast('Welcome! +50 XP 🎉'); location.hash='#home'; onboardStep=0; return;
    }
    onboardStep++; bindOnboard();
  });
}

// ===== HOME =====
function renderHome(){
  const p = State.profile;
  const done = Object.keys(State.progress.dayDone||{}).length;
  const streak = State.progress.streak||0;
  const lastScore = State.scores.length? State.scores[State.scores.length-1] : null;
  const todayDay = done < 40 ? done+1 : 40;
  const daysToExam = p && p.targetDate ? Math.ceil((new Date(p.targetDate)-new Date())/86400000) : null;
  const xp = State.xp||0;
  const level = Math.floor(xp/200)+1;
  const ringPct = Math.min(100, (done/40)*100);
  return `
  <div class="card">
    <h2>👋 ${p && p.name ? 'Hello, '+p.name+'!' : 'Welcome, aspirant!'}</h2>
    <p style="color:var(--muted)">${p && p.name ? 'Your rank-1 journey continues.' : 'Set up your profile to personalize.'}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
      ${daysToExam!==null && daysToExam>0 ? `<span class="tag amber">⏳ ${daysToExam} days to exam</span>` : ''}
      <span class="streak-chip">🔥 ${streak} day streak</span>
      <span class="xp-badge">⭐ ${xp} XP • Lv ${level}</span>
    </div>
  </div>
  <div class="grid grid-2">
    <div class="card stat">
      <div class="ring-wrap">
        <svg class="ring" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" stroke-width="8"/>
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--primary)" stroke-width="8" stroke-linecap="round"
            stroke-dasharray="${2*Math.PI*42}" stroke-dashoffset="${2*Math.PI*42*(1-ringPct/100)}" transform="rotate(-90 50 50)"/>
          <text x="50" y="54" text-anchor="middle" font-size="18" font-weight="800" fill="var(--fg)">${done}/40</text>
        </svg>
      </div>
      <div class="lbl">Days completed</div>
    </div>
    <div class="card stat"><div class="num">${State.scores.length}</div><div class="lbl">Mocks taken</div></div>
    <div class="card stat"><div class="num">${State.errors.filter(e=>!e.resolved).length}</div><div class="lbl">Open errors</div></div>
    <div class="card stat"><div class="num">${Object.keys(State.watched).length}</div><div class="lbl">Videos watched</div></div>
  </div>
  <div class="card">
    <h2>🎯 Today's Focus — Day ${todayDay}</h2>
    ${renderDayCard(todayDay, false)}
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn" onclick="location.hash='#plan'">Open plan</button>
      <button class="btn btn-secondary" onclick="location.hash='#questions'">Practice Qs</button>
      <button class="btn btn-secondary" onclick="location.hash='#mock'">Take mock</button>
    </div>
  </div>
  ${lastScore ? `<div class="card"><h2>📊 Last mock</h2><p>Score: <strong>${lastScore.score}/${lastScore.total}</strong> (${Math.round(lastScore.score/lastScore.total*100)}%) — ${lastScore.paper}</p></div>` : ''}
  <div class="card">
    <h2>🔥 Streak calendar (last 7 days)</h2>
    <div class="streak-cal" id="streakCal"></div>
  </div>
  <div class="card">
    <h2>⚡ Quick actions</h2>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-sm" onclick="location.hash='#videos'">▶️ Videos</button>
      <button class="btn btn-sm" onclick="location.hash='#cbat'">🧠 CBAT</button>
      <button class="btn btn-sm" onclick="location.hash='#formulas'">📐 Formulas</button>
      <button class="btn btn-sm" onclick="location.hash='#errors'">📕 Error log</button>
    </div>
  </div>`;
}
function bindHome(){
  const cal = $('#streakCal');
  if(!cal) return;
  const today = new Date();
  let html='';
  for(let i=6;i>=0;i--){
    const d = new Date(today); d.setDate(today.getDate()-i);
    const key = d.toDateString();
    const done = State.progress.lastActive===key || (State.progress.dayDone && Object.keys(State.progress.dayDone).length>0 && i===0);
    const isToday = i===0;
    html += `<div class="day ${done?'done':''} ${isToday?'today':''}">${d.getDate()}</div>`;
  }
  cal.innerHTML = html;
}

function renderDayCard(dayNum, compact){
  const d = SM.plan[dayNum-1];
  if(!d) return '';
  const done = !!State.progress.dayDone[dayNum];
  return `<div class="daycard ${done?'done':''}">
    <h4>Day ${dayNum}: ${d.topic} ${done?'✅':''}</h4>
    <div style="font-size:13px;color:var(--muted);">
      📐 ${d.maths} &nbsp;|&nbsp; 🔬 ${d.science} &nbsp;|&nbsp; 📊 ${d.di}<br>
      📖 ${d.rc} &nbsp;|&nbsp; 🧠 ${d.mental} &nbsp;|&nbsp; 🧩 ${d.logical}
      ${d.mock?'<br><span class="tag amber">MOCK DAY</span>':''}
      ${d.cbat?'<span class="tag">CBAT DRILL</span>':''}
    </div>
    ${d.video && d.video.length? `<div style="margin-top:6px;font-size:12px;">▶️ Videos: ${d.video.map(v=>SM.videos.find(x=>x.id===v)?.title||v).join(', ')}</div>`:''}
  </div>`;
}

// ===== PROFILE =====
function renderProfile(){
  const p = State.profile||{};
  const r = State.receipt||{};
  return `
  <div class="card">
    <h2>👤 Profile (stays on device)</h2>
    <label class="label">Full name</label><input class="input" id="pName" value="${esc(p.name||'')}">
    <label class="label">Date of birth</label><input class="input" type="date" id="pDob" value="${p.dob||''}">
    <label class="label">Category</label>
    <select class="input" id="pCat">
      ${['UR','EWS','OBC-NCL','SC','ST'].map(c=>`<option ${p.category===c?'selected':''}>${c}</option>`).join('')}
    </select>
    <label class="label">Target exam date</label><input class="input" type="date" id="pTarget" value="${p.targetDate||''}">
    <label class="label">Roll/Reg number (if any)</label><input class="input" id="pRoll" value="${esc(p.rollNo||'')}">
    <label class="label">Photo (stored on device only)</label><input class="input" type="file" id="pPhoto" accept="image/*">
    ${p.photo?`<img src="${p.photo}" style="width:90px;height:90px;border-radius:50%;object-fit:cover;margin:8px 0;">`:''}
    <button class="btn" id="saveProfile">Save profile</button>
  </div>
  <div class="card">
    <h2>🧾 Application Receipt (form filling)</h2>
    <label class="label">Application number</label><input class="input" id="rApp" value="${esc(r.applicationNo||'')}">
    <label class="label">Applied date</label><input class="input" type="date" id="rDate" value="${r.appliedDate||''}">
    <label class="label">RRB (chosen)</label><input class="input" id="rRrb" value="${esc(r.rrb||'')}">
    <label class="label">Posts applied</label><input class="input" id="rPosts" value="${esc(r.posts||'Station Master')}">
    <label class="label">Fee paid (₹)</label><input class="input" type="number" id="rFee" value="${r.fee||500}">
    <label class="label">Notes</label><textarea class="input" id="rNotes" rows="3">${esc(r.notes||'')}</textarea>
    <button class="btn" id="saveReceipt">Save receipt</button>
    ${r.applicationNo?`<div style="margin-top:12px;padding:12px;background:var(--bg2);border-radius:8px;">
      <strong>Receipt saved ✅</strong><br>
      App No: ${esc(r.applicationNo)} • RRB: ${esc(r.rrb||'-')} • Fee: ₹${r.fee||0}<br>
      <small style="color:var(--muted)">Applied ${r.appliedDate||'-'}</small>
    </div>`:''}
  </div>`;
}
function bindProfile(){
  $('#saveProfile').addEventListener('click', ()=>{
    const p = State.profile||{};
    p.name = $('#pName').value.trim();
    p.dob = $('#pDob').value;
    p.category = $('#pCat').value;
    p.targetDate = $('#pTarget').value;
    p.rollNo = $('#pRoll').value.trim();
    State.profile = p; save(); updateSidebarProfile(); toast('Profile saved ✅');
    render('profile');
  });
  $('#pPhoto').addEventListener('change', e=>{
    const f = e.target.files[0]; if(!f) return;
    const rd = new FileReader();
    rd.onload = ()=>{ State.profile = State.profile||{}; State.profile.photo = rd.result; save(); render('profile'); toast('Photo saved on device ✅'); };
    rd.readAsDataURL(f);
  });
  $('#saveReceipt').addEventListener('click', ()=>{
    const r = State.receipt||{};
    r.applicationNo = $('#rApp').value.trim();
    r.appliedDate = $('#rDate').value;
    r.rrb = $('#rRrb').value.trim();
    r.posts = $('#rPosts').value.trim();
    r.fee = +$('#rFee').value;
    r.notes = $('#rNotes').value.trim();
    r.savedAt = new Date().toISOString();
    State.receipt = r; save(); toast('Receipt saved ✅'); render('profile');
  });
}

// ===== 40-DAY PLAN =====
function renderPlan(){
  const done = Object.keys(State.progress.dayDone||{}).length;
  return `
  <div class="card"><h2>📅 40-Day Marathon Plan</h2>
    <p>Progress: ${done}/40 days • Streak: ${State.progress.streak||0} 🔥</p>
    <div class="progress"><div style="width:${done/40*100}%"></div></div>
  </div>
  <div id="planList"></div>`;
}
function bindPlan(){
  const list = $('#planList');
  SM.plan.forEach(d=>{
    const done = !!State.progress.dayDone[d.day];
    const card = document.createElement('div');
    card.className = 'daycard ' + (done?'done':'');
    card.innerHTML = `
      <h4>Day ${d.day}: ${d.topic} ${done?'✅':''} ${d.mock?'<span class="tag amber">MOCK</span>':''} ${d.cbat?'<span class="tag">CBAT</span>':''}</h4>
      <div style="font-size:13px;color:var(--muted);">
        📐 ${d.maths}<br>🔬 ${d.science}<br>📊 ${d.di}<br>📖 ${d.rc}<br>🧠 ${d.mental}<br>🧩 ${d.logical}
        ${d.video && d.video.length? '<br>▶️ '+d.video.map(v=>SM.videos.find(x=>x.id===v)?.title||v).join(', '):''}
      </div>
      <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
        <button class="btn btn-sm" data-day="${d.day}" data-act="toggle">${done?'Undo':'Mark done'}</button>
        ${d.video && d.video.length? `<button class="btn btn-sm btn-secondary" data-day="${d.day}" data-act="videos">▶️ Videos</button>`:''}
      </div>`;
    list.appendChild(card);
  });
  list.addEventListener('click', e=>{
    const b = e.target.closest('button'); if(!b) return;
    const day = +b.dataset.day;
    if(b.dataset.act==='toggle'){
      if(State.progress.dayDone[day]){ delete State.progress.dayDone[day]; }
      else { State.progress.dayDone[day]=true; updateStreak(); confetti(); awardXP(25,'day complete'); toast('Day '+day+' done! 🎉'); }
      save(); render('plan');
    } else if(b.dataset.act==='videos'){
      const d = SM.plan[day-1];
      location.hash='#videos';
      setTimeout(()=>{ const sel=$('#videoSelect'); if(sel && d.video.length){ sel.value=d.video[0]; sel.dispatchEvent(new Event('change')); } },100);
    }
  });
}
function updateStreak(){
  const today = new Date().toDateString();
  if(State.progress.lastActive !== today){
    State.progress.streak = (State.progress.streak||0)+1;
    State.progress.lastActive = today;
  }
}

// ===== TOPICS =====
function renderTopics(){
  const topics = [
    {name:'Mathematics',icon:'📐',marks:'part of 60',items:['Number System','Ratio & Proportion','Averages','Percentages','Profit/Loss/Discount','Time Speed Distance','Power & Work','Algebra & Linear Equations','AP, LCM, HCF','Geometry & Trigonometry','Area & Volumes','Probability & Statistics (basic)']},
    {name:'Basic Science',icon:'🔬',marks:'part of 60',items:['Units & Measurements','Mass, Weight, Density','Work, Power, Energy','Kinetic Energy','Friction','Speed & Velocity','Relative Velocity','Heat & Temperature','Basic Electricity','Levers & Simple Machines']},
    {name:'Data Interpretation',icon:'📊',marks:'30',items:['Text-based data','Tabular data','Charts & Graphs','Scatter Plots','Pie Charts','Statistical Curve Distribution','Venn Diagrams','Data Sufficiency','Data Arrangement','Multi-source Data Analysis']},
    {name:'Logical Reasoning',icon:'🧩',marks:'20',items:['Binary Logic','Syllogism','Clocks & Calendars','Assumptions','Blood Relations','Family Tree','Logic-based Puzzles']},
    {name:'Reading Comprehension',icon:'📖',marks:'part of 20',items:['History/Society/Literature/Science passages','Environment/Abstract/Mythology/Technology/Culture','Main Idea, Supporting Idea, Application, Logical Structure, Style']},
    {name:'Mental Reasoning',icon:'🧠',marks:'20',items:['Analogy','Series Completion','Coding-Decoding','Ranking & Arrangement']}
  ];
  return `<div class="card"><h2>📚 Topics & Syllabus</h2><p>Tap a topic to filter questions.</p></div>
  <div class="grid grid-2">${topics.map(t=>`
    <div class="card">
      <h2>${t.icon} ${t.name} <span class="tag">${t.marks} marks</span></h2>
      <ul style="padding-left:18px;font-size:14px;">${t.items.map(i=>`<li>${i}</li>`).join('')}</ul>
      <button class="btn btn-sm" style="margin-top:8px;" onclick="location.hash='#questions'; setTimeout(()=>{const s=document.getElementById('qTopic'); if(s){s.value='${t.name}'; s.dispatchEvent(new Event('change'));}},100);">Practice ${t.name}</button>
    </div>`).join('')}</div>`;
}
function bindTopics(){}

// ===== QUESTIONS =====
let qFilter='All', qIndex=0;
function renderQuestions(){
  const topics = ['All','Mathematics','Basic Science','Data Interpretation','Logical Reasoning','Mental Reasoning','Reading Comprehension'];
  return `
  <div class="card"><h2>❓ Question Bank</h2>
    <select class="input" id="qTopic">${topics.map(t=>`<option ${qFilter===t?'selected':''}>${t}</option>`).join('')}</select>
    <div id="qStats" style="font-size:13px;color:var(--muted);margin-bottom:8px;"></div>
  </div>
  <div id="qArea"></div>`;
}
function bindQuestions(){
  $('#qTopic').addEventListener('change', e=>{ qFilter=e.target.value; qIndex=0; showQ(); });
  showQ();
}
function filteredQs(){ return qFilter==='All'? SM.questions : SM.questions.filter(q=>q.topic===qFilter); }
function showQ(){
  const qs = filteredQs();
  const area = $('#qArea');
  const stats = $('#qStats');
  if(!qs.length){ area.innerHTML='<div class="empty">No questions for this topic yet.</div>'; stats.textContent=''; return; }
  if(qIndex>=qs.length) qIndex=0;
  const q = qs[qIndex];
  const chosen = State.answers[q.id];
  const bm = State.bookmarks.includes(q.id);
  stats.textContent = `Question ${qIndex+1} of ${qs.length} • ${q.topic} • ${State.bookmarks.includes(q.id)?'★ Bookmarked':''}`;
  area.innerHTML = `
    <div class="qbox">
      <div class="q">${q.q}</div>
      ${q.opts.map((o,i)=>`<div class="option ${chosen===i?'selected':''} ${chosen!==undefined && i===q.ans?'correct':''} ${chosen!==undefined && chosen===i && i!==q.ans?'wrong':''}" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</div>`).join('')}
      ${chosen!==undefined?`<div style="margin-top:10px;padding:10px;background:var(--bg2);border-radius:8px;font-size:14px;"><strong>Explanation:</strong> ${q.exp}</div>`:''}
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
      <button class="btn btn-sm" id="qPrev">◀ Prev</button>
      <button class="btn btn-sm" id="qNext">Next ▶</button>
      <button class="btn btn-sm btn-secondary" id="qBm">${bm?'★ Unbookmark':'☆ Bookmark'}</button>
      ${chosen!==undefined && chosen!==q.ans? `<button class="btn btn-sm btn-danger" id="qErr">Log error</button>`:''}
    </div>`;
  area.querySelectorAll('.option').forEach(opt=>{
    opt.addEventListener('click', ()=>{
      if(State.answers[q.id]!==undefined) return;
      const i = +opt.dataset.i;
      State.answers[q.id]=i; save();
      const correct = i===q.ans;
      if(correct){ soundCorrect(); haptic(15); awardXP(10,'correct answer'); }
      else { soundWrong(); haptic(40); State.errors.push({id:Date.now(), qId:q.id, topic:q.topic, myAns:i, correct:q.ans, date:new Date().toISOString(), resolved:false}); save(); }
      showFeedbackSheet(correct, q);
      showQ();
    });
  });
  $('#qPrev').addEventListener('click', ()=>{ if(qIndex>0) qIndex--; showQ(); });
  $('#qNext').addEventListener('click', ()=>{ if(qIndex<qs.length-1) qIndex++; showQ(); });
  $('#qBm').addEventListener('click', ()=>{
    const idx = State.bookmarks.indexOf(q.id);
    if(idx>=0) State.bookmarks.splice(idx,1); else State.bookmarks.push(q.id);
    save(); showQ(); toast(idx>=0?'Removed bookmark':'Bookmarked ★');
  });
  const errBtn = $('#qErr');
  if(errBtn) errBtn.addEventListener('click', ()=>{ toast('Already in error log'); });
}

// ===== FEEDBACK SHEET =====
function showFeedbackSheet(correct, q){
  let sheet = document.getElementById('feedbackSheet');
  if(!sheet){ sheet = document.createElement('div'); sheet.id='feedbackSheet'; sheet.className='feedback-sheet'; document.body.appendChild(sheet); }
  sheet.className = 'feedback-sheet show ' + (correct?'correct':'wrong');
  sheet.innerHTML = `
    <div class="result" style="color:${correct?'var(--success)':'var(--danger)'}">${correct?'✅ Correct! +10 XP':'❌ Wrong'}</div>
    <div style="font-weight:600;">${q.q}</div>
    <div class="exp"><strong>Answer:</strong> ${String.fromCharCode(65+q.ans)}. ${q.opts[q.ans]}<br><strong>Explanation:</strong> ${q.exp}</div>
    <button class="btn btn-block" id="closeFeedback">Continue</button>`;
  $('#closeFeedback').addEventListener('click', ()=>{ sheet.classList.remove('show'); });
}
// ===== MOCK TEST =====
let mockState = null;
function renderMock(){
  if(mockState && mockState.running){
    return renderMockRunning();
  }
  const history = State.scores.slice().reverse().slice(0,10);
  return `
  <div class="card"><h2>⏱️ Mock Test (120 min, 100 Q)</h2>
    <p>Simulates the real CBT. Timer, negative marking (−⅓), section-wise.</p>
    <button class="btn" id="startMock">Start new mock</button>
  </div>
  <div class="card"><h2>📊 Mock history</h2>
    ${history.length? `<table class="table"><tr><th>Date</th><th>Paper</th><th>Score</th><th>%</th></tr>
    ${history.map(s=>`<tr><td>${new Date(s.date).toLocaleDateString()}</td><td>${s.paper}</td><td>${s.score}/${s.total}</td><td>${Math.round(s.score/s.total*100)}%</td></tr>`).join('')}</table>` : '<div class="empty">No mocks yet. Start your first!</div>'}
  </div>`;
}
function bindMock(){
  if(mockState && mockState.running){ bindMockRunning(); return; }
  const b = $('#startMock'); if(b) b.addEventListener('click', startMock);
}
function startMock(){
  // build 100 Q: 60 maths+science, 20 logical, 20 mental (approx from bank)
  const pool = [...SM.questions];
  // pad to 100 by repeating if needed
  let qs = [];
  const byTopic = (t)=> pool.filter(q=>q.topic===t);
  const maths = byTopic('Mathematics').concat(byTopic('Basic Science'));
  const di = byTopic('Data Interpretation');
  const logical = byTopic('Logical Reasoning');
  const mental = byTopic('Mental Reasoning');
  const rc = byTopic('Reading Comprehension');
  // 60 for maths+science+di, 20 logical+rc, 20 mental
  function pick(arr,n){ const out=[]; for(let i=0;i<n;i++) out.push(arr[i % arr.length]); return out; }
  qs = qs.concat(pick(maths,30), pick(di,15), pick(logical,10), pick(rc,5), pick(mental,15), pick(byTopic('Logical Reasoning'),5));
  qs = qs.slice(0,100);
  // shuffle
  for(let i=qs.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [qs[i],qs[j]]=[qs[j],qs[i]]; }
  mockState = {running:true, qs, answers:{}, idx:0, start:Date.now(), timeLeft:120*60, timer:null};
  render('mock'); bindMock();
  mockState.timer = setInterval(()=>{
    mockState.timeLeft--;
    const t = $('#mockTimer'); if(t) t.textContent = formatTime(mockState.timeLeft);
    if(mockState.timeLeft<=0){ clearInterval(mockState.timer); submitMock(); }
  },1000);
}
function formatTime(s){ const m=Math.floor(s/60); const sec=s%60; return `${m}:${sec.toString().padStart(2,'0')}`; }
function renderMockRunning(){
  const q = mockState.qs[mockState.idx];
  return `
  <div class="card" style="display:flex;justify-content:space-between;align-items:center;">
    <strong>Q ${mockState.idx+1}/100</strong>
    <span class="tag amber" id="mockTimer">${formatTime(mockState.timeLeft)}</span>
    <button class="btn btn-sm btn-danger" id="submitMock">Submit</button>
  </div>
  <div class="qbox">
    <div class="q">${q.q}</div>
    ${q.opts.map((o,i)=>`<div class="option ${mockState.answers[mockState.idx]===i?'selected':''}" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</div>`).join('')}
  </div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
    <button class="btn btn-sm" id="mPrev" ${mockState.idx===0?'disabled':''}>◀ Prev</button>
    <button class="btn btn-sm" id="mNext" ${mockState.idx===99?'disabled':''}>Next ▶</button>
    <button class="btn btn-sm btn-secondary" id="mSkip">Skip</button>
  </div>`;
}
function bindMockRunning(){
  $$('#view .option').forEach(opt=>{
    opt.addEventListener('click', ()=>{
      mockState.answers[mockState.idx] = +opt.dataset.i;
      render('mock'); bindMock();
    });
  });
  const prev=$('#mPrev'), next=$('#mNext'), skip=$('#mSkip'), sub=$('#submitMock');
  if(prev) prev.addEventListener('click', ()=>{ if(mockState.idx>0){ mockState.idx--; render('mock'); bindMock(); }});
  if(next) next.addEventListener('click', ()=>{ if(mockState.idx<99){ mockState.idx++; render('mock'); bindMock(); }});
  if(skip) skip.addEventListener('click', ()=>{ if(mockState.idx<99){ mockState.idx++; render('mock'); bindMock(); }});
  if(sub) sub.addEventListener('click', ()=>{ if(confirm('Submit mock?')) submitMock(); });
}
function submitMock(){
  if(mockState.timer) clearInterval(mockState.timer);
  let score=0, neg=0;
  mockState.qs.forEach((q,i)=>{
    const a = mockState.answers[i];
    if(a===undefined) return;
    if(a===q.ans) score++; else neg += 1/3;
  });
  const final = Math.max(0, score - neg);
  State.scores.push({date:new Date().toISOString(), paper:'Mock #'+(State.scores.length+1), score:+final.toFixed(2), total:100, timeTaken: (Date.now()-mockState.start)/1000});
  // log errors
  mockState.qs.forEach((q,i)=>{
    const a = mockState.answers[i];
    if(a!==undefined && a!==q.ans){
      State.errors.push({id:Date.now()+i, qId:q.id||('mock'+i), topic:q.topic, myAns:a, correct:q.ans, date:new Date().toISOString(), resolved:false});
    }
  });
  save();
  mockState=null;
  confetti();
  toast('Mock submitted! Score: '+final.toFixed(2)+'/100');
  render('mock');
}

// ===== VIDEOS =====
function renderVideos(){
  return `
  <div class="card"><h2>▶️ Video Lessons (iframe)</h2>
    <select class="input" id="videoSelect">${SM.videos.map(v=>`<option value="${v.id}">${v.title}</option>`).join('')}</select>
  </div>
  <div class="card" id="videoCard">
    <div class="video-wrap"><iframe id="videoFrame" src="${SM.videos[0].url}" allowfullscreen></iframe></div>
    <div style="margin-top:8px;display:flex;gap:8px;">
      <button class="btn btn-sm" id="markWatched">✓ Mark watched</button>
      <span id="watchedStatus" style="align-self:center;font-size:13px;color:var(--muted);"></span>
    </div>
  </div>`;
}
function bindVideos(){
  const sel = $('#videoSelect');
  const frame = $('#videoFrame');
  const status = $('#watchedStatus');
  function update(){ 
    const v = SM.videos.find(x=>x.id===sel.value);
    frame.src = v.url;
    status.textContent = State.watched[v.id]?'✅ Watched':'Not watched';
  }
  sel.addEventListener('change', update);
  update();
  $('#markWatched').addEventListener('click', ()=>{
    State.watched[sel.value]=true; save(); update(); toast('Marked watched ✅');
  });
}

// ===== CBAT =====
function renderCbat(){
  return `
  <div class="card"><h2>🧠 CBAT Drill (30% of merit)</h2>
    <p>Min T-score 42 in each battery. No negative marking. English & Hindi only. Mandatory Vision Certificate (Annexure VI).</p>
    <div class="grid grid-2">
      <div class="card stat"><div class="num">42</div><div class="lbl">Min T-score/battery</div></div>
      <div class="card stat"><div class="num">8×</div><div class="lbl">Shortlist ratio</div></div>
      <div class="card stat"><div class="num">30%</div><div class="lbl">Merit weightage</div></div>
      <div class="card stat"><div class="num">0</div><div class="lbl">Negative marking</div></div>
    </div>
  </div>
  <div class="card"><h2>❓ CBAT Quiz (6 Q)</h2><div id="cbatArea"></div></div>
  <div class="card"><h2>🎯 Concentration drill</h2>
    <p>Number cancellation: find all "7"s in the grid within 60s.</p>
    <button class="btn" id="startDrill">Start 60s drill</button>
    <div id="drillArea" style="margin-top:10px;font-family:monospace;font-size:18px;letter-spacing:4px;line-height:1.8;"></div>
    <div id="drillResult" style="margin-top:8px;font-weight:600;"></div>
  </div>`;
}
function bindCbat(){
  // CBAT quiz
  const area = $('#cbatArea');
  area.innerHTML = SM.cbat.map((q,i)=>`
    <div class="qbox"><div class="q">${i+1}. ${q.q}</div>
    ${q.opts.map((o,j)=>`<div class="option cbat-opt" data-i="${j}" data-q="${i}">${String.fromCharCode(65+j)}. ${o}</div>`).join('')}
    </div>`).join('');
  area.addEventListener('click', e=>{
    const opt = e.target.closest('.cbat-opt'); if(!opt) return;
    const qi=+opt.dataset.q, oi=+opt.dataset.i;
    const correct = SM.cbat[qi].ans===oi;
    opt.classList.add(correct?'correct':'wrong');
    if(!correct){ const right = area.querySelector(`.cbat-opt[data-q="${qi}"][data-i="${SM.cbat[qi].ans}"]`); if(right) right.classList.add('correct'); }
    toast(correct?'Correct ✅':'Wrong ❌');
  });
  // drill
  $('#startDrill').addEventListener('click', ()=>{
    const grid = [];
    for(let i=0;i<10;i++){ let row=''; for(let j=0;j<20;j++) row += Math.floor(Math.random()*10)+' '; grid.push(row); }
    $('#drillArea').innerHTML = grid.join('<br>');
    $('#drillResult').textContent = 'Count the 7s... 60s';
    let found=0;
    const handler = (e)=>{ if(e.key==='7'){ found++; $('#drillResult').textContent = `Found: ${found}`; } };
    document.addEventListener('keydown', handler);
    setTimeout(()=>{ document.removeEventListener('keydown',handler); $('#drillResult').textContent = `Time up! You found ${found} sevens.`; }, 60000);
  });
}

// ===== FORMULAS =====
function renderFormulas(){
  return `
  <div class="card"><h2>📐 Formula Notebook</h2>
    <input class="input" id="fSearch" placeholder="Search formula...">
  </div>
  <div id="fList"></div>`;
}
function bindFormulas(){
  const list = $('#fList');
  function draw(filter=''){
    const f = filter.toLowerCase();
    const items = SM.formulas.filter(x=>x.t.toLowerCase().includes(f)||x.f.toLowerCase().includes(f));
    list.innerHTML = items.map(x=>`<div class="card"><strong>${x.t}</strong><div style="font-family:monospace;margin-top:4px;color:var(--primary);">${x.f}</div></div>`).join('') || '<div class="empty">No matches.</div>';
  }
  draw();
  $('#fSearch').addEventListener('input', e=>draw(e.target.value));
}

// ===== ERROR LOG =====
function renderErrors(){
  const open = State.errors.filter(e=>!e.resolved);
  const resolved = State.errors.filter(e=>e.resolved);
  return `
  <div class="card"><h2>📕 Error Log (${open.length} open)</h2>
    <button class="btn btn-sm btn-danger" id="clearResolved">Clear resolved</button>
  </div>
  <div id="errList"></div>`;
}
function bindErrors(){
  const list = $('#errList');
  function draw(){
    if(!State.errors.length){ list.innerHTML='<div class="empty">No errors logged. Great! Keep solving.</div>'; return; }
    list.innerHTML = State.errors.map(e=>`
      <div class="card" style="border-left:4px solid ${e.resolved?'var(--success)':'var(--danger)'};">
        <div style="font-size:13px;color:var(--muted);">${new Date(e.date).toLocaleDateString()} • ${e.topic}</div>
        <div style="margin:4px 0;">Q: ${esc(findQ(e.qId)?.q || e.qId)}</div>
        <div>Your answer: <span style="color:var(--danger)">${String.fromCharCode(65+e.myAns)}</span> • Correct: <span style="color:var(--success)">${String.fromCharCode(65+e.correct)}</span></div>
        <div style="margin-top:6px;">
          <button class="btn btn-sm ${e.resolved?'btn-secondary':'btn-success'}" data-id="${e.id}" data-act="resolve">${e.resolved?'Reopen':'Resolve'}</button>
          <button class="btn btn-sm btn-danger" data-id="${e.id}" data-act="del">Delete</button>
        </div>
      </div>`).join('');
  }
  draw();
  list.addEventListener('click', e=>{
    const b = e.target.closest('button'); if(!b) return;
    const id = +b.dataset.id;
    if(b.dataset.act==='resolve'){
      const err = State.errors.find(x=>x.id===id); if(err) err.resolved=!err.resolved; save(); draw(); toast('Updated');
    } else if(b.dataset.act==='del'){
      State.errors = State.errors.filter(x=>x.id!==id); save(); draw(); toast('Deleted');
    }
  });
  $('#clearResolved').addEventListener('click', ()=>{
    State.errors = State.errors.filter(e=>!e.resolved); save(); draw(); toast('Cleared resolved');
  });
}
function findQ(id){ return SM.questions.find(q=>q.id===id); }

// ===== BACKUP =====
function renderBackup(){
  return `
  <div class="card"><h2>💾 Backup / Restore (on device)</h2>
    <p>All data stays on this device. Export a JSON backup to keep safe.</p>
    <button class="btn" id="exportBtn">⬇️ Export backup (JSON)</button>
    <label class="label">Import backup file</label>
    <input class="input" type="file" id="importFile" accept="application/json">
    <button class="btn btn-danger" id="resetBtn" style="margin-top:12px;">🗑️ Reset all data</button>
  </div>
  <div class="card"><h2>📱 Install as app</h2>
    <p>Use browser menu → "Add to Home Screen" to install this PWA.</p>
    <button class="btn btn-sm" id="notifBtn" style="margin-top:8px;">🔔 Enable daily reminder</button>
  </div>`;
}
function bindBackup(){
  $('#exportBtn').addEventListener('click', ()=>{
    const data = {profile:State.profile,receipt:State.receipt,progress:State.progress,scores:State.scores,errors:State.errors,bookmarks:State.bookmarks,watched:State.watched,answers:State.answers,theme:State.theme,exportedAt:new Date().toISOString()};
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='sm-prep-backup.json'; a.click(); URL.revokeObjectURL(url);
    toast('Backup downloaded ✅');
  });
  $('#importFile').addEventListener('change', e=>{
    const f=e.target.files[0]; if(!f) return;
    const rd=new FileReader();
    rd.onload=()=>{
      try {
        const d = JSON.parse(rd.result);
        State.profile=d.profile||null; State.receipt=d.receipt||null; State.progress=d.progress||State.progress;
        State.scores=d.scores||[]; State.errors=d.errors||[]; State.bookmarks=d.bookmarks||[];
        State.watched=d.watched||{}; State.answers=d.answers||{}; State.theme=d.theme||'light';
        save(); applyTheme(); toast('Restored ✅'); render('backup');
      } catch(err){ toast('Invalid file ❌'); }
    };
    rd.readAsText(f);
  });
  $('#resetBtn').addEventListener('click', ()=>{
    if(!confirm('Reset ALL data on this device?')) return;
    ['profile','receipt','progress','scores','errors','bookmarks','watched','answers','theme','xp','dailyGoal','onboardingDone'].forEach(k=>Store.remove(k));
    location.reload();
  });
  const nb = $('#notifBtn');
  if(nb) nb.addEventListener('click', async ()=>{
    if(!('Notification' in window)){ toast('Notifications not supported'); return; }
    const perm = await Notification.requestPermission();
    if(perm==='granted'){ toast('Daily reminder enabled ✅'); new Notification('Station Master Prep',{body:'Time to study! Open the app.'}); }
    else toast('Permission denied');
  });
}

// ===== SOUND & HAPTICS =====
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function beep(freq=660, dur=120, type='sine', vol=0.12){
  try {
    if(!audioCtx) audioCtx = new AudioCtx();
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    o.type=type; o.frequency.value=freq; g.gain.value=vol;
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur/1000);
  } catch(e){}
}
function soundCorrect(){ beep(880,120,'sine',0.12); setTimeout(()=>beep(1320,120,'sine',0.1),120); }
function soundWrong(){ beep(220,200,'square',0.1); }
function haptic(ms=10){ try{ if(navigator.vibrate) navigator.vibrate(ms); }catch(e){} }
function awardXP(n, reason){
  State.xp = (State.xp||0)+n; save();
  toast(`+${n} XP ${reason||''}`.trim());
}

// ===== HELPERS =====
function esc(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function confetti(){
  const c = document.createElement('div');
  c.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(c);
  for(let i=0;i<60;i++){
    const p=document.createElement('div');
    p.style.cssText=`position:absolute;left:${Math.random()*100}%;top:-10px;width:8px;height:8px;background:${['#2563eb','#f59e0b','#16a34a','#dc2626','#a855f7'][Math.floor(Math.random()*5)]};border-radius:2px;animation:fall ${1.5+Math.random()*1.5}s linear forwards;`;
    c.appendChild(p);
  }
  const style=document.createElement('style');
  style.textContent='@keyframes fall{to{transform:translateY(100vh) rotate(720deg);opacity:0;}}';
  document.head.appendChild(style);
  setTimeout(()=>{c.remove();style.remove();},3200);
}

// PWA install prompt
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredPrompt=e; });

// Service worker
if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js').catch(()=>{}); }

// Init
route();