
 /*POST https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.fullstackoptimization.com%2F/searchAnalytics/query?fields=responseAggregationType%2Crows&key={YOUR_API_KEY}
 
{
 "startDate": "2019-02-01",
 "endDate": "2019-03-03",
 "dimensions": [
  "page"
 ],
 "dimensionFilterGroups": [
  {
   "filters": [
    {
     "dimension": "page",
     "expression": "https://www.fullstackoptimization.com/",
     "operator": "equals"
    }
   ]
  }
 ],
 "aggregationType": "auto"
}
 
}
*/

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

        let tql = 'https://search.google.com/search-console/performance/search-analytics?resource_id='+encodeURIComponent(origin)+'&breakdown=page&num_of_days=28&page=!'+encodeURIComponent(url);
        let tql_msg = '<a href="'+tql+'" target="_blank">GSC</a>';
        
        let req = {
            "startDate": sd,
            "endDate": ed,
            "dimensions": [
             "page"
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
                        msg = "No Search Analytics global page click/impression/CTR data."+" "+tql_msg
                        done(that.createResult(lable, msg, type, what, prio));
                        return null;
                    };
                    
                    let clicks = data.rows[0].clicks;
                    let impressions = data.rows[0].impressions;
                    let ctr = data.rows[0].ctr;
                    let pctr = Math.round(ctr* 100 * 100) / 100
                    
                    prio = 1490;
                    msg = "Search Analytics page metrics (all markets): "+clicks+" clicks, "+impressions+" impressions, "+pctr+"% CTR "+that.partialCodeLink(JSON.stringify(data))+" "+tql_msg;
                    
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