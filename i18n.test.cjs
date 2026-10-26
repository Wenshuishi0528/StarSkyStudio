const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/i18n.js','utf8'),html=fs.readFileSync(__dirname+'/index.html','utf8');
const storage=new Map([['starsky.language.v1','ru']]);
function makeEnvironment(){
 const staticNode={nodeValue:' 观察方式 ',isConnected:true,parentElement:{closest:()=>null}};
 const attrs={},nodes=Object.fromEntries(['languageZh','languageEn','languageRu','appVersion'].map(id=>[id,{setAttribute(k,v){this[k]=v;}}]));
 const select={isConnected:true,getAttribute:k=>k==='aria-label'?'界面语言':null,setAttribute:(k,v)=>{attrs[k]=v;}};
 const document={body:{},documentElement:{},title:'',createTreeWalker(){let used=false;return {nextNode(){if(used)return false;used=true;this.currentNode=staticNode;return true;}};},querySelectorAll:()=>[select],getElementById:id=>nodes[id]};
 const window={document,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}};
 const sandbox={window};vm.runInNewContext(source,sandbox);return {I:window.StarSkyI18n,document,staticNode,nodes,attrs};
}
const {I,document,staticNode,nodes,attrs}=makeEnvironment();I.init();
assert.equal(I.language,'ru');assert.equal(document.documentElement.lang,'ru');assert.equal(staticNode.nodeValue,' Наблюдение ');assert.equal(nodes.appVersion.textContent,'v0.4.0');assert.equal(attrs['aria-label'],'Язык интерфейса');
let changes=0;const off=I.onChange(()=>changes++);nodes.languageEn.onclick();assert.equal(changes,1);assert.equal(staticNode.nodeValue,' Observation ');assert.equal(nodes.languageEn['aria-pressed'],'true');assert.equal(storage.get('starsky.language.v1'),'en');
assert.equal(I.t('已保存：{name}',{name:'test.mp4'}),'Saved: test.mp4');
I.setLanguage('invalid');assert.equal(I.language,'en');I.setLanguage('en');assert.equal(changes,1);off();I.setLanguage('zh');assert.equal(changes,1);assert.equal(staticNode.nodeValue,' 观察方式 ');assert.equal(document.documentElement.lang,'zh-CN');
I.setLanguage('ru');assert.equal(I.t('编码失败：本机未找到FFmpeg'),'Ошибка кодирования: FFmpeg не найден на этом компьютере');
for(const [key,pair] of Object.entries(I.messages)){
 assert.equal(pair.length,2,key);const expected=[...key.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
 for(const translation of pair)assert.deepEqual([...translation.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort(),expected,key);
}
const staticTexts=[...html.matchAll(/>([^<>]*[\u4e00-\u9fff][^<>]*)</g)].map(m=>m[1].trim());
for(const text of staticTexts)if(text!=='中文')assert.ok(I.messages[text],`Missing static translation: ${text}`);
for(const [,attr,text]of html.matchAll(/(aria-label|title)="([^"]*[\u4e00-\u9fff][^"]*)"/g))assert.ok(I.messages[text],`Missing ${attr}: ${text}`);
console.log('PASS: stored language, static text and attributes, language buttons, interpolation, listener removal, Chinese restoration and translation coverage.');

I.setLanguage('en');assert.equal(I.t('镜头焦段'),'Lens focal length');
I.setLanguage('ru');assert.equal(I.t('自定义焦距（mm）'),'Своё фокусное расстояние (мм)');
console.log('PASS: focal-length control labels translate to English and Russian.');

I.setLanguage("en");assert.equal(I.t("下载 MP4 视频"),"Download MP4 video");
I.setLanguage("ru");assert.equal(I.t("本机版 · 使用本地编码服务。"),"Локальная версия · Используется локальная служба кодирования.");
console.log("PASS: browser/local export messages translate to English and Russian.");
