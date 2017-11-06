var parseQueryString = function(str=window.location.search) {
    var objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
};

var params = parseQueryString();

//console.log(params['show']);
window.document.querySelector('body > pre').innerText=decodeURIComponent(params['show']);
