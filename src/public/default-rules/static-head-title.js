function(page, done) {
  var dom = page.getStaticDom();
  const what = 'static';
  var location = page.getLocation('static');

  //check if we got some data to work with
  if (!dom) { return null; }
  var titletags = dom.querySelectorAll('head > title');
  var lable = 'HEAD';

  if (titletags.length > 0) {
    if(titletags.length === 1)
    {
    done(this.createResult(lable, 'Title: '+titletags[0].innerText+this.partialCodeLink(titletags), 'info', what));
    //check size //throw to short, throw to long
    //check brand
    //TODO check for common non descriptive titles
    }
    else
    {
    done(this.createResult(lable, '<a href="https://support.google.com/webmasters/answer/35624?hl=en#3">Multiple title-tags found.</a> <a href="https://www.w3.org/Provider/Style/TITLE.html">There should be only one.</a>'+this.partialCodeLink(titletags), 'error', what));
    }
  }
  else
  {
    done(this.createResult(lable, '<a href="https://support.google.com/webmasters/answer/35624?hl=en#3">No title-tag found.</a>', 'error', what));
  }
  return null;
}
