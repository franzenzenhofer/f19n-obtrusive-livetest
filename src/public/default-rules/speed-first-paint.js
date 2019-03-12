/*
firstPaint = window.chrome.loadTimes().firstPaintTime * 1000;
api.firstPaintTime = firstPaint - window.performance.timing.navigationStart;

*/

//based on this spec https://developers.google.com/web/updates/2017/12/chrome-loadtimes-deprecated 
function(page, done){
  var paint =  page.getWindowPerformancePaint();
  var first_paint_object = paint[0];
  if(first_paint_object.name==="first-paint")
  {
    var first_paint_time = Math.round(first_paint_object.startTime);
  }
  else
  {
    done();
    return;
  }

  var text = "Time to first paint: "+first_paint_time+"ms."

  var type = "info"

  if(first_paint_time > 700) {type = "warning";}
  if(first_paint_time > 1400) {type = "error";}
  if(first_paint_time <= 0) {
    type = "unfinished"
    text = "Time to first paint: Could not calculate!"
  }

  done(this.createResult('SPEED', text, type));
}
