function(page) {
  var idle_dom = page.getIdleDom();
  var meta_viewports = idle_dom.querySelectorAll('meta[name=viewport]');
  console.log('looking for meta viewports');
  console.log(meta_viewports);
  if(meta_viewports && meta_viewports.length > 0)
  {
    return this.createResult("DOM","<a href='https://developers.google.com/webmasters/mobile-sites/mobile-seo/responsive-design' target='_blank'>Responsive design</a> meta viewport tag ("+meta_viewports.length+") discovered."+this.partialCodeLink(meta_viewports), "info", "Idle");
  }
  return null;
}
