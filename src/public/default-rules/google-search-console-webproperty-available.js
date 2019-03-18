(page,done) =>
{
    console.log('google-search-console-check');
    var that = this;
    let lable = "GSC";
    let msg = "";
    let type = "info";
    let what = null;
    let prio = null;

    //GSC API
    const { googleApiAccessToken } = this.getGlobals();
    console.log('googleApiAccessToken');
    console.log(googleApiAccessToken);
    if(!googleApiAccessToken)
    {
        console.log('i have no token');
        msg = "To get the most out of this app, connect it with Google Search Console and Google Analytics. "+'<a href="'+that.getGlobals().rulesUrl+'" target="_blank">Settings</a>.';
        type = "warning";
        done(that.createResult(lable, msg, type, what, prio));
        return null;
    }
    console.log('i have the token');
    let url = page.getURL('first');
    let uo = new URL(url);
    let origin = uo.origin+'/'; 
    let api = 'https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(origin);
    api = api +'?key='+googleApiAccessToken; 
    
    console.log(api);
    fetch(api).then((response)=>{
        console.log(api);
        console.log('success');
        console.log(response);
        console.log(response.data);
        response.json().then((data)=>{
            console.log(data);
        });
    }).catch((err)=>{
        console.log('err')
        console.log(err)
    });



    





    done();
    return null;
}