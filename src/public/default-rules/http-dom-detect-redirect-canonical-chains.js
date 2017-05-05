function(page, done) {
  const all_header_received_events = page.eventsOfType('onHeadersReceived');
  const idle_dom = page.getIdleDom();
  const canonical = idle_dom.querySelector('link[rel=canonical]');
  if (all_header_received_events.length === 1) {
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
