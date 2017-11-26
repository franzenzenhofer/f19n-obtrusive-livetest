function(page, done) {
  const all_header_received_events = page.eventsOfType('onHeadersReceived');
  const on_completed = page.firstEventOfType('onCompleted');
  const all_onHistoryStateUpdated_events = page.eventsOfType('onHistoryStateUpdated');
  //console.log("oncomplete");
  //console.log(on_completed)
  const idle_dom = page.getIdleDom();
  const canonical = idle_dom.querySelector('link[rel=canonical]');
  //to keep it simple, if there is no http header at all, this rule does not apply
  if(all_header_received_events.length < 1) {done();return;}

  //if there is just one HTTP header and it's not an 30X then this rule does not apply
  //and if there is no history push update
  if (all_header_received_events.length === 1 && all_header_received_events[0] && all_header_received_events[0].statusCode && !(all_header_received_events[0].statusCode > 299 && all_header_received_events[0].statusCode < 400) && all_onHistoryStateUpdated_events.length<1) {
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
  console.log('looking for history state change');
  console.log(all_onHistoryStateUpdated_events);
  if(all_onHistoryStateUpdated_events && all_onHistoryStateUpdated_events.length>0)
  {
    console.log('history push detected')
    all_onHistoryStateUpdated_events.forEach((v,i) => {
    console.log(v);
    u = v.url;
    msg = msg + "History (URL) State Update (via JS)" + " → " + u + " → ";
    }
  )
  }
  //todo old school JS redirects
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
