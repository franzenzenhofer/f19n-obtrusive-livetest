function(page, done) {
  const all_header_received_events = page.eventsOfType('onHeadersReceived');
  const on_completed = page.firstEventOfType('onCompleted');
  //console.log("oncomplete");
  //console.log(on_completed)
  const idle_dom = page.getIdleDom();
  const canonical = idle_dom.querySelector('link[rel=canonical]');
  //to keep it simple, if there is no http header at all, this rule does not apply
  if(all_header_received_events.length < 1) {done();return;}

  //if there is just one HTTP header and it's not an 30X then this rule does not apply
  if (all_header_received_events.length === 1 && all_header_received_events[0] && all_header_received_events[0].statusCode && !(all_header_received_events[0].statusCode > 299 && all_header_received_events[0].statusCode < 400)) {
    done();
    return null;
  }
  var msg = "";
  var status = "warning";
  if (all_header_received_events.length > 2) { status = "error"; }
  var u = "";
  var sc = "";
  var l = "";
  all_header_received_events.forEach((v,i) => {
    u = v.url;
    sc = v.statusLine;
    l = v.responseHeaders.location;
    msg = msg + u + " → " + sc + " → ";
    }
  )
  //the case that the there is a redirect to a cached version
  if(on_completed && on_completed.fromCache && on_completed.fromCache===true)
  {
    msg = msg + l + " via cache" + " → ";
    u = l;
  }
  if(canonical)
  {
    var c_ok = "";
    if (canonical.href === u) { c_ok = "(OK)";}
    if (canonical.href !== u) { c_ok = "(AWAY)"; }
    msg = msg + "canonical "+ c_ok +" → " + canonical.href + " → ";
  }
  msg = msg.slice(0, -3);
  done(this.createResult('HTTP', msg+this.partialCodeLink(msg), status));
}
