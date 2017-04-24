function(page, done) {
  const url = page.getURL('first');

  setTimeout(() => {
    this.fetch('https://jsonplaceholder.typicode.com/posts/1', { responseFormat: 'json' }, (response) => {
      done(this.createResult('FETCH', `response from heute.at (${url}): ${JSON.stringify(response)}`, 'info'));
    });
  }, 5000);
}
