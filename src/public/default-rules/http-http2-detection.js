function(page) {
  var t = page.getChromeLoadTimes();
  var p = page.getLocation().protocol;
  //console.log(p);
  var is_https = false;
  if(p == "https:"){ is_https = true; }
  //console.log(t);
  if (t && t.connectionInfo) {
    var prot = t.connectionInfo;
    var is_h2 = false;
    if(prot.includes("h2")) { is_h2 = true; }
    if(is_https == true && is_h2 == false)
    {
      return this.createResult('HTTP', "Network protocol: "+prot+" (but https protocol)", 'warning');
    }

    return this.createResult('HTTP', "Network protocol: "+prot, 'info');
  }
  return null;
}
