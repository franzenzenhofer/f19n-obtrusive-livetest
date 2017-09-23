function(page,done)
{
  var that = this;
  const url = page.getURL('last');
  const sdom = page.getStaticDom();
  let msg_partial = "";
  let type = 'info';
  let canonical = false;

  let upgradType = (new_type,type) =>
  {
    let Status_table = {
      'info': 0,
      'warning': 1,
      'error': 2
    }
    if(Status_table[new_type]>Status_table[type])
    {
      return new_type;
    }
    return type;
  }

  let getHrefs = (nl) =>
  {
    if (!nl) { return []; }
    let nla = Array.from(nl);
    let hrefs = [];
    for (var a of nl)
    {
      if(a.href)
      {
        hrefs.push(nl.href)
      }
    }
    return hrefs;

  }
//collect all rel=alternate
  const hreflangs = sdom.querySelectorAll('link[rel=alternate][hreflang]');
  if (hreflangs.length === 0) { done();return;}

//collect canonical
  const canonicals = sdom.querySelectorAll('link[rel=canonical]');
  if(canonicals.length === 1){
    canonical = canonicals[0];
  }
  else { //warning of no canonical
    msg_partial = "No valid canonical.";
    type = upgradType("warning",type);
  }


//collect DOM of all rel=alternate URLs (but not itself or canonical)

//check for self reference

//check reference URLs for redirects

//check for back reference





}
