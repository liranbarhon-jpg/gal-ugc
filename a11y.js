/* Accessibility menu, built in (no outside service). Adds the floating button and its panel to the page.
   Settings: text size, high contrast, highlight links, stop animations, readable font. Saved in this browser. */
(function(){
  var KEY="gal-a11y",STEPS=[1,1.15,1.3,1.5],TOGGLES=[
    ["contrast","ניגודיות גבוהה"],["links","הדגשת קישורים"],["still","עצירת אנימציות"],["font","גופן קריא"]];
  var root=document.documentElement,s={fs:0};
  try{s=JSON.parse(localStorage.getItem(KEY))||s}catch(e){}

  function apply(){
    root.style.setProperty("--a11y-fs",STEPS[s.fs||0]);
    TOGGLES.forEach(function(t){root.classList.toggle("a11y-"+t[0],!!s[t[0]])});
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
  apply();

  var ICON='<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><circle cx="12" cy="4" r="2"/><path d="M19 9.5c0 .6-.4 1-1 1.1l-4 .5v3.2l2.3 5.3a1 1 0 1 1-1.8.8L12.3 15h-.6l-2.2 5.4a1 1 0 1 1-1.8-.8l2.3-5.3v-3.2l-4-.5a1 1 0 0 1 .2-2l3.9.5h3.8l3.9-.5c.6-.1 1.2.4 1.2 1z"/></svg>';

  function build(){
    var btn=document.createElement("button");
    btn.type="button";btn.className="a11y";btn.innerHTML=ICON;
    btn.setAttribute("aria-label","תפריט נגישות");btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-controls","a11y-panel");

    var p=document.createElement("div");
    p.id="a11y-panel";p.className="a11y-panel";p.hidden=true;
    p.setAttribute("role","dialog");p.setAttribute("aria-label","תפריט נגישות");
    p.innerHTML='<h2>תפריט נגישות<button type="button" class="x" aria-label="סגירת התפריט">×</button></h2>'
      +'<div class="size"><span id="a11y-size-l">גודל טקסט</span>'
      +'<button type="button" class="o" data-a="minus" aria-label="הקטנת טקסט">א-</button>'
      +'<button type="button" class="o" data-a="plus" aria-label="הגדלת טקסט">א+</button></div>'
      +'<div class="grid">'+TOGGLES.map(function(t){return '<button type="button" class="o" data-t="'+t[0]+'" aria-pressed="false">'+t[1]+'</button>'}).join("")+'</div>'
      +'<div class="foot"><a class="a11y-keep" href="accessibility.html">הצהרת נגישות</a><button type="button" data-a="reset">איפוס</button></div>';

    document.body.appendChild(p);document.body.appendChild(btn);

    function sync(){
      p.querySelectorAll("[data-t]").forEach(function(b){b.setAttribute("aria-pressed",s[b.getAttribute("data-t")]?"true":"false")});
      p.querySelector('[data-a="minus"]').disabled=!(s.fs>0);
      p.querySelector('[data-a="plus"]').disabled=(s.fs||0)>=STEPS.length-1;
    }
    function open(){p.hidden=false;btn.setAttribute("aria-expanded","true");sync();p.querySelector(".x").focus()}
    function close(back){p.hidden=true;btn.setAttribute("aria-expanded","false");if(back)btn.focus()}

    btn.addEventListener("click",function(){p.hidden?open():close(false)});
    p.addEventListener("click",function(e){
      var b=e.target.closest("button");if(!b)return;
      if(b.classList.contains("x")){close(true);return}
      var a=b.getAttribute("data-a"),t=b.getAttribute("data-t");
      if(a==="plus")s.fs=Math.min((s.fs||0)+1,STEPS.length-1);
      else if(a==="minus")s.fs=Math.max((s.fs||0)-1,0);
      else if(a==="reset")s={fs:0};
      else if(t)s[t]=!s[t];
      apply();save();sync();
    });
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!p.hidden)close(true)});
    document.addEventListener("click",function(e){if(!p.hidden&&!p.contains(e.target)&&!btn.contains(e.target))close(false)});
  }
  if(document.body)build();else document.addEventListener("DOMContentLoaded",build);
})();
