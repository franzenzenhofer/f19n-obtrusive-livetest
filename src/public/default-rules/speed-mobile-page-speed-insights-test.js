function (page, callback) {
  //const key = undefined;
  const key = 'AIzaSyBzSd10DmKsEicgjablypx7RS2-kCLeAQA';
  if (!key) { return this.createResult('SPEED','<a href="https://console.developers.google.com/apis/credentials?project=_" taret="_blank">Please create a free Google API Key</a>', 'warning');}
  var u = page.getURL("first");
  const psi_api_url = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url='+u+'&strategy=mobile&key='+key;

  fetch(psi_api_url)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });




  return 'async'
}
