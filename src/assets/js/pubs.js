(function(){
  var q=document.getElementById("q");if(!q)return;
  var chips=[].slice.call(document.querySelectorAll(".chip")),groups=[].slice.call(document.querySelectorAll(".ygroup")),empty=document.getElementById("nomatch");
  var year="all";
  function apply(){
    var t=q.value.trim().toLowerCase(),any=false;
    groups.forEach(function(g){
      var shown=0;
      [].forEach.call(g.querySelectorAll(".paper"),function(p){
        var ok=(year==="all"||g.getAttribute("data-year")===year)&&(!t||p.getAttribute("data-search").indexOf(t)>-1);
        p.hidden=!ok;if(ok)shown++;
      });
      g.hidden=shown===0;
      var c=g.querySelector(".ycount");if(c)c.textContent=shown+(shown===1?" paper":" papers");
      if(shown)any=true;
    });
    empty.hidden=any;
  }
  chips.forEach(function(c){c.addEventListener("click",function(){year=c.getAttribute("data-y");chips.forEach(function(x){x.setAttribute("aria-pressed",x===c?"true":"false")});apply()})});
  q.addEventListener("input",apply);
  var clr=document.getElementById("clr");if(clr)clr.addEventListener("click",function(){q.value="";year="all";chips.forEach(function(x){x.setAttribute("aria-pressed",x.getAttribute("data-y")==="all"?"true":"false")});apply()});
})();
