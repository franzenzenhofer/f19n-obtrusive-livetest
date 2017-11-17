function(page, done) {
  var hh = page.getHttpHeaders("last");
  var hr = page.getRawHttpHeaders("last");
  var l = hh['link'] || false;
  let msg = "";
  let type = "info";
  let msgA = [];
  var temp_msg_partial = '';
  if (l)
  {
    msg = '"Link:" HTTP header detected'
    if(l.toLowerCase().includes('shortlink'))
    {
      type="warning";
      msgA.push("Shortlink");
    }
    if(l.toLowerCase().includes('canonical'))
    {
      type="warning";
      msgA.push("Canonical");
    }
    if(l.toLowerCase().includes('alternate'))
    {
      msgA.push("Alternate");
    }
    if(msgA.length>0)
    {
      temp_msg_partial = " ("+msgA.join(',')+")";
    }
    msg=msg+temp_msg_partial+"."+this.partialCodeLink(hr);
  }
  done(this.createResult("HTTP", msg, type));return; 
}
