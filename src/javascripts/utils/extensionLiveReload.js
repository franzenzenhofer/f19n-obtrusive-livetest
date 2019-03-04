const setup = (host = 'localhost', port = 35729) => {
  const connection = new WebSocket(`ws://${host}:${port}/livereload`);
  connection.onerror = (error) => { console.log('reload connection got error:', error); };
  connection.onmessage = () => { chrome.runtime.reload(); };
};

export default setup;
