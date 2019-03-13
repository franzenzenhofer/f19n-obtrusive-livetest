(page,done) =>
{
  var do_not_run_string = '%DO_NOT_RUN_DOMAINS%'; //some websites (like stackoverflow) have request limits that block you if you do to many requests, these domains can be added here, comma seperated i.e. stackoverflow.com,stackexchange,ecco-verde
  var mx_number_of_urls_tested_by_page = '%MAX_NR_OF_URLS_TO_TEST%'; //how many URLs to test per page

  mx_number_of_urls_tested_by_page = parseInt(mx_number_of_urls_tested_by_page);
  if(mx_number_of_urls_tested_by_page <= 0 || isNaN(mx_number_of_urls_tested_by_page)){mx_number_of_urls_tested_by_page = 15;} 
  
  var limit_reached = false;
  
  let do_not_run = [];
  

	let that = this;
	let url = page.getURL("last");
	let u = new URL(url);

  let is_done = false;
  let max_wait_time = 10000;

	let dom = page.getStaticDom();
	let lable = "SITE";
	let msg = "";
	let type = "info"; 
	let what = "static";
	let linkstested = 0;

  if(do_not_run_string!='%'+'DO_NOT_RUN_DOMAINS%'){
    do_not_run = do_not_run_string.split(',');
    do_not_run = do_not_run.map(s => s.trim());
    if(do_not_run.some(s => u.hostname.includes(s)))
    {
      done(that.createResult(lable, "Internal link check disabled on "+u.hostname, "warning", what));return; 
      return;
    }
  }

	let ae_redirects = [];
	let ae_ok = [];
	let ae_other = {};

  
	let all_internal_links_slector = "a[href^='"+u.origin+"'], a[href^='/'], a[href^='./'], a[href^='../']";

	var n_raw = dom.querySelectorAll(all_internal_links_slector);

  var n = [];
  var urls = [];

  let addToN = (element) =>
  {
    let h = element.getAttribute("href");
    if(!urls.includes(h))
    {
      urls.push(h);
      n.push(element);
    }
    return n;
  }

  for(let a of n_raw)
  {
    if(a.getAttribute("href").startsWith("//"))
    {
      if(a.getAttribute("href").startsWith("//"+u.host))
      {
          addToN(a);
      }
    }
    else
    {
      if(a.getAttribute("href")!==u.href)
      {
        addToN(a);
      }
    }
    /*if((!a.getAttribute("href").startsWith("//"))&&(a.getAttribute("href")!==u.href))
    {
      n.push(a);
    }*/
  }

  

  let getAnchor = (status_code) =>
  {
    let sc = parseInt(status_code, 10);
    let anchor = '';
    if (sc < 200) {  anchor='#1xx_Informational_response';}
    if (sc <= 200) { anchor='#2xx_Success';}
    if (sc >= 300) {  anchor='#3xx_Redirection'; }
    if (sc >= 400) {  anchor="#4xx_Client_errors";}
    if (sc >= 500) {  anchor="#5xx_Server_errors" }
    return anchor;
  }
	let endgame = (finish = true) =>
	{

    var how_many = 0;
    
    msg = msg + "Internal links check:";
    if(ae_ok.length>0)
    {
      how_many = how_many + ae_ok.length;
      msg = msg+"<br>"+ae_ok.length+" links to HTTP 200 (ok).";
    }
    if(ae_redirects.length>0)
    {
      how_many = how_many + ae_redirects.length;
      msg = msg+"<br>"+ae_redirects.length+" links to redirects"+that.partialCodeLink(ae_redirects)+".";
      type = "warning"
    }



    if(Object.keys(ae_other).length>0)
    {
      for (let k in ae_other)
      {
        let sc = k.substring(1);
        msg = msg+"<br>"+ae_other[k].length+" links to <a target='_blank' href='https://en.wikipedia.org/wiki/List_of_HTTP_status_codes"+getAnchor(sc)+"'>HTTP "+ sc +"</a>"+that.partialCodeLink(ae_other[k])+".";
        how_many = how_many + ae_other[k].length;
      }
      type = "error";
    }
    if(!finish)
    {
      let perc = Math.floor((how_many/n.length)*100);
      if(!limit_reached)
      {
        
      msg = msg+"<br>Test stopped after 10sec, "+perc+"% ("+how_many+" of "+n.length+") tested.";
        if(type==="info"){type="warning";}
      }
      else
      {

        msg = msg+"<br>"+mx_number_of_urls_tested_by_page+" random URLs tested, "+perc+"% ("+how_many+" of "+n.length+"). <a href='"+that.getGlobals().rulesUrl+"' target='_blank'>Set URLs limit.</a>";
      }
      
    }
    done(that.createResult(lable, msg, type, what));return; 
	}

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

	if(n.length>0)
	{

    n = shuffle(n);

		for (let ae of n)
  		{
  			let url_to_fetch = ae.getAttribute("href");
  			if(!url_to_fetch.includes(u.hostname))
  			{
  				url_to_fetch = u.origin + url_to_fetch;
  			}

  			that.fetch(url_to_fetch, {
					responseFormat: 'text',
					method: 'GET'
					}, (response) =>
          				{
          	if(response.redirected === true)
           	{
           				 	ae_redirects.push(ae);
						 }
						 else
						 {
           				 	if(response.status === 200)
           					{
           				 		ae_ok.push(ae);
           				 	}
           				 	else
           				 	{
           				 		if(ae_other['_'+response.status])
           				 		{
                        ae.response_status=response.status;
           				 			ae_other['_'+response.status].push(ae);
           				 		}
           				 		else
           				 		{
                        ae.response_status=response.status;
           				 			ae_other['_'+response.status]=[ae];
           				 		}
           				 	}
           		}
           	linkstested++;
            if(linkstested === mx_number_of_urls_tested_by_page)
            {
              limit_reached = true;
              endgame(false);  
            }
           	else if(linkstested === n.length)
						{
              is_done = true;
							endgame();
						}

          			}
          	);
          	
  		}

	}
	else
	{
		done();return;
	}
  setTimeout(function(){if(!is_done){endgame(false);}},max_wait_time);

}