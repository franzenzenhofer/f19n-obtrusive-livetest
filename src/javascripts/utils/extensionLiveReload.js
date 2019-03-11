const setup = (host = 'localhost', port = 35729) => {
  const connection = new WebSocket(`ws://${host}:${port}/livereload`);
  connection.onerror = (error) => { console.log('Live reload connection error. Retry in 5 seconds …'); setTimeout(() => { setup(host, port); }, 5000); };
  connection.onmessage = () => { chrome.runtime.reload(); };
};

export default setup;
