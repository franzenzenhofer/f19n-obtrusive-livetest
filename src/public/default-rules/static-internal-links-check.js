(page,done) =>
{
  var do_not_run_string = '%DO_NOT_RUN_DOMAINS%'; //some websites (like stackoverflow) have request limits that block you if you do to many requests, these domains can be added here, comma seperated i.e. stackoverflow.com,stackexchange,ecco-verde
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

  //TODO: stupid protocoll relative external links get wrongly selected (hrefs starting with //www.example.com) i.e. like on wikipedia
	let all_internal_links_slector = "a[href^='"+u.origin+"'], a[href^='/'], a[href^='./'], a[href^='../']";

	var n = dom.querySelectorAll(all_internal_links_slector);

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
    is_done = true;
    msg = msg + "Internal links check:";
    if(ae_ok.length>0)
    {
      how_many = how_many + ae_ok.length;
      msg = msg+" "+ae_ok.length+" links to HTTP 200 (ok).";
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
      msg = msg+"<br>Test stopped after 10sec, "+perc+"% ("+how_many+" of "+n.length+") tested.";
      if(type==="info"){type="warning";}
    }
    done(that.createResult(lable, msg, type, what));return; 
	}

	if(n.length>0)
	{

		for (let ae of n)
  		{
  			let url_to_fetch = ae.getAttribute("href");
  			if(!url_to_fetch.includes(u.hostname))
  			{
  				url_to_fetch = u.origin + url_to_fetch;
  			}
  			
  			that.fetch(url_to_fetch, {
					responseFormat: 'text',
					method: 'HEAD'
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
           				if(linkstested === n.length)
						{
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