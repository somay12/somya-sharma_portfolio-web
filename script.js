(function(){
  var root=document.documentElement, btns=document.querySelectorAll('.nav-themes button');
  function setTheme(t,save){
    root.setAttribute('data-theme',t);
    btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.t===t?'true':'false')});
    if(save){try{localStorage.setItem('theme',t)}catch(e){}}
  }
  var saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
  var dark=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved||(dark?'dark':'light'),false);
  btns.forEach(function(b){b.addEventListener('click',function(){setTheme(b.dataset.t,true)})});

  var nav=document.getElementById('nav'), menu=document.getElementById('menu');
  menu.addEventListener('click',function(){var o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o)});
  nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});

  var links={};nav.querySelectorAll('a').forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){Object.values(links).forEach(function(l){l.classList.remove('active')});if(links[e.target.id])links[e.target.id].classList.add('active')}
    })},{rootMargin:'-40% 0px -55% 0px'});
    Object.keys(links).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s)});
  }

  var reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window&&!reduceMotion){
    var revealTargets=document.querySelectorAll('.facts > .fact, section > h2, section > .sub, .offer > div, .projects > .project, .job, .skillgrid > .skills, .two > div, .cta, .cinfo, .cform');
    var revealGroups=new WeakMap();
    var revealObserver=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('in');revealObserver.unobserve(e.target)}
    })},{rootMargin:'0px 0px -8% 0px',threshold:.05});
    revealTargets.forEach(function(el){
      var parent=el.parentElement,index=revealGroups.get(parent)||0;
      revealGroups.set(parent,index+1);
      el.classList.add('rv');
      el.style.transitionDelay=Math.min(index*80,320)+'ms';
      revealObserver.observe(el);
    });
  }

  var prog=document.getElementById('prog');
  function onScroll(){var h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?Math.min(100,scrollY/h*100):0)+'%'}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  var cf=document.getElementById('cf'),note=document.getElementById('f-note');
  var ACCESS_KEY='YOUR_WEB3FORMS_ACCESS_KEY';
  var keySet=ACCESS_KEY!=='YOUR_WEB3FORMS_ACCESS_KEY';
  if(keySet){note.textContent='Your message goes straight to my inbox.'}
  cf.addEventListener('submit',function(e){
    e.preventDefault();
    var g=function(i){return document.getElementById(i).value.trim()};
    var btn=cf.querySelector('button[type=submit]');
    if(!keySet){
      var body='Name: '+g('f-name')+'\nEmail: '+g('f-email')+'\n\n'+g('f-msg');
      var url='mailto:somay3112@gmail.com?subject='+encodeURIComponent(g('f-sub'))+'&body='+encodeURIComponent(body);
      note.textContent='Message sent! Thank you. Check your email app to confirm delivery.';
      var ga=document.createElement('a');
      ga.href='https://mail.google.com/mail/?view=cm&fs=1&to=somay3112@gmail.com&su='+encodeURIComponent(g('f-sub'))+'&body='+encodeURIComponent(body);
      ga.target='_blank';ga.rel='noopener';ga.textContent='Open in Gmail';ga.style.color='var(--accent)';ga.style.fontWeight='600';
      note.appendChild(ga);
      cf.reset();
      window.location.href=url;
      return;
    }
    btn.disabled=true;btn.textContent='Sending...';
    fetch('https://api.web3forms.com/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({access_key:ACCESS_KEY,from_name:'Portfolio website',name:g('f-name'),email:g('f-email'),subject:g('f-sub'),message:g('f-msg')})
    }).then(function(r){return r.json()}).then(function(d){
      if(!d.success)throw new Error('failed');
      cf.reset();note.textContent='Thank you! Your message was sent. I will reply soon.';
    }).catch(function(){
      note.textContent='Could not send the message. Please email somay3112@gmail.com directly.';
    }).then(function(){btn.disabled=false;btn.textContent='Send message'});
  });

  var copy=document.getElementById('copy');
  copy.addEventListener('click',function(){
    var done=function(m){copy.textContent=m;setTimeout(function(){copy.textContent='Copy email address'},2000)};
    try{navigator.clipboard.writeText('somay3112@gmail.com').then(function(){done('Copied')},function(){done('Use the Email me button')})}
    catch(e){done('Use the Email me button')}
  });
})();
