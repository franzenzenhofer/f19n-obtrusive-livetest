function(page, done) {
  var hh = page.getHttpHeaders("last");
  var hr = page.getRawHttpHeaders("last");
  var l = hh['unavailable_after'] || false;
  let msg = "";
  let type = "info";

  if(l)
  {
    msg = '"Unavailable after HTTP header detected:';
    const date = Date.parse(l.join(':'));
    if(!isNaN(date))
    {
      msg = msg + " "+l+" not a valid date.";
      type="error";
    }
    else if(date < Date.now())
    {
      msg = msg + " "+l+" already in the past!"
      if(type!=='error'){ type="warning";}
    }
    else
    {
      msg = msg + " "+l;
    }
    msg=msg+"."+this.partialCodeLink(hr);
  }
  done(this.createResult("HTTP", msg, type));return; 
}
