function(page, done) {
  this.fetch('https://orf.at', { responseFormat: 'text' }, (response) => {
    done(this.createResult('FETCH', `response from orf.at: ${response.length}`, 'info'));
  });
}
