(page,done) =>
{
    var that = this;
    let lable = "GSC";
    let msg = "";
    let type = "info";
    let what = null;
    let prio = null;

    //GSC API
    const { googleApiAccessToken } = this.getGlobals();

    if(!googleApiAccessToken) {done();return null; }

    let url = page.getURL('first');
    let uo = new URL(url);
    let origin = uo.origin+'/';
    let api = 'https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(origin);

    

    const headers = {
        Authorization: `Bearer ${googleApiAccessToken}`,
    };

    fetch(api, { headers }).then((response)=>{
        if(response.status!==200)
        {
            msg = "No access to "+origin+" in GSC";
            prio = 0; 
            response.clone().json().then((data)=>{
                console.log(data);
                //msg = msg+" ("+data.error.code+"). "+that.partialCodeLink(data.error.message);
                msg = data.error.message+" ("+data.error.code+")";
                done(that.createResult(lable, msg, 'warning', what, prio));
                return null;
            }).catch((err)=>{
                
                
            });
        }
        response.json().then((data)=>{
            
            prio = 500;
            msg = "You have GSC access to "+data.siteUrl+" as \""+data.permissionLevel+"\".";
            done(that.createResult(lable, msg, type, what, prio))
            return null;
            }).catch((err)=>{
                
                
            });
        
    }).catch((err)=>{
        
        
    });
}


