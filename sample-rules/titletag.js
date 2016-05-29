function(page) {
  var dom = page.getStaticDom();
  var location = page.getLocation('static');

  //check if we got some data to work with
  if (!dom) { return null; }
  console.log('made it');
  var titletags = dom.getElementsByTagName('title');
  var lable = 'HEAD';
  console.log(titletags);

  if (titletags.length > 0) {
    if(titletags.length === 1)
    {
    return this.createResult(1, lable, 'Title: '+titletags[0].innerText, 'info');
    //check size //throw to short, throw to long
    //check brand
    //TODO check for common non descriptive titles
    }
    else
    {
    return this.createResult(1, lable, '<a href="https://support.google.com/webmasters/answer/35624?hl=en#3">Multiple title-tags found.</a> <a href="https://www.w3.org/Provider/Style/TITLE.html">There should be only one.</a>', 'error');
    }
  }
  else
  {
    return this.createResult(1, lable, '<a href="https://support.google.com/webmasters/answer/35624?hl=en#3">No title-tag found.</a>', 'error');
  }
  return null;
}
