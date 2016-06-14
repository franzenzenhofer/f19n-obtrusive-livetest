// this test looks for all relevant meta robots definitions

function(page) {
    var dom = page.getStaticDom(),
        metaValid = ['robots', 'googlebot'], // General rules first!
        metaRobots,
        metaFound = false,
        index = true;

    // check meta
    var metaValidArray = Array.prototype.slice.call(metaValid);
    metaValidArray.forEach(
        function(value) {
            metaRobots = dom.querySelectorAll('meta[name=' + value + ']');

            if (metaRobots.length > 0) {
                metaFound = true;

                var metaRobotsArray = Array.prototype.slice.call(metaRobots);
                metaRobotsArray.forEach(
                    function(value) {
                        var content = value.getAttribute('content');
                        if (content.indexOf('noindex') >= 0 || content.indexOf('none') >= 0) {
                            index = false;
                        } else if (content.indexOf('index') >= 0 || content.indexOf('all') >= 0) {
                            index = true;
                        }
                    }
                );
            }
        }
    );

    if (metaFound) {
        return this.createResult('HEAD', 'Robots: ' + (index ? 'index' : 'noindex'), index ? 'info' : 'warning');
    } else {
        return this.createResult('HEAD', 'Robots: No Robots meta tag found.', 'info');
    }

}
