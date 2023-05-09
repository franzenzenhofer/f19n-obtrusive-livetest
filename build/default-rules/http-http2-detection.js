function(page, done) {
  var t = page.getWindowPerformanceNavigation();
  var p = page.getLocation().protocol;

  var is_https = false;
  if(p == "https:"){ is_https = true; }

  if (t) {
    var prot = t.nextHopProtocol
    var is_h2 = false;
    if(['h2', 'hq'].includes(prot)) { is_h2 = true; }
    if(is_https == true && is_h2 == false)
    {
      return done(this.createResult('HTTP', "Network protocol: "+prot+" (but https protocol)", 'warning'));
    }

    return done(this.createResult('HTTP', "Network protocol: "+prot, 'info', null, 400));
  }
}
