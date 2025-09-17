// Sample train data
let trains = [
  {id:'12523', name:'Rajdhani Express', priority:'high', pos:0.2, speed:0.6},
  {id:'22045', name:'Mail Express', priority:'med', pos:0.6, speed:0.4},
  {id:'19411', name:'Local', priority:'low', pos:0.05, speed:0.3},
];

const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

// draw map
function drawMap(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // tracks
  ctx.strokeStyle="#555"; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(100,150); ctx.lineTo(700,150); ctx.stroke();

  // trains
  trains.forEach(t=>{
    let x = 100 + (600 * t.pos);
    ctx.beginPath();
    ctx.fillStyle = t.priority==='high'?'red':t.priority==='med'?'orange':'lime';
    ctx.arc(x,150,10,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="white"; ctx.fillText(t.id,x-15,135);
  });
}

// step simulation
function step(){
  trains.forEach(t=>{
    t.pos += t.speed*0.002;
    if(t.pos>1) t.pos=0;
  });
  drawMap();
  updateSuggestions();
  requestAnimationFrame(step);
}
requestAnimationFrame(step);

// Render train list
function renderTrainList(){
  const list = document.getElementById('trainList');
  list.innerHTML="";
  trains.forEach(t=>{
    const div=document.createElement('div');
    div.className="train-item";
    div.innerHTML = `<div><b>${t.name}</b><div class="meta">${t.id}</div></div>
                     <div class="meta">${t.priority}</div>`;
    list.appendChild(div);
  });
}
renderTrainList();

// Add train
document.getElementById('addTrainBtn').addEventListener('click',()=>{
  const name=document.getElementById('newTrainName').value||"Demo Train";
  const pr=document.getElementById('newPriority').value;
  const id=Math.floor(Math.random()*90000+10000);
  trains.push({id, name, priority:pr, pos:0, speed:0.4});
  renderTrainList();
});

// Clock
setInterval(()=>{
  document.getElementById('clock').textContent=new Date().toLocaleTimeString();
},1000);

// AI suggestions (simple heuristic)
function updateSuggestions(){
  const box=document.getElementById('aiSuggestions');
  box.innerHTML="";
  trains.forEach(t=>{
    let sug="Maintain speed";
    if(t.priority==="high" && t.pos>0.5) sug="Give priority path";
    const div=document.createElement('div');
    div.className="ai-suggestion";
    div.textContent=`${t.name} (${t.id}) → ${sug}`;
    box.appendChild(div);
  });
}

// Export CSV
document.getElementById('exportCsv').addEventListener('click',()=>{
  let csv="id,name,priority,pos,speed\n";
  trains.forEach(t=>{
    csv+=`${t.id},${t.name},${t.priority},${t.pos.toFixed(2)},${t.speed}\n`;
  });
  const blob=new Blob([csv],{type:"text/csv"});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download="trains.csv"; a.click();
});

// Clear all
document.getElementById('clearAll').addEventListener('click',()=>{
  trains=[]; renderTrainList();
});
