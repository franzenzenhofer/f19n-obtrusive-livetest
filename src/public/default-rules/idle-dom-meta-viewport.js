function(page) {
  var idle_dom = page.getIdleDom();
  var meta_viewports = idle_dom.querySelectorAll('meta[name=viewport]');
  console.log('looking for meta viewports');
  console.log(meta_viewports);
  if(meta_viewports && meta_viewports.length > 0)
  {
    return this.createResult("DOM","Responsive design meta viewport tag ("+meta_viewports.length+") discovered."+this.partialCodeLink(meta_viewports), "info", "Idle");
  }
  return null;
}
