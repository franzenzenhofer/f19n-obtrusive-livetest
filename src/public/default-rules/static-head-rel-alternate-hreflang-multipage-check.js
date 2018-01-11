function(page,done)
{
  var that = this;
  const url = page.getURL('last');
  const sdom = page.getStaticDom();
  //console.log(sdom);
  let msg_partial = "";
  let type = 'info';
  let canonical = false;
  var self_reference = false;
  let max_wait_time = 10000;
  let onpage_hreflang = '';
  let page_vs_canonical = 'this page';
  let maybeinbody = false;

  //console.log(canonicals);
  let references_tested = 0;
  let is_done = false;

  //collect all rel=alternate
  let hreflangs = sdom.querySelectorAll('head > link[rel=alternate][hreflang]');
  let canonicals = sdom.querySelectorAll('head > link[rel=canonical]');

  if(hreflangs.length<1)
  {
      //collect all rel=alternate
    hreflangs = sdom.querySelectorAll('link[rel=alternate][hreflang]');
    canonicals = sdom.querySelectorAll('link[rel=canonical]'); 
    maybeinbody=true;
  }

  console.log('relalts');
  console.log(hreflangs);
  console.log(canonicals);
  console.log(sdom.querySelectorAll('link[rel=alternate][hreflang]'));



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


  if(!(hreflangs) || hreflangs.length === 0)
  { 
    /*//check if the hreflangs are not in the head
    if(sdom.querySelectorAll('link[rel=alternate][hreflang]').length!=0)
    {
    done(that.createResult('HEAD', "Link-Rel-Alternate-Hreflang markup in &lt;body&gt; not in &lt;head&gt;! (Maybe &lt;noscript&gt; in &lt;head&gt;?)"+that.partialCodeLink(canonicals, hreflangs), "error", 'static')); return;
    }*/
    done();return;
  }
  console.log('hreflangs');
  console.log(hreflangs);

  if(maybeinbody===true)
  {
    msg_partial = msg_partial + " Markup maybe in the &lt;body&gt; or there is a DOM parsing issue.<br>";
    type = upgradType("warning",type);
  }


  //collect canonical
  if(canonicals.length === 1){
    canonical = canonicals[0].href;
    page_vs_canonical = "<a href='"+canonical+"'>canonical URL</a>"
  }
  else { //warning of no canonical
    msg_partial = msg_partial+"No valid canonical found. ";
    if(url.indexOf('?')===-1)
    {
       msg_partial = msg_partial + "Rel=alternate invalid if page <a href='"+url+"?foo=bar'>referenced using parameters</a>. ";   
    }
    else
    {
      msg_partial = msg_partial + "Rel=alternate invalid if page referenced using parameters. ";
    }
    type = upgradType("warning",type);
    canonical = url;
  }

  //onpage check for self reference
  let onpage_self_reference_relalts = sdom.querySelectorAll('head > link[rel="alternate"][hreflang][href="'+canonical+'"]');

  if(onpage_self_reference_relalts.length > 0)
  {
    self_reference = true;
    //we just choose the first self reference even though there could be multiple...
    onpage_hreflang = onpage_self_reference_relalts[0].hreflang; 
  } else {
    msg_partial = msg_partial+"<b>No onpage self reference found!</b> ";
    type = upgradType("error",type); 
  }


  //get all URLs
  for (var relalt of hreflangs)
  {
    if(relalt.href && relalt.href === canonical)
    {
      //self_reference = true;
      //no need to check, pointing to itself
      //msg_partial = msg_partial + ' (self reference) running test nr'+references_tested;
      references_tested++
    }
    else if(relalt.href)
    {
        let analyzer = (relalt, origin_url) => {
          this.fetch(relalt.href, { responseFormat: 'text' }, (response) =>
          {

            //msg_partial = msg_partial + ' running test nr'+references_tested;
            let is_200 = true;

            //check reference URLs for redirects
            if(response.redirected === true)
            {
                msg_partial = msg_partial+"<br>'<a href='"+relalt.href+"'>"+relalt.hreflang+"</a>' URL triggers redirect!"+that.partialCodeLink(relalt)+" ";
                type = upgradType("warning",type);
            }

            if(response.status!=200)
            {
                msg_partial = msg_partial+"<br>'<a href='"+relalt.href+"'>"+relalt.hreflang+"</a>' returns HTTP "+response.status+"!"+that.partialCodeLink(relalt)+" ";
                type = upgradType("error",type);
                is_200 = false;
            }
            if(is_200)
            {
              let relalt_self_reference = false;
              let relalt_back_reference = false;

              if (response.body)
              {
                //now create new DOMs
                let parser = new DOMParser();
                let dom = parser.parseFromString(response.body, "text/html");
                
                
                let selfies_selector = 'head > link[rel=alternate][hreflang="'+relalt.hreflang+'"][href="'+relalt.href+'"]';
                let backreferences_selector = 'head > link[rel="alternate"][hreflang][href="'+canonical+'"]';

                if(self_reference===true)
                {
                  backreferences_selector = 'head > link[rel="alternate"][hreflang="'+onpage_hreflang+'"][href="'+canonical+'"]';
                }

                let selfies = dom.querySelectorAll(selfies_selector);
                if(selfies.length>0){ relalt_self_reference = true; }

                let backreferences = dom.querySelectorAll(backreferences_selector); 
                if(backreferences.length>0) { relalt_back_reference = true; }
              }

              if(!relalt_self_reference )
              {
                msg_partial = msg_partial+"<br>'<a href='"+relalt.href+"'>"+relalt.hreflang+"</a>' no self reference found!"+that.partialCodeLink(relalt)+"";
                type = upgradType("error",type);
              }

              if(!relalt_back_reference )
              {
                msg_partial = msg_partial+"<br>'<a href='"+relalt.href+"'>"+relalt.hreflang+"</a>' no back reference to "+page_vs_canonical+" found!"+that.partialCodeLink(relalt)+"";
                type = upgradType("error",type);
              }
            }
            references_tested++
            if(references_tested === hreflangs.length)
            {
                //console.log('references tested:');
                //console.log(references_tested);
                //console.log(hreflangs.length);
                endgame();
            }
         });
      }
      analyzer(relalt, canonical);
    }
  }


  var endgame = () =>
  {
    //console.log('endgame');
    //console.log(msg_partial);
    if(msg_partial!='')
    {
      done(that.createResult('HEAD', "Link-Rel-Alternate-Hreflang"+that.partialCodeLink(canonicals, hreflangs)+": "+msg_partial, type, 'static'));
      is_done = true;
      return; 
    }
    done();
    is_done = true;
    return;
  }
setTimeout(function(){if(!is_done){endgame();}},max_wait_time);
}