(_, done) => {
  const { googleApiAccessToken } = this.getGlobals();
  done({ message: `Google API Token is: ${googleApiAccessToken}`, type: 'info', label: 'TEST', priority: 100000 });
}
