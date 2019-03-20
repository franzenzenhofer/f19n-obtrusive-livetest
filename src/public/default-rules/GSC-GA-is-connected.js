(page,done) =>
{
    
    var that = this;
    let lable = "GSC";
    let msg = "";
    let type = "warning";
    let what = null;
    let prio = null;

    //GSC API
    const { googleApiAccessToken } = this.getGlobals();
    if(!googleApiAccessToken)
    {
        msg = "To get the most out of this app, connect it with Google Search Console and Google Analytics. "+'<a href="'+that.getGlobals().rulesUrl+'" target="_blank">Settings</a>.';
        done(that.createResult(lable, msg, type, what, prio));
        return null;
    }
    done();
    return null;
}
