/* Altmetric donuts. The official Altmetric script supplies the live score. We redraw the donut without
   the printed number and set the number as page text, so it stays readable in light and dark mode. */
(function(){
  var slots=[].slice.call(document.querySelectorAll("[data-altmetric-doi]"));
  if(!slots.length)return;
  var host=document.createElement("div");host.setAttribute("aria-hidden","true");
  host.style.cssText="position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden";
  document.body.appendChild(host);
  var byDoi={};
  slots.forEach(function(s){
    var d=document.createElement("div");d.className="altmetric-embed";
    d.setAttribute("data-badge-type","medium-donut");d.setAttribute("data-doi",s.getAttribute("data-altmetric-doi"));d.setAttribute("data-link-target","_blank");
    host.appendChild(d);byDoi[s.getAttribute("data-altmetric-doi")]=s;
  });
  var sc=document.createElement("script");sc.async=true;sc.src="https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js";document.body.appendChild(sc);
  function draw(slot,score,src,href){
    var im=new Image();
    im.onload=function(){
      var c=document.createElement("canvas");c.width=c.height=128;
      var x=c.getContext("2d");x.drawImage(im,0,0,128,128);
      x.globalCompositeOperation="destination-out";x.beginPath();x.arc(64,64,64*0.52,0,Math.PI*2);x.fill();
      var a=document.createElement("a");a.className="altb";a.href=href;a.target="_blank";a.rel="noopener";a.setAttribute("aria-label","Altmetric attention score "+score);
      var n=document.createElement("span");n.className="sc"+(String(score).length>2?" s3":"");n.setAttribute("aria-hidden","true");n.textContent=score;
      a.appendChild(c);a.appendChild(n);
      slot.parentNode.replaceChild(a,slot);
    };
    im.src=src;
  }
  function scan(){
    [].forEach.call(host.children,function(d){
      if(d._done)return;
      var img=d.querySelector('img[src*="badges.altmetric.com"]'),a=d.querySelector("a[href]");
      if(!img||!a)return;
      var m=img.src.match(/[?&]score=(\d+)/);if(!m)return;
      d._done=true;var slot=byDoi[d.getAttribute("data-doi")];
      if(slot)draw(slot,+m[1],img.src,a.href);
    });
  }
  var mo=new MutationObserver(scan);mo.observe(host,{childList:true,subtree:true,attributes:true});
  [1500,3500,7000].forEach(function(t){setTimeout(scan,t)});
  setTimeout(function(){mo.disconnect()},20000);
})();
