function(page) {
  var idle_dom = page.getIdleDom();
  var medias = idle_dom.querySelectorAll("link[rel=alternate][media][href]");
  if(medias && medias.length > 0)
  {
    var murl = "";
    var more = "("+medias.length+")";
    if (medias.length===1)
    {
      murl = medias[0].href.trim();
      more = "<a href='"+murl+"' target='_blank'>"+murl+"</a>"
    }
    return this.createResult("DOM","Seperate mobile URL "+more+" discovered."+this.partialCodeLink(medias), "warning", "Idle");
  }
  return null;
}
