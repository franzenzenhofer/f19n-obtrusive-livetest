(page, done) =>
{
    
    var that = this;

    let lable = "Amp";
	let msg = "";
	let type = "info"; 
    let what = "";

    let url = page.getURL('first');
    
    const globals = that.getGlobals();
    //if no google api key we fail silently
    if(!globals.variables.google_page_speed_insights_key)
    {
        done();
        return null;        
    } 
    let api = "https://acceleratedmobilepageurl.googleapis.com/v1/ampUrls:batchGet?key=";
    api = api + globals.variables.google_page_speed_insights_key;
    
    fetch(api,
    {
        method: "POST",
        mode: 'cors',
        headers: new Headers(
        {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
        }),
        body: JSON.stringify({
            "lookupStrategy": "IN_INDEX_DOC",
            "urls": [
                url
            ]
        })
    }).then(function(response)
    {
        
        
        if(response.status == 200)
        {
            response.json().then(function(data)
            {
                
                
            });
        }
    }).catch(function(err){
        
        
    });

    done();
    return null;
}