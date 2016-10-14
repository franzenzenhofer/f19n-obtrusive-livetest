function(page, callback)
{

  console.log('in asyn test');
  console.log(callback);
  //this.asyncReturn('test async');
  callback(this.createResult('async', "async return!!!!", "test"));
  return 'async';
  return this.createResult('sync', "sync return", "test");
}
