(page,done)=>
{

function timeDifference(current, previous) {
    
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    
    var elapsed = current - previous;
    
    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }
    
    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }
    
    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
         return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
    }
    
    else if (elapsed < msPerYear) {
         return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }
    
    else {
         return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
    var that = this;
    let lable = "GSC";
    let msg = "";
    let type = "info";
    let what = null;
    let prio = null;

    //GSC API
    const { googleApiAccessToken } = this.getGlobals();
    
    page.hasGscAccess(googleApiAccessToken, ()=>{
        
        const gscApiRequest = (token, api, requestbody, success, fail) =>
        { 
            window.fetch(api,
                {
                    method: "POST",
                    mode: 'cors',
                    headers: new Headers(
                    {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': 'Bearer '+token
                    }),
                    body: JSON.stringify(requestbody)
                }).then((response)=>
                {
                    console.log(response)
                    success(response);
                }).catch((err)=>{
                    console.log(err)
                    fail(err);
                });
        }


        let url = page.getURL("first");
        let uo = new URL(url);
        let origin = uo.origin+'/';

       
     /*   if(url===url_s || url_s === origin)
        {
            done();
            return null;
        }
*/
       // let tpl = 'https://search.google.com/search-console/performance/search-analytics?resource_id='+encodeURIComponent(origin)+'&breakdown=page&num_of_days=28&page=*'+encodeURIComponent(url_s);
       // let tpl_msg = '<a href="'+tpl+'" target="_blank">Pages</a>';

       // let tql = 'https://search.google.com/search-console/performance/search-analytics?resource_id='+encodeURIComponent(origin)+'&breakdown=query&num_of_days=28&page=*'+encodeURIComponent(url_s);
       // let tql_msg = '<a href="'+tql+'" target="_blank">Queries</a>';
        
        let req = {
  "inspectionUrl": url,
  "siteUrl": origin,
  "languageCode": "en-US"
            };
        

        let api = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
        gscApiRequest(googleApiAccessToken, api, req, (response) => 
        {
            if(response.status == 200)
            {

                response.json().then(function(data)
                {
                    let pass = false;
                    if(data.inspectionResult.indexStatusResult.verdict == "PASS")
                    {
                        type="info";
                        pass = true;
                    }
                    else
                    {
                        type="warning";
                    }
                    //debugger;
                    if(!data.inspectionResult)
                    {
                        type = "warning";
                        msg = "URL Inspection API delivered no results."
                        done(that.createResult(lable, msg, type, what, prio));
                        return null;
                    };


                    
                    let indexed = data.inspectionResult.indexStatusResult.coverageState;
                    if(indexed.includes("not"))
                    {
                        type = "warning";
                    }
                    let link_msg = "";
                   
                    if(true)
                    {
                        let links = []

                        links.sort(function(a, b){
                        // ASC  -> a.length - b.length
                        // DESC -> b.length - a.length
                        return a.length - b.length;
                        });

                        if(data.inspectionResult.indexStatusResult && data.inspectionResult.indexStatusResult.referringUrls)
                            {
                        links = data.inspectionResult.indexStatusResult.referringUrls
                            }

                        if(links.length > 0)
                        {
                            link_msg = " Referring page <a target='_blank' style='  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;' href='"+links[0]+"'>"+links[0]+"</a>"
                            if(links.length>1)
                            {
                                link_msg = link_msg+" and "+(links.length-1)+that.stringifyLink(links)+" more."
                            }
                        }
                        else
                        {
                            link_msg =" No referring pages reported."
                        }
                    }

                    let starter = "GSC URL Inspection";
                    if(data.inspectionResult.inspectionResultLink)
                    {
                        starter = " <a href='"+data.inspectionResult.inspectionResultLink+"' target='_blank'>GSC URL Inspection</a>"
                    }
                    //

                    let last_crawl_message = "";

                    if(data.inspectionResult.indexStatusResult.lastCrawlTime)
                    {
                        let rel_time = timeDifference(new Date(), new Date(data.inspectionResult.indexStatusResult.lastCrawlTime))
                        last_crawl_message = " Last crawled "+rel_time+".";
                    }

                    prio = 14700;
                    msg = starter+": "+indexed+that.stringifyLink(data)+""+link_msg+last_crawl_message;
                    
                    done(that.createResult(lable, msg, type, what, prio));
                    //
                    return null;
                });
            }
            

        }, (err) =>
        {
            console.log(err)
            done();
            return null; 
        });

    },
    ()=>{done(); return null;}) 
}