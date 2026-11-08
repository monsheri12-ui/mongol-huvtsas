(function(){
'use strict';
const {items,byId,palette,basePalette,icon,art,avatar,available,phrase}=window.WARDROBE;
const sounds=window.WARDROBE_AUDIO||{};
const $=id=>document.getElementById(id);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slots=['top','bottom','full','tie','suspenders','vest','outer','belt','socks','shoes','hat','scarf','gloves','glasses','earrings','necklace','watch','bracelet','ring','anklet','brooch','piercing','bag'];
const modes=['outfits','challenge','colors','stories','free'];
const outfitData=window.WARDROBE_SCENARIOS||{groups:[],scenarios:[],illustration:()=>''};
const storageKey='huvtsas-mn-v1';
const activityCopy={outfits:['Собираем образ','Ситуации, вещи и цвета'],challenge:['Узнаём одежду','Повторяем слова через примерку'],colors:['Играем с цветами','Находим вещь нужного оттенка'],stories:['Истории вещей','Размеры, семья и своя обувь'],free:['Свободная примерка','']};
function activityArt(mode){
 const sets={outfits:[['sweater','#84a77c'],['jeans','#648ab7'],['sneakers','#eee9dc']],challenge:[['shirt','#91bfd4'],['hoodie','#bc9580'],['pants','#8d9b78']],colors:[['gloves','#dca4ba'],['tshirt','#e89d46'],['bag','#729d97']],stories:[['ankleboots','#a17f61'],['sneakers','#91bfd4'],['gloves','#84a77c']],free:[['blouse','#a28ab6'],['leatherbelt','#8d6246'],['bag','#c6a66d']]};
 return '<span class="activity-art-stage">'+sets[mode].map(([id,c],n)=>'<span class="activity-object object-'+n+'">'+art(id,c,state.hero)+'</span>').join('')+'</span>';
}
const collections=[['clothing','Одежда'],['shoes','Обувь'],['jewelry','Украшения'],['accessories','Аксессуары']];
const categories=[['all','Вся одежда'],['tops','Верх'],['outer','Куртки и пальто'],['bottoms','Брюки и юбки'],['full','Платья и комплекты'],['summer','Лето и пляж'],['underwear','Бельё и сон'],['warm','Шапки, перчатки, носки']];
const scenes=[
{id:'walk',title:'На прогулку',icon:'sun',tag:'daily'},
{id:'summer',title:'Лето и пляж',icon:'sun',tag:'summer'},
{id:'winter',title:'Холодный день',icon:'snow',tag:'winter'},
{id:'office',title:'В офис',icon:'hanger',tag:'office'},
{id:'sport',title:'Спорт',icon:'spark',tag:'sport'},
{id:'home',title:'Дома',icon:'flower',tag:'home'},
{id:'festival',title:'На праздник',icon:'flower',words:['dress','deel','tallboots','earrings','necklace']},
{id:'footwear',title:'Обувь',icon:'grid',group:'shoes'},
{id:'ornaments',title:'Украшения',icon:'star',group:'jewelry'},
{id:'clothes',title:'Вся одежда',icon:'hanger',group:'clothing'},
{id:'all',title:'Все слова',icon:'grid'}];
const colorTasks=[['gloves','pink'],['shirt','blue'],['tallboots','green'],['hat','yellow'],['scarf','red'],['pants','black'],['tshirt','white'],['bag','brown']];
const stories=[
{id:'brother-boots',item:'boots',color:'green',size:'big',title:'Ботинки старшего брата',mn:'Өө, энэ гутал надад том байна, миний ахынх байх. Харин миний гутал бор өнгөтэй.',ru:'Ой, эти ботинки мне велики — наверное, они моего старшего брата. А мои ботинки коричневые.',ownColor:'brown',ownMn:'Харин миний гутал бор өнгөтэй.',ownRu:'А мои ботинки коричневые.',foundMn:'Энэ миний гутал. Надад таарч байна.',parts:[['том','большой'],['ахынх','принадлежит старшему брату'],['бор','коричневый']]},
{id:'sister-sneakers',item:'sneakers',color:'blue',size:'big',title:'Кроссовки старшей сестры',mn:'Өө, энэ пүүз надад том байна, миний эгчийнх байх. Харин миний пүүз цагаан өнгөтэй.',ru:'Ой, эти кроссовки мне велики — наверное, они моей старшей сестры. А мои кроссовки белые.',ownColor:'white',ownMn:'Харин миний пүүз цагаан өнгөтэй.',ownRu:'А мои кроссовки белые.',foundMn:'Энэ миний пүүз. Надад таарч байна.',parts:[['том','большой'],['эгчийнх','принадлежит старшей сестре'],['цагаан','белый']]},
{id:'little-brother',item:'boots',color:'brown',size:'small',title:'Ботинки младшего брата',mn:'Энэ гутал надад жижиг байна, миний эрэгтэй дүүгийнх байх. Харин миний гутал хар өнгөтэй.',ru:'Эти ботинки мне малы — наверное, они моего младшего брата. А мои ботинки чёрные.',ownColor:'black',ownMn:'Харин миний гутал хар өнгөтэй.',ownRu:'А мои ботинки чёрные.',foundMn:'Энэ миний гутал. Надад таарч байна.',parts:[['жижиг','маленький'],['эрэгтэй дүүгийнх','принадлежит младшему брату'],['хар','чёрный']]},
{id:'little-sister',item:'sneakers',color:'pink',size:'small',title:'Кроссовки младшей сестры',mn:'Энэ пүүз надад жижиг байна, миний эмэгтэй дүүгийнх байх. Харин миний пүүз хөх өнгөтэй.',ru:'Эти кроссовки мне малы — наверное, они моей младшей сестры. А мои кроссовки синие.',ownColor:'blue',ownMn:'Харин миний пүүз хөх өнгөтэй.',ownRu:'А мои кроссовки синие.',foundMn:'Энэ миний пүүз. Надад таарч байна.',parts:[['жижиг','маленький'],['эмэгтэй дүүгийнх','принадлежит младшей сестре'],['хөх','синий']]},
{id:'little-sibling',item:'gloves',color:'pink',size:'small',title:'Маленькие перчатки',mn:'Энэ бээлий надад жижиг байна, миний дүүгийнх байх. Харин миний бээлий улаан өнгөтэй.',ru:'Эти перчатки мне малы — наверное, они моего младшего брата или младшей сестры. А мои перчатки красные.',ownColor:'red',ownMn:'Харин миний бээлий улаан өнгөтэй.',ownRu:'А мои перчатки красные.',foundMn:'Энэ миний бээлий. Надад таарч байна.',parts:[['жижиг','маленький'],['дүүгийнх','принадлежит младшему брату или младшей сестре'],['улаан','красный']]},
{id:'fits-me',item:'shirt',color:'blue',size:'fit',title:'Моя рубашка',mn:'Энэ цамц надад таарч байна. Миний цамц хөх өнгөтэй.',ru:'Эта рубашка мне по размеру. Моя рубашка синяя.',parts:[['надад','мне'],['миний','мой'],['хөх','синий']]},
{"id":"father-boots","item":"winterboots","color":"black","size":"big","title":"Ботинки папы","mn":"Энэ өвлийн гутал надад том байна, миний аавынх байх. Харин миний өвлийн гутал бор өнгөтэй.","ru":"Эти зимние ботинки мне велики — наверное, они моего папы. А мои зимние ботинки коричневые.","ownColor":"brown","ownMn":"Харин миний өвлийн гутал бор өнгөтэй.","ownRu":"А мои зимние ботинки коричневые.","foundMn":"Энэ миний өвлийн гутал. Надад таарч байна.","parts":[["том","большой"],["аавынх","принадлежит: папы"],["бор","коричневые"]]},
{"id":"father-sandals","item":"sandals","color":"brown","size":"big","title":"Сандалии папы","mn":"Энэ сандаал надад том байна, миний аавынх байх. Харин миний сандаал хөх өнгөтэй.","ru":"Эти сандалии мне велики — наверное, они моего папы. А мои сандалии синие.","ownColor":"blue","ownMn":"Харин миний сандаал хөх өнгөтэй.","ownRu":"А мои сандалии синие.","foundMn":"Энэ миний сандаал. Надад таарч байна.","parts":[["том","большой"],["аавынх","принадлежит: папы"],["хөх","синие"]]},
{"id":"mother-slippers","item":"slippers","color":"pink","size":"big","title":"Тапочки мамы","mn":"Энэ гэрийн шаахай надад том байна, миний ээжийнх байх. Харин миний гэрийн шаахай цагаан өнгөтэй.","ru":"Эти домашние тапочки мне велики — наверное, они моей мамы. А мои домашние тапочки белые.","ownColor":"white","ownMn":"Харин миний гэрийн шаахай цагаан өнгөтэй.","ownRu":"А мои домашние тапочки белые.","foundMn":"Энэ миний гэрийн шаахай. Надад таарч байна.","parts":[["том","большой"],["ээжийнх","принадлежит: мамы"],["цагаан","белые"]]},
{"id":"brother-galoshes","item":"galoshes","color":"green","size":"big","title":"Галоши старшего брата","mn":"Энэ галош надад том байна, миний ахынх байх. Харин миний галош хар өнгөтэй.","ru":"Эти галоши мне велики — наверное, они моего старшего брата. А мои галоши чёрные.","ownColor":"black","ownMn":"Харин миний галош хар өнгөтэй.","ownRu":"А мои галоши чёрные.","foundMn":"Энэ миний галош. Надад таарч байна.","parts":[["том","большой"],["ахынх","принадлежит: старшего брата"],["хар","чёрные"]]},
{"id":"friend-gloves","item":"gloves","color":"white","size":"big","title":"Перчатки друга","mn":"Энэ бээлий надад том байна, миний найзынх байх. Харин миний бээлий хөх өнгөтэй.","ru":"Эти перчатки мне велики — наверное, они моего друга. А мои перчатки синие.","ownColor":"blue","ownMn":"Харин миний бээлий хөх өнгөтэй.","ownRu":"А мои перчатки синие.","foundMn":"Энэ миний бээлий. Надад таарч байна.","parts":[["том","большой"],["найзынх","принадлежит: друга"],["хөх","синие"]]},
{"id":"sister-rainboots","item":"rainboots","color":"yellow","size":"small","title":"Сапоги младшей сестры","mn":"Энэ усны гутал надад жижиг байна, миний эмэгтэй дүүгийнх байх. Харин миний усны гутал улаан өнгөтэй.","ru":"Эти резиновые сапоги мне малы — наверное, они моей младшей сестры. А мои резиновые сапоги красные.","ownColor":"red","ownMn":"Харин миний усны гутал улаан өнгөтэй.","ownRu":"А мои резиновые сапоги красные.","foundMn":"Энэ миний усны гутал. Надад таарч байна.","parts":[["жижиг","маленький"],["эмэгтэй дүүгийнх","принадлежит: младшей сестры"],["улаан","красные"]]}
];
let storageAvailable=true,toastTimer,sparkleTimer,playing,nativeVoice;
function cleanOutfit(value,hero){const out={};if(value&&typeof value==='object')for(const slot of slots){const i=byId[value[slot]];if(i&&i.slot===slot&&(!i.only||i.only===hero))out[slot]=i.id;}if(out.full){delete out.top;delete out.bottom;}return out;}
function cleanColors(value){const out={},legacy={'#b1bd76':'lime','#c8d19f':'light-lime','#e1e5ca':'verylight-lime','#7f8855':'dark-lime','#535937':'verydark-lime','#ddbf68':'yellow','#e7d295':'light-yellow','#f2e6c4':'verylight-yellow','#9f8a4b':'dark-yellow','#685a31':'verydark-yellow','#d49bb2':'pink','#7197bf':'blue','#8ca77e':'green','#c87d75':'red','#d9be70':'yellow','#ede9dd':'white','#58615d':'black','#ab8b70':'brown','#d99960':'orange'};if(value&&typeof value==='object')for(const i of items)if(/^#[0-9a-f]{6}$/i.test(value[i.id]||'')){const c=value[i.id];const migrated=legacy[c]?palette.find(p=>p.id===legacy[c]).color:c;const rgb=h=>[1,3,5].map(n=>parseInt(h.slice(n,n+2),16));const distance=h=>rgb(h).reduce((sum,v,n)=>sum+(v-rgb(migrated)[n])**2,0);out[i.id]=palette.some(p=>p.color===migrated)?migrated:palette.reduce((a,b)=>distance(a.color)<distance(b.color)?a:b).color;}return out;}
function cleanSizes(value){const out={};if(value&&typeof value==='object')for(const i of items)if(['big','small','fit'].includes(value[i.id]))out[i.id]=value[i.id];return out;}
function readProfile(){let p={};try{p=JSON.parse(localStorage.getItem(storageKey)||'{}')||{};}catch{storageAvailable=false;}
const hero=p.hero==='temuulen'?'temuulen':'nomin';
return {speechMode:p.speechMode==='parts'?'parts':'whole',outfitPalette:['basic','light','dark','all'].includes(p.outfitPalette)?p.outfitPalette:'basic',outfitAttempts:p.outfitAttempts&&typeof p.outfitAttempts==='object'?p.outfitAttempts:{},outfitGroup:outfitData.groups.some(g=>g.id===p.outfitGroup)?p.outfitGroup:null,outfitId:outfitData.scenarios.some(o=>o.id===p.outfitId)?p.outfitId:null,finishedOutfits:Array.isArray(p.finishedOutfits)?p.finishedOutfits.filter(id=>typeof id==='string'):[],session:p.session&&typeof p.session==='object'?p.session:null,hero,mode:modes.includes(p.mode)?p.mode:'challenge',scene:scenes.some(s=>s.id===p.scene)?p.scene:'walk',colorGroup:['basic','light','dark','all'].includes(p.colorGroup)?p.colorGroup:'basic',known:[...new Set((Array.isArray(p.known)?p.known:[]).filter(id=>byId[id]))],colorKnown:Array.isArray(p.colorKnown)?p.colorKnown.filter(v=>typeof v==='string'):[],seenStories:Array.isArray(p.seenStories)?p.seenStories.filter(id=>stories.some(s=>s.id===id)):[],looks:p.looks&&typeof p.looks==='object'?p.looks:{},equipped:cleanOutfit(p.equipped,hero),colors:cleanColors(p.colors),sizes:cleanSizes(p.sizes),album:(Array.isArray(p.album)?p.album:[]).filter(o=>o&&typeof o.id==='string').slice(0,12).map(o=>({id:o.id,name:String(o.name||'Мой образ').slice(0,45),date:Number(o.date)||Date.now(),hero:o.hero==='temuulen'?'temuulen':'nomin',equipped:cleanOutfit(o.equipped,o.hero),colors:cleanColors(o.colors),sizes:cleanSizes(o.sizes)}))};}
const profile=readProfile();
const state={speechMode:profile.speechMode,outfitPalette:profile.outfitPalette,outfitGroup:profile.outfitGroup,outfitId:profile.outfitId,hero:profile.hero,mode:profile.mode,scene:profile.scene,colorGroup:profile.colorGroup,equipped:{...profile.equipped},colors:{...profile.colors},sizes:{...profile.sizes},selected:null,collection:'clothing',query:'',category:'all',page:0,queue:[],index:0,choices:[],solved:[],independent:0,answered:false,complete:false,hint:false,errors:0,wrong:null,translation:false,searchingOwn:false,foundOwn:false};
let keyboardNavigation=false;
document.addEventListener?.('keydown',event=>{if(['Tab','Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))keyboardNavigation=true;},true);
document.addEventListener?.('pointerdown',()=>{keyboardNavigation=false;},true);
function keyboardFocusWithin(id){return keyboardNavigation&&!!$(id)?.contains?.(document.activeElement);}
function focusChoice(key){const buttons=[...($('clothesGrid')?.querySelectorAll?.('[data-item]')||[])];(buttons.find(button=>button.dataset.item===key)||buttons[0])?.focus({preventScroll:true});}
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;};
const current=()=>{const task=state.queue[state.index];return state.searchingOwn&&task?.story?{...task,id:task.story.ownItem||task.id,color:task.story.ownColor,size:'fit',own:true}:task;};
const colorById=id=>palette.find(p=>p.id===id);
const colorDistance=(a,b)=>Math.sqrt([1,3,5].reduce((n,k)=>n+(parseInt(a.slice(k,k+2),16)-parseInt(b.slice(k,k+2),16))**2,0));
const plural=(n,one,few,many)=>n+' '+(n%100>=11&&n%100<=14?many:n%10===1?one:[2,3,4].includes(n%10)?few:many);
const sceneWords=s=>s.id==='all'?available(state.hero).map(i=>i.id):s.group?available(state.hero).filter(i=>i.group===s.group).map(i=>i.id):s.tag?available(state.hero).filter(i=>i.tags.includes(s.tag)).map(i=>i.id):s.id==='festival'&&state.hero==='temuulen'?['maledeel','pants','vest','belt','boots','watch']:s.words.filter(id=>!byId[id].only||byId[id].only===state.hero);
function updateStatus(){
$('storageStatus').innerHTML=storageAvailable?'<span class="status-dot"></span>Прогресс сохраняется в этом браузере':'Браузер не разрешает сохранять прогресс';
$('knownCount').hidden=true;$('knownCount').textContent='';
$('albumCount').hidden=true;$('albumCount').textContent='';
}
function persist(){
Object.assign(profile,{speechMode:state.speechMode,outfitPalette:state.outfitPalette,outfitGroup:state.outfitGroup,outfitId:state.outfitId,hero:state.hero,mode:state.mode,scene:state.scene,colorGroup:state.colorGroup,equipped:{...state.equipped},colors:{...state.colors},sizes:{...state.sizes}});
profile.session=state.mode==='free'?null:{outfitGroup:state.outfitGroup,outfitId:state.outfitId,hero:state.hero,mode:state.mode,scene:state.scene,colorGroup:state.colorGroup,queue:state.queue.map(t=>({id:t.id,color:t.color,size:t.size,storyId:t.story?.id})),index:state.index,solved:[...state.solved],independent:state.independent,answered:state.answered,complete:state.complete,hint:state.hint,errors:state.errors,searchingOwn:state.searchingOwn,foundOwn:state.foundOwn};
profile.looks[state.hero]={equipped:{...state.equipped},colors:{...state.colors},sizes:{...state.sizes}};
try{const text=JSON.stringify(profile);localStorage.setItem(storageKey,text);storageAvailable=localStorage.getItem(storageKey)===text;}catch{storageAvailable=false;}updateStatus();
}
function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3500);}
function sparkle(){clearTimeout(sparkleTimer);$('dressSparkles').classList.remove('play');void $('dressSparkles').offsetWidth;$('dressSparkles').classList.add('play');sparkleTimer=setTimeout(()=>$('dressSparkles').classList.remove('play'),700);}
function getVoice(){nativeVoice=window.speechSynthesis?.getVoices().find(v=>/^mn(?:-|$)/i.test(v.lang));}getVoice();window.speechSynthesis?.addEventListener('voiceschanged',getVoice);
function soundButton(key,text){
 const button=`<button class="small-icon word-audio" data-sound="${esc(key)}" data-spoken="${esc(text)}" aria-label="Послушать: ${esc(text)}" title="Монгольское произношение"><span class="icon">${icon('volume')}</span></button>`;
 if(!key.startsWith('phrase-')||recordedPhraseKeys(key,'parts').length!==2)return button;
 return '<span class="phrase-audio-controls">'+button+'<span class="speech-mode-control" role="group" aria-label="Режим озвучки словосочетания">'+[['whole','Целиком'],['parts','По словам']].map(([mode,label])=>`<button type="button" data-speech-mode="${mode}" aria-pressed="${state.speechMode===mode}">${label}</button>`).join('')+'</span></span>';
}
let speechContext,speechToken=0,speechNodes=[],speechFallbackTimer=0;const speechCache=new Map();
function speechRange(buffer){
 const channel=buffer.getChannelData(0),step=Math.max(1,Math.floor(buffer.sampleRate*.012));let first=-1,last=0;
 for(let n=0;n<channel.length;n+=step){let peak=0;for(let i=n;i<Math.min(channel.length,n+step);i++)peak=Math.max(peak,Math.abs(channel[i]));if(peak>.0025){if(first<0)first=n;last=Math.min(channel.length,n+step);}}
 if(first<0)return {offset:0,duration:buffer.duration};const offset=Math.max(0,first/buffer.sampleRate-.035),end=Math.min(buffer.duration,last/buffer.sampleRate+.045);return {offset,duration:end-offset};
}
function speechKeepRanges(buffer){
 const data=buffer.getChannelData(0),rate=buffer.sampleRate,step=Math.max(1,Math.floor(rate*.01)),silences=[];let start=-1;
 for(let n=0;n<data.length;n+=step){let peak=0;for(let i=n;i<Math.min(data.length,n+step);i++)peak=Math.max(peak,Math.abs(data[i]));if(peak<.0015){if(start<0)start=n;}else if(start>=0){if(n-start>rate*.14)silences.push([start,n]);start=-1;}}
 if(start>=0&&data.length-start>rate*.14)silences.push([start,data.length]);
 let cursor=0,ranges=[];for(const [a,b] of silences){const keepLeft=a===0?0:Math.floor(rate*.037),keepRight=b===data.length?0:Math.floor(rate*.037);const end=Math.min(data.length,a+keepLeft);if(end>cursor)ranges.push([cursor,end]);cursor=Math.max(cursor,b-keepRight);}if(cursor<data.length)ranges.push([cursor,data.length]);return ranges.length?ranges:[[0,data.length]];
}
async function speechBuffer(key){
 if(speechCache.has(key)){const value=speechCache.get(key);speechCache.delete(key);speechCache.set(key,value);return value;}
 const bytes=Uint8Array.from(atob(sounds[key].split(',')[1]),c=>c.charCodeAt(0));const decoded=await speechContext.decodeAudioData(bytes.buffer),ranges=key.startsWith('story-')?[[0,decoded.length]]:speechKeepRanges(decoded),length=ranges.reduce((n,[a,b])=>n+b-a,0),buffer=speechContext.createBuffer(decoded.numberOfChannels,length,decoded.sampleRate);for(let channel=0;channel<decoded.numberOfChannels;channel++){const source=decoded.getChannelData(channel),target=buffer.getChannelData(channel);let offset=0;for(const [a,b] of ranges){target.set(source.subarray(a,b),offset);offset+=b-a;}}const value={buffer,...speechRange(buffer)};speechCache.set(key,value);if(speechCache.size>48)speechCache.delete(speechCache.keys().next().value);return value;
}
function joinSpeechBuffers(words){
 const rate=speechContext.sampleRate,gap=Math.round(rate*(state.speechMode==='parts'?.45:0)),parts=words.map(word=>({word,start:Math.round(word.offset*rate),length:Math.max(1,Math.round(word.duration*rate))}));
 const length=parts.reduce((n,part)=>n+part.length,0)+gap*(parts.length-1),channels=Math.max(...words.map(word=>word.buffer.numberOfChannels)),buffer=speechContext.createBuffer(channels,length,rate),fade=Math.max(1,Math.round(rate*.006));
 for(let channel=0;channel<channels;channel++){const target=buffer.getChannelData(channel);let at=0;for(const part of parts){const source=part.word.buffer.getChannelData(Math.min(channel,part.word.buffer.numberOfChannels-1));for(let n=0;n<part.length;n++){const gain=Math.min(1,n/fade,(part.length-1-n)/fade);target[at+n]=(source[part.start+n]||0)*Math.max(0,gain);}at+=part.length+gap;}}
 return {buffer,offset:0,duration:buffer.duration};
}
function recordedPhraseKeys(key,mode=state.speechMode){
 if(key.startsWith('phrase-')){
  const c=[...palette].sort((a,b)=>b.id.length-a.id.length).find(p=>key.endsWith('-'+p.id)),id=c?key.slice(7,-c.id.length-1):'';
  const parts=c&&sounds['color-'+c.id]&&sounds[id]?['color-'+c.id,id]:[];
  if(mode==='parts'&&parts.length)return parts;
  if(sounds[key])return [key];
  return parts;
 }
 return sounds[key]?[key]:[];
}
function stopSpeech(){
 const token=++speechToken;clearTimeout(speechFallbackTimer);speechFallbackTimer=0;window.speechSynthesis?.cancel();if(playing){playing.onended=null;playing.onerror=null;playing.pause();playing.currentTime=0;}for(const node of speechNodes)try{node.stop();}catch{}speechNodes=[];return token;
}
function setSpeechMode(mode){
 if(!['whole','parts'].includes(mode)||mode===state.speechMode)return false;
 stopSpeech();state.speechMode=mode;persist();renderTask();return true;
}
function playRecordedFallback(keys,token){
 const audio=playing=new Audio(),pause=state.speechMode==='parts'&&keys.length>1?450:0;let index=0;audio.preload='auto';
 const failed=()=>{if(token!==speechToken)return;clearTimeout(speechFallbackTimer);speechFallbackTimer=0;audio.onended=null;audio.onerror=null;audio.pause();toast('Не удалось воспроизвести звук. Нажми ещё раз.');};
 const next=()=>{if(token!==speechToken)return;if(index>=keys.length){audio.onended=null;audio.onerror=null;return;}audio.src=sounds[keys[index++]];audio.play().catch(failed);};
 audio.onended=()=>{if(token!==speechToken)return;if(index<keys.length&&pause)speechFallbackTimer=setTimeout(()=>{speechFallbackTimer=0;next();},pause);else next();};audio.onerror=failed;next();
}
async function play(key,text){
 const token=stopSpeech(),keys=recordedPhraseKeys(key);
 if(keys.length){try{const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)throw new Error('Audio unavailable');speechContext=speechContext||new AudioEngine();await speechContext.resume();const words=await Promise.all(keys.map(speechBuffer));if(token!==speechToken)return;const word=words.length===1?words[0]:joinSpeechBuffers(words),node=speechContext.createBufferSource();node.buffer=word.buffer;node.connect(speechContext.destination);node.onended=()=>{speechNodes=speechNodes.filter(value=>value!==node);};node.start(0,word.offset,word.duration);speechNodes.push(node);return;}catch{if(token!==speechToken)return;playRecordedFallback(keys,token);return;}}
 if(nativeVoice){const u=new SpeechSynthesisUtterance(text);u.lang='mn-MN';u.voice=nativeVoice;u.rate=.9;window.speechSynthesis.speak(u);}else toast('Для этой фразы озвучка пока недоступна.');
}
function targetText(task){return phrase(task.id,task.color);}
function prepareChoices(){
const task=current();if(!task){state.choices=[];return;}
if(['challenge','outfits'].includes(state.mode)&&!task.color){
const target=byId[task.id];const family=id=>['sneakers','running','sportshoes','canvas','slipons','watershoes'].includes(id)?'trainer':['boots','ankleboots','chelsea','winterboots','hiking'].includes(id)?'boot':['tallboots','rainboots','feltboots','ballet'].includes(id)?'tall':['flatshoes','mensflat','womensflat','loafers','moccasins','oxfords','derby'].includes(id)?'flat':['sandals','slides','flipflops','clogs','slippers'].includes(id)?'open':['pumps','stilettos','wedges','platforms'].includes(id)?'heel':id;
let pool=available(state.hero).filter(i=>task.id==='boots'?i.slot!=='shoes'||i.id==='boots':i.group===target.group&&(i.id===task.id||i.id!=='boots'&&family(i.id)!==family(task.id)));if(pool.length<6)pool=[...pool,...shuffle(available(state.hero).filter(i=>i.group!=='jewelry'&&!pool.some(p=>p.id===i.id))).slice(0,6-pool.length)];const peers=pool.filter(i=>i.id!==task.id&&i.slot!==target.slot);const others=peers.length>=5?peers:pool.filter(i=>i.id!==task.id); 
state.choices=shuffle([byId[task.id],...shuffle(others).slice(0,5)]).map((i,n)=>({id:i.id,color:null,key:i.id+'-'+n}));
}else{
const targetColor=colorById(task.color),candidates=shuffle(palette.filter(p=>p.id!==task.color&&colorDistance(p.color,targetColor.color)>=105));const colors=[];for(const c of candidates){if(colors.every(p=>colorDistance(p.color,c.color)>=95))colors.push(c);if(colors.length===2)break;}
const distractors=shuffle(available(state.hero).filter(i=>i.id!==task.id&&i.slot!==byId[task.id].slot&&(byId[task.id].group==='shoes'?i.group==='clothing':i.group===byId[task.id].group))).slice(0,3);
const options=[{id:task.id,color:task.color},...colors.map(c=>({id:task.id,color:c.id})),...distractors.map(i=>({id:i.id,color:palette[Math.floor(Math.random()*palette.length)].id}))];for(const c of shuffle(basePalette)){if(options.length>=6)break;if(!options.some(o=>o.id===task.id&&o.color===c.id))options.push({id:task.id,color:c.id});}state.choices=shuffle(options).map((v,n)=>({...v,key:v.id+'-'+v.color+'-'+n}));
}
}
function newRound(mode=state.mode,sceneId=state.scene){
if(mode==='outfits'){startOutfit(state.outfitId);return;}
state.mode=mode==='free'?'challenge':mode;state.scene=scenes.some(s=>s.id===sceneId)?sceneId:'walk';
const s=scenes.find(s=>s.id===state.scene);
state.queue=state.mode==='colors'?makeColorTasks():state.mode==='stories'?stories.map(story=>({id:story.item,color:story.color,size:story.size,story})):sceneWords(s).map(id=>({id,color:null}));
if(state.mode==='challenge'&&!s.words){const known=new Set(profile.known);state.queue=[...shuffle(state.queue.filter(t=>!known.has(t.id))),...shuffle(state.queue.filter(t=>known.has(t.id)))];}
Object.assign(state,{index:0,solved:[],independent:0,answered:false,complete:false,hint:false,errors:0,wrong:null,translation:false,searchingOwn:false,foundOwn:false,selected:null,category:'all',page:0,query:'',equipped:{},sizes:{}});
state.colors=Object.fromEntries(items.map(i=>[i.id,i.color]));prepareChoices();persist();render();
}
function switchMode(mode){if(mode===state.mode)return;if(mode==='free'){state.mode='free';state.category='all';state.collection='clothing';state.query='';state.page=0;state.translation=false;state.wrong=null;persist();render();}else newRound(mode,state.scene);}
function switchHero(hero){if(hero===state.hero)return;persist();state.hero=hero;
if(state.mode!=='free'){newRound(state.mode,state.scene);}else{const look=profile.looks[hero]||{};state.equipped=cleanOutfit(look.equipped,hero);state.colors=cleanColors(look.colors);state.sizes=cleanSizes(look.sizes);state.selected=null;state.category='all';state.query='';state.page=0;state.translation=false;persist();render();}
}
function equip(id,color,size='fit'){
const i=byId[id];if(['swimtrunks','swimshorts'].includes(id)){delete state.equipped.top;delete state.equipped.vest;delete state.equipped.outer;}if(i.slot==='full'){delete state.equipped.top;delete state.equipped.bottom;delete state.equipped.vest;}else if(['top','bottom'].includes(i.slot))delete state.equipped.full;
if(state.mode==='free'&&i.slot==='full')delete state.equipped.outer;
state.equipped[i.slot]=id;state.selected=id;state.sizes[id]=size;
if(color)state.colors[id]=colorById(color)?.color||color;
}
function isWornChoice(candidate){return state.equipped[byId[candidate.id]?.slot]===candidate.id&&(!candidate.color||(state.colors[candidate.id]||byId[candidate.id].color)===(colorById(candidate.color)?.color||candidate.color));}
function removeEquipped(id){
if((state.mode!=='free'&&(state.answered||state.complete))||!byId[id]||state.equipped[byId[id].slot]!==id)return false;
delete state.equipped[byId[id].slot];if(state.selected===id)state.selected=null;state.translation=false;persist();renderAvatar();renderTask();renderClothes();renderColors();return true;
}
function choose(key,clickDetail=0){
if(clickDetail>1)return;const restoreChoiceFocus=keyboardFocusWithin('clothesGrid');
const candidate=state.mode==='free'?(available(state.hero).some(i=>i.id===key)?{id:key,color:null}:null):state.choices.find(c=>c.key===key);if(!candidate)return;
if(isWornChoice(candidate)&&removeEquipped(candidate.id)){if(restoreChoiceFocus)focusChoice(key);return;}
if(state.mode==='free'){
equip(key,null);state.translation=false;persist();renderAvatar();renderTask();renderClothes();renderColors();sparkle();if(restoreChoiceFocus)focusChoice(key);return;
}
if(state.complete){toast('Раунд пройден. Можно повторить или открыть гардероб.');return;}if(state.answered){toast('Нажми «Дальше», чтобы продолжить.');return;}
const task=current();
const rightItem=candidate.id===task.id||(state.mode==='challenge'&&task.id==='boots'&&byId[candidate.id].slot==='shoes');
if(!rightItem||(task.color&&candidate.color!==task.color)){state.errors++;state.wrong=key;persist();updateCharacterLine();renderTask();renderClothes();if(restoreChoiceFocus)focusChoice(key);return;}
state.answered=true;state.wrong=null;if(task.own)state.foundOwn=true;state.solved.push(task.id);state.translation=false;
if((state.mode!=='stories'||task.own||task.size==='fit')&&!state.hint&&!state.errors){state.independent++;if(!profile.known.includes(task.id))profile.known.push(task.id);if(task.color&&!profile.colorKnown.includes(task.id+':'+task.color))profile.colorKnown.push(task.id+':'+task.color);}
if(task.story&&!profile.seenStories.includes(task.story.id))profile.seenStories.push(task.story.id);
equip(candidate.id,task.color,task.size||'fit');persist();renderAvatar();renderTask();renderClothes();sparkle();if(restoreChoiceFocus)($('nextButton')||$('findOwnButton'))?.focus({preventScroll:true});
}
function next(){if(!state.answered||state.complete||state.mode==='free'||(state.mode==='stories'&&!current().own&&current().story?.ownColor))return;const restoreTaskFocus=keyboardFocusWithin('taskCard');state.index++;Object.assign(state,{answered:false,hint:false,errors:0,wrong:null,translation:false,searchingOwn:false,foundOwn:false});if(state.index>=state.queue.length){state.complete=true;if(state.mode==='outfits'&&!profile.finishedOutfits.includes(state.hero+':'+state.outfitId))profile.finishedOutfits.push(state.hero+':'+state.outfitId);sparkle();}else prepareChoices();persist();render();if(restoreTaskFocus){if(state.complete)($('restartButton')||$('outfitAgainButton'))?.focus({preventScroll:true});else focusChoice();}}
function findOwnItem(){if(state.mode!=='stories'||!state.answered||!current()?.story?.ownColor)return;const restoreTaskFocus=keyboardFocusWithin('taskCard');state.searchingOwn=true;state.foundOwn=false;state.answered=false;state.hint=false;state.errors=0;state.wrong=null;state.translation=false;prepareChoices();persist();renderAvatar();renderTask();renderClothes();if(restoreTaskFocus)focusChoice();}
function render(){renderModes();renderScenes();renderAvatar();renderTask();renderCategories();renderClothes();renderColors();updateStatus();}
function renderModes(){
for(const [id,mode] of [['outfitMode','outfits'],['challengeMode','challenge'],['colorMode','colors'],['storiesMode','stories'],['freeMode','free']]){$(id).classList.toggle('active',state.mode===mode);$(id).setAttribute('aria-pressed',String(state.mode===mode));}
const copy=activityCopy[state.mode];$('activityTitle').textContent=copy[0];$('activityDescription').textContent=copy[1];$('activityDescription').hidden=state.mode==='free';if($('activityEyebrow'))$('activityEyebrow').hidden=state.mode==='free';$('activityPreview').innerHTML=activityArt(state.mode);
for(const [id,mode] of [['outfitIllustration','outfits'],['challengeIllustration','challenge'],['colorIllustration','colors'],['storiesIllustration','stories'],['freeIllustration','free']])$(id).innerHTML=activityArt(mode);
$('game').dataset.activity=state.mode;
$('sceneList').hidden=state.mode!=='colors';$('closetShell').hidden=state.mode==='outfits'&&(!state.outfitId||state.complete);$('catalogueTools').hidden=state.mode!=='free';$('categoryList').hidden=state.mode!=='free';$('clearLookButton').hidden=state.mode!=='free';
$('wardrobeTitle').textContent=state.mode==='free'?'Гардероб':state.mode==='outfits'?'Собери комплект':'Найди нужную вещь';
$('wardrobeSubtitle').textContent=state.mode==='free'?'Выбирай одежду и дополняй образ аксессуарами':state.mode==='challenge'?'Названия скрыты. Попробуй узнать вещь по рисунку':state.mode==='outfits'?'Найди вещь для текущего шага':'Обрати внимание и на название, и на цвет';
$('wardrobeTotal').hidden=true;$('wardrobeTotal').textContent='';
$('wardrobeNote').innerHTML='<span class="icon">'+icon('bulb')+'</span><span>'+(state.mode==='free'?'Нажми на вещь ещё раз, чтобы снять её.':state.mode==='stories'?'Примерь вещь и послушай историю о ней.':'Сначала попробуй сам. Перевод — в подсказке.')+'</span>';
$('clothesGrid').classList.toggle('challenge-grid',state.mode!=='free');
}
function renderScenes(){
 if(state.mode!=='colors'){$('sceneList').innerHTML='';return;}
 $('sceneList').innerHTML=[['basic','Основные цвета'],['light','Светлые оттенки'],['dark','Тёмные оттенки'],['all','Вся палитра']].map(([id,name])=>`<button class="scene-button ${state.colorGroup===id?'active':''}" data-color-group="${id}" aria-pressed="${state.colorGroup===id}"><span class="mode-color-dot"></span>${name}</button>`).join('');
}
let lastCharacterLine='',characterLineCount=0;
function updateCharacterLine(){
 const t=current(),key=[state.hero,state.mode,state.outfitId,state.scene,state.index,state.selected,state.answered,state.errors,state.complete,state.selected&&state.colors[state.selected]].join('|');if(key===lastCharacterLine)return;lastCharacterLine=key;
 let lines;
 if(state.mode==='stories'&&t?.own&&!state.answered)lines=[['Минийх мөн үү?','Это моё?'],['Хэнийх вэ?','Чьё это?']];
 else if(state.mode==='stories'&&state.answered&&!state.complete)lines=t.own||t.size==='fit'?[['Надад таарч байна!','Мне подходит по размеру!']]:t.size==='big'?[['Том байна!','Велико!']]:[['Жижиг байна!','Мало!']];
 else if(state.complete)lines=[['Бэлэн!','Готово!'],['За, явъя!','Ну что, пойдём!'],['Сайн байна!','Отлично!']];
 else if(state.errors&&!state.answered)lines=[['Дахиад үзье!','Попробуем ещё раз!'],['Аль нь вэ?','Которое из них?']];
 else if(state.answered||state.mode==='free'&&state.selected)lines=[['Надад таарч байна!','Мне подходит!'],['Гоё харагдаж байна!','Хорошо смотрится!'],['Ямар гоё өнгө вэ!','Какой красивый цвет!'],['Энэ минийх!','Это моё!']];
 else if(state.mode==='colors')lines=[['Ямар өнгөтэй вэ?','Какого цвета?'],['Аль нь вэ?','Которое из них?']];
 else if(state.mode==='outfits')lines=[['Өнөөдөр юу өмсөх вэ?','Что сегодня надеть?'],['Хувцсаа сонгоё!','Выберем одежду!'],['Аль нь дээр вэ?','Что лучше?']];
 else lines=[['Сайн уу!','Привет!'],['Сайн байна уу!','Здравствуйте!'],['Хувцсаа сонгоё!','Выберем одежду!']];
 const [mn,ru]=lines[characterLineCount++%lines.length];$('helloBubble').textContent=mn;$('helloBubble').title=ru;$('helloBubble').setAttribute('aria-label',mn+' — '+ru);
}
function renderAvatar(){
$('avatarMount').innerHTML=avatar(state.hero,state.equipped,state.colors,state.sizes);
updateCharacterLine();
$('roomLabel').textContent=state.hero==='nomin'?'НОМИН':'ТЭМҮҮЛЭН';
document.querySelectorAll('[data-hero]').forEach(b=>{const active=b.dataset.hero===state.hero;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
const worn=slots.map(s=>state.equipped[s]).filter(Boolean);
$('outfitChips').innerHTML=worn.length?worn.map(id=>state.mode==='free'||(!state.answered&&!state.complete)?`<button class="outfit-chip removable" data-remove="${id}" aria-label="Снять: ${esc(byId[id].mn)}" lang="mn">${byId[id].mn}</button>`:`<span class="outfit-chip" lang="mn">${byId[id].mn}</span>`).join(''):'';
$('outfitChips').hidden=!worn.length;
}
function activeOutfit(){return outfitData.scenarios.find(o=>o.id===state.outfitId);}
function outfitQueue(outfit,hero,variation,group=state.outfitPalette){
 const colors=colorGroupList(group),seed=[...outfit.id].reduce((n,c)=>n+c.charCodeAt(0),0);
 return outfit.looks[hero].map((id,n)=>({id,color:['pearls','beads'].includes(id)?null:colors[(seed+variation+n*7)%colors.length].id,size:'fit'}));
}
function outfitPaletteControl(){return `<label class="outfit-palette-label"><span><b lang="mn">Өнгө</b><small>Цвета в заданиях</small></span><select id="outfitPalette" aria-label="Палитра цветов в заданиях">${[['basic','Үндсэн · Основные'],['light','Цайвар · Светлые'],['dark','Бараан · Тёмные'],['all','Бүгд · Все оттенки']].map(([id,name])=>`<option value="${id}" ${state.outfitPalette===id?'selected':''}>${name}</option>`).join('')}</select></label>`;}
function startOutfit(id){
 const preferred=state.outfitGroup||({festival:'occasion',winter:'weather'}[state.scene])||state.scene;const candidates=outfitData.scenarios.filter(o=>o.group===preferred);const outfit=outfitData.scenarios.find(o=>o.id===id)||candidates.find(o=>!profile.finishedOutfits.includes(state.hero+':'+o.id))||candidates[0]||outfitData.scenarios[0];
 const attemptKey=state.hero+':'+outfit.id,variation=Math.max(0,Number(profile.outfitAttempts[attemptKey])||0);if(outfit)profile.outfitAttempts[attemptKey]=variation+1;
 Object.assign(state,{mode:'outfits',outfitId:outfit?.id||null,outfitGroup:outfit?.group||state.outfitGroup,queue:outfit?outfitQueue(outfit,state.hero,variation):[],index:0,solved:[],independent:0,answered:false,complete:false,hint:false,errors:0,wrong:null,translation:false,searchingOwn:false,foundOwn:false,selected:null,equipped:{},sizes:{},choices:[]});
 if(outfit)prepareChoices();persist();render();
}
function openOutfitPlaces(){
 openModal(modalHeader('Куда собираемся?')+'<p class="modal-subtitle">Выбери место — новая ситуация начнётся сразу.</p><div class="plans-grid">'+outfitData.groups.map(g=>`<button class="plan-option" data-outfit-group="${g.id}">${outfitData.illustration(g.id)}<span><b>${g.title}</b></span></button>`).join('')+'</div><details class="plan-settings"><summary>Өнгө / Цвета в заданиях</summary>'+outfitPaletteControl()+'</details>');
}
function chooseOutfitPlace(group){const list=outfitData.scenarios.filter(o=>o.group===group);const outfit=list.find(o=>!profile.finishedOutfits.includes(state.hero+':'+o.id))||list[(profile.outfitAttempts[state.hero+':'+list[0].id]||0)%list.length];state.outfitGroup=group;$('modal').close();startOutfit(outfit.id);}
function nextOutfit(){const list=outfitData.scenarios.filter(o=>o.group===state.outfitGroup);const n=list.findIndex(o=>o.id===state.outfitId);startOutfit(list[(n+1)%list.length].id);}
function outfitStageLabel(slot){return {top:'Выбери верх',bottom:'Найди нижнюю часть комплекта',full:'Выбери основу комплекта',outer:'Добавь верхний слой',shoes:'Найди обувь',socks:'Подбери носки',hat:'Выбери головной убор',gloves:'Не забудь перчатки',tie:'Добавь галстук',vest:'Добавь жилет',belt:'Найди ремень',bag:'Возьми сумку'}[slot]||'Дополни комплект';}
function renderOutfitTask(card){
 const outfit=activeOutfit();
 if(!outfit){startOutfit();return;}
 card.classList.add('outfit-task');const group=outfitData.groups.find(g=>g.id===outfit.group);
 card.innerHTML=`<div class="task-header"><span>${group.title}</span><button class="context-link" id="outfitMenuButton">Другие планы</button></div><div class="destination-banner compact" style="--place-color:${group.color}">${outfitData.illustration(group.id)}<div><h2>${outfit.title}</h2><p>${outfit.brief}</p></div></div>`;
 const finished=state.complete;const n=state.index+(state.answered?1:0);
 card.innerHTML+='<div class="outfit-steps" aria-label="Собранные вещи">'+state.queue.map((t,index)=>`<span class="outfit-step ${index<n||finished?'done':''} ${index===state.index?'current':''}" title="${index<n||finished?esc(byId[t.id].mn):'Вещь '+(index+1)}">${index<n||finished?art(t.id,state.colors[t.id]||byId[t.id].color,state.hero):'<i>'+String(index+1).padStart(2,'0')+'</i>'}</span>`).join('')+'</div>';
 if(finished){card.classList.add('success');card.innerHTML+=`<h3 class="outfit-ready">Образ собран</h3><div class="outfit-actions"><button class="secondary-button" id="outfitSaveButton">Сохранить образ</button><button class="secondary-button" id="outfitAgainButton">Этот образ в новых цветах</button><button class="primary-button" id="outfitNextScenario">Следующая ситуация</button></div>`;return;}
 const task=current(),text=targetText(task);card.innerHTML+=`<div class="task-label">Шаг ${state.index+1} из ${state.queue.length} · ${outfitStageLabel(byId[task.id].slot)}</div><div class="task-content"><div class="target-word ${text.mn.length>22?'long-word':''}"><span lang="mn">${text.mn}</span>${soundButton(task.color?'phrase-'+task.id+'-'+task.color:task.id,text.mn)}</div>${!state.answered?`<button class="hint-button" id="hintButton" ${state.hint?'disabled':''}>${state.hint?'Перевод открыт':'Подсказка'}</button>`:''}</div>`;
 if(state.answered)card.innerHTML+=`<div class="feedback"><span><strong>Подходит!</strong> ${esc(text.ru)}.</span><button class="next-button" id="nextButton">${state.index===state.queue.length-1?'Готово':'Следующая вещь'}</button></div>`;
 else card.innerHTML+=`<div class="task-translation">${state.hint?esc(text.ru):'Найди вещь именно этого цвета.'}</div>`+(state.errors?'<div class="feedback wrong">Проверь и название вещи, и цвет.</div>':'');
}
function chooseTopic(){openModal(modalHeader('Что повторим?')+'<div class="topic-grid">'+scenes.map(sc=>`<button class="topic-card" data-scene="${sc.id}"><span class="icon">${icon(sc.icon)}</span><b>${sc.title}</b></button>`).join('')+'</div>');}
function storyText(text,parts){
 const words=new Map(parts.map(([mn,ru])=>[mn.toLowerCase(),mn==='ахынх'?'старшего брата':ru]));
 const terms=[...words.keys()].sort((a,b)=>b.length-a.length).map(term=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
 const pattern=new RegExp('(^|[\\s.,!?])('+terms.join('|')+')(?=$|[\\s.,!?])','gi');
 return esc(text).replace(pattern,(_,lead,mn)=>`${lead}<span class="story-word" tabindex="0" aria-label="${esc(mn+' — '+words.get(mn.toLowerCase()))}">${mn}<span class="story-word-tip" role="tooltip" lang="ru">${esc(words.get(mn.toLowerCase()))}</span></span>`);
}
function renderTask(){
const card=$('taskCard');card.className='task-card';
if(state.mode==='outfits'){renderOutfitTask(card);return;}
if(state.mode==='free'){
card.classList.add('free-card');const i=byId[state.selected];const color=i?palette.find(p=>p.color===(state.colors[i.id]||i.color)):null;const text=i?phrase(i.id,color?.id):null;
card.innerHTML=(i?`<div class="task-content"><div><div class="task-label">Название и цвет</div><div class="target-word ${text.mn.length>22?'long-word':''}"><span lang="mn">${text.mn}</span>${soundButton(color?'phrase-'+i.id+'-'+color.id:i.id,text.mn)}</div></div><button class="hint-button free-translation-button" id="translationButton">${state.translation?'Скрыть перевод':'Показать перевод'}</button></div><div class="task-translation">${state.translation?esc(text.ru):'Нажми на динамик, чтобы послушать'}</div>`:'<div class="free-placeholder">Соберём новый образ?</div><div class="task-translation">Одежда, очки, украшения — выбирай, что нравится.</div>');return;
}
if(state.complete){card.classList.add('complete');const title=state.mode==='stories'?'Все сценки пройдены!':state.mode==='colors'?'Все цвета найдены!':'Тема пройдена!';card.innerHTML=`<div class="task-header"><span>САЙН БАЙНА!</span><span>${state.queue.length} / ${state.queue.length}</span></div><div class="complete-title">${title}</div><div class="feedback"><span>Наряд можно сохранить в альбом.</span><button class="next-button" id="restartButton">Ещё раз <span class="icon">${icon('reset')}</span></button></div>`;return;}
const task=current(),text=targetText(task),total=state.queue.length;
const names={walk:'Повседневная одежда',summer:'Летняя одежда',winter:'Тёплая одежда',office:'Деловая одежда',sport:'Спортивная одежда',home:'Домашняя одежда',festival:'Праздничная одежда',footwear:'Обувь',ornaments:'Украшения',clothes:'Вся одежда',all:'Все слова'};const name=state.mode==='colors'?'Вещь и её цвет':state.mode==='stories'?'Истории в примерочной':names[state.scene];
const completedQuestion=state.answered&&(state.mode!=='stories'||task.own||!task.story?.ownColor);
const dots=total<=8?'<span class="progress-dots" aria-hidden="true">'+state.queue.map((_,n)=>`<i class="${n<state.index||(n===state.index&&completedQuestion)?'done':n===state.index?'current':''}"></i>`).join('')+'</span>':'';
card.innerHTML=`<div class="task-header"><span class="lesson-context"><small>${state.mode==='challenge'?'Повторяем тему':'Наше занятие'}</small><b>${name}</b></span>${state.mode==='challenge'?'<button class="context-link" id="chooseTopicButton">Сменить тему</button>':dots}</div><div class="lesson-progress"><span>${state.mode==='stories'?'История':'Задание'} ${state.index+1} из ${total}</span><span>${state.index+(completedQuestion?1:0)} найдено</span><div class="lesson-progress-track" role="progressbar" aria-label="Прогресс занятия" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${state.index+(completedQuestion?1:0)}"><i style="width:${100*(state.index+(completedQuestion?1:0))/total}%"></i></div></div>`;
if(state.mode==='stories'&&task.own&&!state.answered){
 card.classList.add('story-card');
 card.innerHTML+=`<div class="task-label">${task.id==='gloves'?'Найди мои перчатки':'Найди мою обувь'}</div><div class="story-speech"><span class="story-mn" lang="mn">${esc(task.story.ownMn)}</span>${soundButton('story-own-'+task.story.id,task.story.ownMn)}</div><button class="hint-button own-hint" id="hintButton" ${state.hint?'disabled':''}>${state.hint?'Перевод открыт':'Подсказка'}</button>${state.hint?'<p class="story-ru">'+esc(task.story.ownRu)+'</p>':''}${state.errors?'<div class="feedback wrong">Это другая вещь. Прочитай описание моей вещи ещё раз.</div>':''}`;
 return;
}
if(state.mode==='stories'&&state.answered){
 card.classList.add('story-card','success');const s=task.story;
 const found=!!task.own,spoken=found?s.foundMn:s.mn;
 const translation=found?'Это мои '+(byId[task.id].shortRu||byId[task.id].ru)+'. Они мне по размеру.':s.ru;
 card.innerHTML+=`<div class="story-speech"><span class="story-mn" lang="mn">${storyText(spoken,s.parts)}</span>${soundButton(found?'story-found-'+s.id:'story-'+s.id,spoken)}</div><button class="story-translation-button" id="translationButton">${state.translation?'Скрыть перевод':'Показать перевод'}</button>${state.translation?'<p class="story-ru">'+esc(translation)+'</p>':''}<div class="story-actions">${s.ownColor&&!found?`<span class="translated-action"><button class="primary-button" id="findOwnButton" lang="mn" aria-describedby="findOwnTranslation">${task.id==='gloves'?'Миний бээлийг олоорой':'Миний гутлыг олоорой'}</button><span class="action-translation" id="findOwnTranslation" role="tooltip">${task.id==='gloves'?'Найти мои перчатки':'Найти мою обувь'}</span></span>`:`<span class="own-found">${found?'Своя вещь найдена!':''}</span><button class="next-button" id="nextButton">${state.index===total-1?'Готово':'Дальше'}<span class="icon">${icon('arrow')}</span></button>`}</div>`;
 return;
}
if(state.answered)card.classList.add('success');
card.innerHTML+=`<div class="task-content"><div><div class="task-label">${state.mode==='stories'?'Примерь вещь и узнай её историю':'Найди и надень'}</div><div class="target-word ${text.mn.length>22?'long-word':''}"><span lang="mn">${text.mn}</span>${soundButton(task.color?'phrase-'+task.id+'-'+task.color:task.id,text.mn)}</div></div>${!state.answered?`<button class="hint-button" id="hintButton" ${state.hint?'disabled':''}><span class="icon">${icon('bulb')}</span>${state.hint?'Открыто':'Подсказка'}</button>`:''}</div>${!state.answered?`<div class="task-translation">${state.hint?esc(text.ru):'&nbsp;'}</div>`:''}`;
if(state.answered)card.innerHTML+=`<div class="feedback"><span><strong>Верно!</strong> ${esc(text.ru)}.</span><button class="next-button" id="nextButton">${state.index===total-1?'Готово':'Дальше'}<span class="icon">${icon('arrow')}</span></button></div>`;
else if(state.errors)card.innerHTML+='<div class="feedback wrong">'+(state.mode==='challenge'?'Это другая вещь. Посмотри ещё раз.':'Посмотри ещё раз. Название и цвет должны совпасть.')+'</div>';
}
const normalized=v=>v.toLowerCase().replaceAll('ё','е').trim();
function catalogueFilter(i){
 if(i.group!==state.collection)return false;
 const cat=state.category;
 const category=cat==='all'||cat==='summer'&&i.tags.includes('summer')||cat==='underwear'&&(i.category==='underwear'||i.tags.includes('home'))||i.category===cat||cat==='flat'&&i.slot==='shoes'&&!['pumps','stilettos','wedges','platforms'].includes(i.id)||cat==='winter'&&i.tags.includes('winter')||cat==='sport'&&i.tags.includes('sport');
 const query=normalized(state.query);return category&&(!query||normalized(i.mn+' '+i.ru).includes(query));
}
function renderCategories(){
 $('collectionList').innerHTML=collections.map(([id,name])=>`<button class="collection-button ${state.collection===id?'active':''}" data-collection="${id}" aria-pressed="${state.collection===id}">${name}</button>`).join('');
 const cats=state.collection==='clothing'?categories:state.collection==='shoes'?[['all','Вся обувь'],['flat','Без каблука'],['summer','Летняя'],['winter','Зимняя'],['sport','Спортивная']]:[];
 $('categoryList').innerHTML=cats.map(([id,name])=>`<button class="category-button ${state.category===id?'active':''}" data-category="${id}" aria-pressed="${state.category===id}">${state.collection==='shoes'&&id!=='all'?'<span lang="mn">'+({flat:'Нам ултай',summer:'Зуны',winter:'Өвлийн',sport:'Спортын'}[id])+'</span><small>'+name+'</small>':state.hero==='temuulen'&&id==='bottoms'?'Брюки и шорты':state.hero==='temuulen'&&id==='full'?'Костюмы и дээл':name}</button>`).join('');
 $('wardrobeSearch').value=state.query;
}
function renderClothes(){
const free=state.mode==='free',worn=Object.values(state.equipped);let options=[];
if(free){const filtered=available(state.hero).filter(catalogueFilter).sort((a,b)=>state.category==='summer'?(b.category==='summer')-(a.category==='summer'):0);$('catalogueResult').hidden=true;$('catalogueResult').textContent='';const pages=Math.max(1,Math.ceil(filtered.length/12));state.page=Math.min(state.page,pages-1);options=filtered.slice(state.page*12,state.page*12+12).map(i=>({id:i.id,key:i.id,color:null}));$('wardrobePager').hidden=pages<=1;$('wardrobePager').innerHTML=pages>1?`<button class="pager-button" id="previousPage" ${state.page===0?'disabled':''}>Назад</button><button class="pager-button" id="nextPage" ${state.page===pages-1?'disabled':''}>Ещё вещи</button>`:'';}
else{options=state.choices;$('wardrobePager').hidden=true;}
$('clothesGrid').innerHTML=(free&&!options.length?'<p class="catalogue-empty">Ничего не найдено. Попробуй другое название или раздел.</p>':'')+options.map((o,n)=>{const i=byId[o.id],c=o.color?colorById(o.color).color:state.colors[i.id]||i.color;const selected=isWornChoice(o);const reveal=free||(state.answered&&(current()?.id===o.id||(state.mode==='challenge'&&current()?.id==='boots'&&i.slot==='shoes'))&&(!current().color||current().color===o.color));const label=phrase(i.id,o.color);return `<button style="--item-tint:${c}22" class="clothes-card ${selected?'selected':''} ${state.wrong===o.key?'wrong-pick':''}" data-item="${o.key}" draggable="true" aria-label="${reveal?esc(label.mn):'Вариант '+(n+1)}" aria-pressed="${selected}">${selected?'<span class="card-status" aria-hidden="true">✓</span>':''}<span class="clothes-picture">${art(i.id,c,state.hero)}</span><span class="clothes-card-footer"><span class="clothes-name ${reveal?'':'hidden-label'}" ${reveal?'lang="mn"':''}>${reveal?i.mn:'Примерить'}</span>${free?'':`<span class="item-color-dot" style="background:${c}" aria-hidden="true"></span>`}</span></button>`;}).join('');
}
function renderColors(){const show=state.mode==='free'&&byId[state.selected]&&Object.values(state.equipped).includes(state.selected);$('colorPanel').hidden=!show;if(!show){$('colorPanel').innerHTML='';return;}
const chosen=state.colors[state.selected]||byId[state.selected].color;const selectedColor=palette.find(p=>p.color===chosen);
$('colorPanel').innerHTML='<div class="color-panel-head"><span class="color-panel-label">Цвет вещи / <span lang="mn">Хувцасны өнгө</span>'+(selectedColor?' · <b lang="mn">'+selectedColor.mn+'</b>':'')+'</span><button class="all-colors-button" id="allColorsButton"><span lang="mn">Бүх өнгө</span><small>Все оттенки</small></button></div><div class="color-swatches" role="group" aria-label="Цвет одежды">'+basePalette.map(p=>`<button class="swatch ${chosen===p.color?'active':''}" data-color="${p.id}" style="--swatch:${p.color}" title="${p.name} · ${p.mn}" aria-label="${p.name}: ${p.mn}" aria-pressed="${chosen===p.color}"><span></span></button>`).join('')+'</div>';}
function openModal(html){$('modalContent').innerHTML=html;if(!$('modal').open)$('modal').showModal();}
function modalHeader(title){return `<div class="modal-header"><h2>${title}</h2><button class="small-icon" data-close-modal aria-label="Закрыть"><span class="icon">${icon('close')}</span></button></div>`;}
let dictionaryGroup='words',dictionaryQuery='';
function dictionary(){dictionaryQuery='';openModal(modalHeader('Твой словарь')+`<div class="dictionary-tabs"><button class="active" data-dictionary-tab="words">Одежда</button><button data-dictionary-tab="shoes">Обувь</button><button data-dictionary-tab="jewelry">Украшения</button><button data-dictionary-tab="accessories">Аксессуары</button><button data-dictionary-tab="colors">Цвета</button><button data-dictionary-tab="phrases">Размер и семья</button></div><div id="dictionaryBody"></div>`);renderDictionary('words');}
function renderDictionary(tab){dictionaryGroup=tab;document.querySelectorAll('[data-dictionary-tab]').forEach(b=>b.classList.toggle('active',b.dataset.dictionaryTab===tab));
 if(['words','shoes','jewelry','accessories'].includes(tab)){
  $('dictionaryBody').innerHTML='<label class="catalogue-search"><span>Поиск в словаре</span><input id="dictionarySearch" type="search" placeholder="По-русски или по-монгольски" autocomplete="off" value="'+esc(dictionaryQuery)+'"></label><p class="modal-subtitle">Показаны вещи для выбранного персонажа. Нажимай на динамик и повторяй.</p><div class="dictionary-list" id="dictionaryRows"></div>';renderDictionaryRows();
 }else if(tab==='colors')renderDictionaryColors('basic');
 else $('dictionaryBody').innerHTML='<div class="phrase-dictionary">'+stories.map(s=>`<article><div class="story-speech"><b lang="mn">${s.mn}</b>${soundButton('story-'+s.id,s.mn)}</div><p>${esc(s.ru)}</p></article>`).join('')+'</div><div class="dictionary-notes"><p><b>Ах</b> — старший брат, <b>эгч</b> — старшая сестра. <b>Дүү</b> — младший брат или младшая сестра; можно уточнить: <b>эрэгтэй дүү</b> / <b>эмэгтэй дүү</b>.</p></div>';
}
function renderDictionaryRows(){const group=dictionaryGroup==='words'?'clothing':dictionaryGroup,q=normalized(dictionaryQuery);const list=available(state.hero).filter(i=>i.group===group&&(!q||normalized(i.mn+' '+i.ru).includes(q)));
 $('dictionaryRows').innerHTML=list.length?list.map(i=>`<div class="dictionary-row">${art(i.id,i.color,state.hero)}<div><div class="dictionary-word" lang="mn">${i.mn}</div><div class="dictionary-translation">${esc(i.ru)}</div></div>${soundButton(i.id,i.mn)}</div>`).join(''):'<p class="catalogue-empty">Ничего не найдено.</p>';
}
function sources(){return '';}
function colorGroupList(group){return group==='basic'?basePalette:group==='all'?palette:palette.filter(p=>p.group===group);}
function makeColorTasks(){
 const list=colorGroupList(state.colorGroup),seen=new Set(profile.colorKnown),clothes=shuffle(available(state.hero).filter(i=>i.group==='clothing'||i.group==='shoes'));
 const used=new Set();return shuffle(list).map(c=>{const fresh=clothes.filter(i=>!seen.has(i.id+':'+c.id)&&!used.has(i.id));const pool=fresh.length?fresh:clothes.filter(i=>!seen.has(i.id+':'+c.id));const i=(pool.length?pool:clothes)[0];used.add(i.id);return {id:i.id,color:c.id};});
}
function applyColor(id){if(state.mode!=='free'||!state.selected||!colorById(id))return;state.colors[state.selected]=colorById(id).color;persist();renderAvatar();renderTask();renderClothes();renderColors();}
function paletteFilters(group,attr){return '<div class="palette-filters" role="group" aria-label="Группа цветов">'+[['basic','Үндсэн','Основные'],['light','Цайвар','Светлые'],['dark','Бараан','Тёмные'],['all','Бүгд','Все']].map(([id,name,ru])=>`<button class="${group===id?'active':''}" ${attr}="${id}" aria-pressed="${group===id}"><span lang="mn">${name}</span><small>${ru}</small></button>`).join('')+'</div>';}
function openPalette(group='all'){
 const selected=byId[state.selected];if(!selected)return;
 openModal(modalHeader('Өнгө / Цвета')+`<p class="modal-subtitle">Өнгө сонгох / Выбор цвета: <b lang="mn">${selected.mn}</b>. Цайвар — светлый, бараан — тёмный, маш — очень.</p><div id="paletteBody"></div>`);
 renderPaletteGrid(group);
}
function renderPaletteGrid(group){
 const selected=state.colors[state.selected]||byId[state.selected].color;
 $('paletteBody').innerHTML=paletteFilters(group,'data-palette-filter')+'<div class="palette-grid">'+colorGroupList(group).map(p=>`<button class="palette-tile ${selected===p.color?'active':''}" data-palette-color="${p.id}" aria-label="${p.name}: ${p.mn}" aria-pressed="${selected===p.color}"><span class="palette-sample" style="background:${p.color}"></span><b lang="mn">${p.mn}</b><small>${p.name.toLowerCase()}</small></button>`).join('')+'</div>';
}
function renderDictionaryColors(group='basic'){
 $('dictionaryBody').innerHTML='<p class="modal-subtitle">Цвета и их светлые и тёмные оттенки. Цайвар — светлый, бараан — тёмный, маш — очень. Цвет ставится перед названием вещи и не меняется по роду.</p>'+paletteFilters(group,'data-dictionary-color-group')+'<div class="color-dictionary">'+colorGroupList(group).map(p=>`<div class="color-dictionary-row"><span style="background:${p.color}"></span><div><b lang="mn">${p.mn}</b><small>${p.name.toLowerCase()}</small></div>${soundButton('color-'+p.id,p.mn)}</div>`).join('')+'</div><div class="dictionary-notes"><p><span lang="mn">цайвар ягаан бээлий</span> — светло-розовые перчатки. <span lang="mn">бараан хөх цамц</span> — тёмно-синяя рубашка.</p>'+sources()+'</div>';
}
function saveDialog(){if(!Object.keys(state.equipped).length){toast('Сначала надень хотя бы одну вещь.');return;}if(profile.album.length>=12){toast('В альбоме нет места. Удали один из сохранённых образов.');album();return;}openModal(modalHeader('Сохраним этот образ?')+`<div class="save-preview">${avatar(state.hero,state.equipped,state.colors,state.sizes)}</div><form id="saveLookForm"><label class="input-label" for="lookName">Название образа</label><input class="look-input" id="lookName" maxlength="45" required value="Мой образ"><div class="dialog-actions"><button class="secondary-button" type="button" data-close-modal>Отмена</button><button class="primary-button" type="submit">Сохранить в альбом</button></div></form>`);$('lookName').focus();$('lookName').select();}
function saveLook(name){if(profile.album.length>=12)return;profile.album.unshift({id:'look-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name:name.trim().slice(0,45)||'Мой образ',date:Date.now(),hero:state.hero,equipped:{...state.equipped},colors:{...state.colors},sizes:{...state.sizes}});persist();$('modal').close();toast(storageAvailable?'Образ сохранён в альбоме.':'Образ добавлен на время игры; постоянное сохранение недоступно.');}
function album(){const cards=profile.album.length?'<div class="album-grid">'+profile.album.map(o=>`<article class="album-card"><div class="album-image">${avatar(o.hero,o.equipped,o.colors,o.sizes)}</div><div class="album-card-name">${esc(o.name)}</div><div class="album-card-date">${new Date(o.date).toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}</div><div class="album-card-actions"><button data-load-look="${esc(o.id)}">Примерить</button><button class="delete-look" data-delete-look="${esc(o.id)}" aria-label="Удалить образ ${esc(o.name)}"><span class="icon">${icon('trash')}</span></button></div></article>`).join('')+'</div>':'<div class="empty-state"><span class="icon">'+icon('hanger')+'</span>Здесь будут твои любимые наряды.<br>Одень персонажа и нажми «Сохранить образ».</div>';openModal(modalHeader('Мои образы')+'<p class="modal-subtitle">Примеряй сохранённые образы и повторяй слова.</p>'+cards);}
function help(){openModal(modalHeader('Как играть')+'<ol class="help-list"><li><b>Образы.</b> Открой выбор режима игры и выбери сбор образа — задание начнётся сразу. Собирай комплект по шагам, учитывая вещь и цвет. В «Других планах» можно выбрать другую ситуацию. Каждый повтор даёт новые цвета.</li><li><b>Одежда.</b> Найди вещь по монгольскому слову. Названия под рисунками скрыты.</li><li><b>Цвета.</b> Выбери вещь нужного цвета. Например: ягаан бээлий — розовые перчатки.</li><li><b>Сценки.</b> Примерь вещь, послушай реплику о размере и семье. Если вещь мала или велика, прочитай описание своей вещи и найди её в шкафу.</li><li><b>Гардероб.</b> Собирай образы, надевай очки и украшения, меняй цвета и сохраняй наряды.</li></ol><p class="modal-subtitle">Нажимай на динамик, чтобы слушать слова. Прогресс и альбом сохраняются в этом браузере. Для клавиатуры: Tab, Enter и стрелки внутри шкафа.</p><div class="dialog-actions"><button class="primary-button" data-close-modal>Давай играть</button></div>');}
for(const [id,mode] of [['outfitMode','outfits'],['challengeMode','challenge'],['colorMode','colors'],['storiesMode','stories'],['freeMode','free']])$(id).addEventListener('click',()=>{$('activityMenu').open=false;switchMode(mode);});
$('sceneList').addEventListener('click',e=>{const colorGroup=e.target.closest('[data-color-group]');if(colorGroup){state.colorGroup=colorGroup.dataset.colorGroup;newRound('colors',state.scene);return;}const b=e.target.closest('[data-scene]');if(b&&(b.dataset.scene!==state.scene||state.complete))newRound('challenge',b.dataset.scene);});
document.querySelectorAll('[data-hero]').forEach(b=>b.addEventListener('click',()=>switchHero(b.dataset.hero)));
document.addEventListener('huvtsas:start',event=>{const hero=event.detail?.hero;if(['nomin','temuulen'].includes(hero))switchHero(hero);});
$('clothesGrid').addEventListener('click',e=>{const b=e.target.closest('[data-item]');if(b)choose(b.dataset.item,e.detail);});
$('clothesGrid').addEventListener('dragstart',e=>{const b=e.target.closest('[data-item]');if(b)e.dataTransfer.setData('text/plain',b.dataset.item);});
$('characterStage').addEventListener('dragover',e=>e.preventDefault());$('characterStage').addEventListener('drop',e=>{e.preventDefault();choose(e.dataTransfer.getData('text/plain'));});
$('clothesGrid').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(e.key))return;const all=[...$('clothesGrid').querySelectorAll('[data-item]')],n=all.indexOf(document.activeElement);if(n<0)return;e.preventDefault();const cols=getComputedStyle($('clothesGrid')).gridTemplateColumns.split(' ').length;const step={ArrowLeft:-1,ArrowRight:1,ArrowUp:-cols,ArrowDown:cols}[e.key];all[Math.max(0,Math.min(all.length-1,n+step))].focus();});
$('collectionList').addEventListener('click',e=>{const b=e.target.closest('[data-collection]');if(b){state.collection=b.dataset.collection;state.category='all';state.page=0;state.query='';renderCategories();renderClothes();}});
$('wardrobeSearch').addEventListener('input',()=>{state.query=$('wardrobeSearch').value;state.page=0;renderClothes();});
$('modal').addEventListener('input',e=>{if(e.target.id==='dictionarySearch'){dictionaryQuery=e.target.value;renderDictionaryRows();}});
$('categoryList').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){state.category=b.dataset.category;state.page=0;renderCategories();renderClothes();}});
$('wardrobePager').addEventListener('click',e=>{if(e.target.closest('#nextPage'))state.page++;else if(e.target.closest('#previousPage'))state.page--;else return;renderClothes();});
$('colorPanel').addEventListener('click',e=>{if(e.target.closest('#allColorsButton')){openPalette();return;}const b=e.target.closest('[data-color]');if(b)applyColor(b.dataset.color);});
$('outfitChips').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(b)removeEquipped(b.dataset.remove);});
$('taskCard').addEventListener('change',e=>{if(e.target.id==='outfitPalette'){state.outfitPalette=e.target.value;persist();renderTask();}});
$('taskCard').addEventListener('click',e=>{const place=e.target.closest('[data-outfit-group]');if(place){chooseOutfitPlace(place.dataset.outfitGroup);return;}const outfit=e.target.closest('[data-outfit-id]');if(outfit){startOutfit(outfit.dataset.outfitId);return;}if(e.target.closest('#outfitPlacesButton')){openOutfitPlaces();return;}if(e.target.closest('#outfitMenuButton')){openOutfitPlaces(state.outfitGroup);return;}if(e.target.closest('#outfitAgainButton')){startOutfit(state.outfitId);return;}if(e.target.closest('#outfitNextScenario')){nextOutfit();return;}if(e.target.closest('#outfitSaveButton')){saveDialog();return;}if(e.target.closest('#chooseTopicButton')){chooseTopic();return;}if(e.target.closest('#hintButton')){state.hint=true;persist();renderTask();}else if(e.target.closest('#nextButton'))next();else if(e.target.closest('#restartButton'))newRound(state.mode,state.scene);else if(e.target.closest('#translationButton')){state.translation=!state.translation;renderTask();}else if(e.target.closest('#findOwnButton'))findOwnItem();});
document.addEventListener('click',e=>{const mode=e.target.closest('[data-speech-mode]');if(mode){const focus=document.activeElement===mode;setSpeechMode(mode.dataset.speechMode);if(focus)document.querySelector('[data-speech-mode="'+mode.dataset.speechMode+'"]')?.focus({preventScroll:true});return;}const b=e.target.closest('[data-sound]');if(b)play(b.dataset.sound,b.dataset.spoken);});
$('clearLookButton').addEventListener('click',()=>{if(state.mode==='free'){state.equipped={};state.sizes={};state.selected=null;persist();render();}});
$('saveLookButton').addEventListener('click',saveDialog);$('albumButton').addEventListener('click',album);$('dictionaryButton').addEventListener('click',dictionary);$('helpButton').addEventListener('click',help);
$('modal').addEventListener('change',e=>{if(e.target.id==='outfitPalette'){state.outfitPalette=e.target.value;persist();}});
$('modal').addEventListener('click',e=>{const place=e.target.closest('[data-outfit-group]');if(place){chooseOutfitPlace(place.dataset.outfitGroup);return;}const topic=e.target.closest('[data-scene]');if(topic){newRound('challenge',topic.dataset.scene);$('modal').close();return;}
if(e.target.closest('[data-close-modal]'))$('modal').close();
const paletteFilter=e.target.closest('[data-palette-filter]');if(paletteFilter)renderPaletteGrid(paletteFilter.dataset.paletteFilter);const paletteColor=e.target.closest('[data-palette-color]');if(paletteColor){applyColor(paletteColor.dataset.paletteColor);$('modal').close();}const dictionaryColor=e.target.closest('[data-dictionary-color-group]');if(dictionaryColor)renderDictionaryColors(dictionaryColor.dataset.dictionaryColorGroup);
const dict=e.target.closest('[data-dictionary-tab]');if(dict)renderDictionary(dict.dataset.dictionaryTab);
const load=e.target.closest('[data-load-look]');if(load){const o=profile.album.find(o=>o.id===load.dataset.loadLook);if(o){persist();Object.assign(state,{hero:o.hero,equipped:{...o.equipped},colors:{...o.colors},sizes:{...o.sizes},mode:'free',selected:null,collection:'clothing',query:'',category:'all',page:0,translation:false});persist();$('modal').close();render();sparkle();}}
const remove=e.target.closest('[data-delete-look]');if(remove){profile.album=profile.album.filter(o=>o.id!==remove.dataset.deleteLook);persist();album();}
if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('modal').close();}
});
$('modal').addEventListener('submit',e=>{if(e.target.id==='saveLookForm'){e.preventDefault();saveLook($('lookName').value);}});
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
function restoreRound(){
 const saved=profile.session;if(!saved||saved.hero!==state.hero||saved.mode!==state.mode||saved.scene!==state.scene||!Array.isArray(saved.queue)||saved.queue.length>300)return false;
 const list=available(state.hero),allowed=new Set(list.map(i=>i.id));
 const queue=saved.queue.map(t=>{if(!t||!allowed.has(t.id)||(t.color&&!colorById(t.color)))return null;const story=t.storyId?stories.find(st=>st.id===t.storyId):null;if(state.mode==='stories'&&!story)return null;return {id:t.id,color:t.color||null,size:['big','small','fit'].includes(t.size)?t.size:'fit',...(story?{story}: {})};});
 if(queue.some(t=>!t)||!queue.length||!Number.isInteger(saved.index)||saved.index<0||saved.index>queue.length)return false;
 Object.assign(state,{queue,index:saved.index,solved:Array.isArray(saved.solved)?saved.solved.filter(id=>allowed.has(id)):[],independent:Math.max(0,Math.min(queue.length,Number(saved.independent)||0)),errors:Math.max(0,Number(saved.errors)||0),answered:!!saved.answered,complete:!!saved.complete||saved.index===queue.length,hint:!!saved.hint,searchingOwn:!!saved.searchingOwn,foundOwn:!!saved.foundOwn});
 if(!state.complete)prepareChoices();render();return true;
}
if(state.mode==='free')render();else if(!restoreRound())newRound(state.mode,state.scene);
window.HUVTSAS_BOOT?.ready({hero:state.hero});
})();
