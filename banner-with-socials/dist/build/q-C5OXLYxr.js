import{l as y,y as x,D as E,_ as b}from"./q-A292Ce-a.js";import{_hW as C}from"./q-A292Ce-a.js";import{G as T,H as _,I as j}from"./q-Ckxo4o86.js";const A=async function(...s){const[d,p,i,h,a]=y(),n=s.length>0&&s[0]instanceof AbortSignal?s.shift():void 0;{const r=x(),w=s.map(t=>t instanceof SubmitEvent&&t.target instanceof HTMLFormElement?new FormData(t.target):t instanceof Event||t instanceof Node?null:t),c=a.getHash();let l="";const f={...d,method:i,headers:{...p,"Content-Type":"application/qwik-json","X-QRL":c},signal:n},m=await E([a,...w]);i==="GET"?l+=`&${j}=${encodeURIComponent(m)}`:f.body=m;const e=await fetch(`${h}?${T}=${c}${l}`,f),o=e.headers.get("Content-Type");if(e.ok&&o==="text/qwik-json-stream"&&e.body)return async function*(){try{for await(const t of _(e.body,r??document.documentElement,n))yield t}finally{n!=null&&n.aborted||await e.body.cancel()}}();if(o==="application/qwik-json"){const t=await e.text(),u=await b(t,r??document.documentElement);if(e.status===500)throw u;return u}else if(o==="application/json"){const t=await e.json();if(e.status===500)throw t;return t}else if(o==="text/plain"||o==="text/html"){const t=await e.text();if(e.status===500)throw t;return t}}};export{C as _hW,A as s_WfTOxT4IrdA};
