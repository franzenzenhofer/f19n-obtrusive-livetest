//this tests look for
//the canoncial tag
//multiple canonicals
function(page, done) {
    var dom = page.getStaticDom();
    const what = 'static';
    var c = dom.querySelectorAll('link[rel=canonical]');
    var location = page.getLocation();
    if (c.length > 0) {
        if (c.length === 1) {
            var href = c[0].getAttribute('href');
            if (href != location.href) {
                //TODO check if it's a relative canoncial
                if (location.href.substring(0, 4) != 'http') {
                    var text = `${location.href} → <a href="https://support.google.com/webmasters/answer/139066?hl=en">Canonical</a> → <a href='${href}' target='_top'>${href}</a><br><a href="https://webmasters.googleblog.com/2013/04/5-common-mistakes-with-relcanonical.html">Canonical is relative, should be absolute.</a> ` + this.partialCodeLink(c);
                } else {
                    var text = `${location.href} → <a href="https://support.google.com/webmasters/answer/139066?hl=en">Canonical</a> → <a href='${href}' target='_top'>${href}</a> ` + this.partialCodeLink(c);
                }
                done(this.createResult('HEAD', text, 'warning', what));
            } else {
                var text = `<a href="https://support.google.com/webmasters/answer/139066?hl=en">Canonical</a>: <a href='${href}' target='_top'>${href}</a> ` + this.partialCodeLink(c);
                done(this.createResult('HEAD', text, 'info', what));
            }
        } else {
            done(this.createResult('HEAD', '<a href="https://webmasters.googleblog.com/2013/04/5-common-mistakes-with-relcanonical.html" target="_top">Multiple canonical found within the static HTML.</a> ' + this.partialCodeLink(c), 'error', what));
        }
    } else {
        done(this.createResult('HEAD', '<a href="https://support.google.com/webmasters/answer/139066?hl=en" target="_top">No canonical found within the static HTML.</a>', 'warning', what));
    }
}