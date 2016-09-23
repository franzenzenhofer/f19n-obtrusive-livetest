function(page) {
  var dom = page.getStaticDom();
  var title = dom.querySelector('head>title');

  if (title) {
    return this.createResult('HEAD', 'Title-tag length: '+title.innerText.trim().length+this.partialCodeLink(title), 'info');
  }
  return null;
}
