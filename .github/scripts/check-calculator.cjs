const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const listeners = {};
const events = [];
const classes = new Set();
const values = {before:'15',after:'5',review:'3',count:'20',setup:'1',hourly:'2000',monthly:'3000'};
const result = {innerHTML:'',textContent:'',classList:{toggle:(key,on)=>on?classes.add(key):classes.delete(key),remove:key=>classes.delete(key)}};
const form = {valid:true,checkValidity(){return this.valid;},addEventListener(name,callback){listeners[name]=callback;}};
const context = {
  document:{querySelectorAll:()=>[],getElementById:id=>id==='savings-form'?form:id==='savings-result'?result:null},
  window:{gtag:(...args)=>events.push(args),setTimeout:callback=>callback()},
  FormData:class{constructor(){return Object.entries(values);}},
  Intl,Number,Object,navigator:{clipboard:{writeText:async()=>{}}},
};
vm.runInNewContext(fs.readFileSync('practical-guide.js','utf8'),context);
assert.ok(result.innerHTML.includes('2.3時間'));
assert.ok(result.innerHTML.includes('1.3時間'));
assert.ok(result.innerHTML.includes('1,667円'));
assert.ok(result.innerHTML.includes('-333円'));
assert.equal(events.length,0,'Initial rendering is not a user calculation');
listeners.submit({preventDefault(){}});
assert.equal(events[0][1],'savings_calculate');
assert.deepEqual(Object.keys(events[0][2]),['tool_id'],'Do not transmit input values');
values.after='20';listeners.input();
assert.ok(classes.has('is-negative'));
assert.ok(result.innerHTML.includes('従来より時間が増えます'));
values.before='0';values.after='0';values.review='0';values.count='0';values.setup='0';values.monthly='0';listeners.input();
assert.ok(result.innerHTML.includes('0時間'));
assert.ok(result.innerHTML.includes('件数が0'));
form.valid=false;listeners.input();
assert.ok(result.textContent.includes('0以上'));
assert.equal(events.length,1,'Editing inputs must not generate analytics events');
console.log('Calculator baseline, negative, zero, invalid values and analytics privacy verified.');
