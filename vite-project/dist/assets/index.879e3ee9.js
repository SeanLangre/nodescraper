const l=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}};l();const s=document.createElement("template");s.innerHTML=`
  <style>
    main {
      height:20px;        
      width:100%;
      font-family: 'Roboto', sans-serif;
      background-color: #36393f;
      margin: 0px;
    }

    p{
      font-size: 60px;
    }
  </style>

  <main>
    <div>
      component: asdasdasdasd
    </div>

    <p id=welcomeMessage> </p>

  </main>
`;customElements.define("main-template-scraper",class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}).appendChild(s.content.cloneNode(!0)),this.welcomeMessage=this.shadowRoot.querySelector("#welcomeMessage"),this.welcomeMessage.textContent="ASIUFBGASUIBFASBHUIO"}test(){console.log("asiugfakjsbfkjabsdgkjasdbg")}});document.querySelector("#app").innerHTML=`
<h1>Hello Vite!</h1>
<a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;document.querySelector("#scraper");
