(function(){
  var btn=document.getElementById("menuBtn"),nav=document.getElementById("nav");
  if(btn&&nav){btn.addEventListener("click",function(){var o=nav.classList.toggle("open");btn.setAttribute("aria-expanded",o)})}
  /* Podcast buttons open an inline audio player */
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("[data-audio]");
    if(b){
      var host=b.closest(".pod"),old=host.parentNode.querySelector(".audio");
      if(old){var same=old.getAttribute("data-for")===b.getAttribute("data-audio");old.remove();[].forEach.call(host.querySelectorAll("button"),function(x){x.setAttribute("aria-expanded","false")});if(same)return}
      var d=document.createElement("div");d.className="audio";d.setAttribute("data-for",b.getAttribute("data-audio"));
      var a=document.createElement("audio");a.controls=true;a.preload="none";a.src=b.getAttribute("data-audio");d.appendChild(a);
      host.insertAdjacentElement("afterend",d);b.setAttribute("aria-expanded","true");a.play().catch(function(){});
      count("play/"+b.getAttribute("data-audio").split("/").pop(),b.textContent);
      return;
    }
    var l=e.target.closest&&e.target.closest("a[href]");
    if(l&&/\.(pdf|m4a|mp3|zip)(\?|#|$)/i.test(l.getAttribute("href"))){count("download/"+l.getAttribute("href").split("/").pop(),l.textContent)}
  });
  function count(path,title){try{if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:path,title:title,event:true})}catch(_){}}
})();
