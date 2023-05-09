(page,done)=>
{
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
                    success(response);
                }).catch((err)=>{
                    fail(err);
                });
        }

        let sd = that.dateMinus(29); //last 28 days starting yesterday
        let ed = that.dateMinus(1); //yesterday
        let url = page.getURL("first");
        let uo = new URL(url);
        let origin = uo.origin+'/';

        let tql = 'https://search.google.com/search-console/performance/search-analytics?resource_id='+encodeURIComponent(origin)+'&breakdown=query&num_of_days=28&page=!'+encodeURIComponent(url);
        let tql_msg = '<a href="'+tql+'" target="_blank">GSC</a>';
        
        let req = {
            "startDate": sd,
            "endDate": ed,
            "dimensions": [
             "query"
            ],
            "dimensionFilterGroups": [
             {
              "filters": [
               {
                "dimension": "page",
                "expression": url,
                "operator": "equals"
               }
              ]
             }
            ],
            "aggregationType": "auto",
            "rowLimit":100
           };
        

        let api = 'https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(origin)+'/searchAnalytics/query?fields=responseAggregationType%2Crows&;';
        
        gscApiRequest(googleApiAccessToken, api, req, (response) => 
        {
            
            if(response.status == 200)
            {
                let ca = [];
                let nca = [];
                let ra = [];
                response.json().then(function(data)
                {
                    
                    
                    
                    if(!data.rows)
                    {
                        type = "warning";
                        msg = "No top query data."+" "+tql_msg
                        done(that.createResult(lable, msg, type, what, prio));
                        return null;
                    };
                    for(let e of data.rows)
                    {
                        //let e = data[key];
                        if(e.clicks!==0)
                        {
                            ca.push(e);
                        }
                        else
                        {
                            nca.push(e);
                        }
                        
                    }
                    nca.sort((a,b)=>{return b.impressions-a.impressions;});
                    ca = ca.concat(nca);
                    for(let e of ca)
                    {
                    
                        let pos = Math.ceil(e.position * 10) / 10
                        ra.push('['+e.keys.join(" ")+"] ("+e.clicks+"/"+e.impressions+"/"+pos+")");
                    
                    }
                    
                    let ma = ra.slice(0,5);
                    prio = 1500;
                    msg = "Top queries 28 days <span title='(Clicks/Impressions/Average Ranking) no market restriction'>(c/i/r)</span>: "+ma.join(", ")+that.partialCodeLink(ra)+" "+tql_msg;
                    
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