/*
firstPaint = window.chrome.loadTimes().firstPaintTime * 1000;
api.firstPaintTime = firstPaint - window.performance.timing.navigationStart;

*/
function(page){
  var clt = page.getChromeLoadTimes();
  var wt = page.getWindowPerformanceTiming();
  console.log(clt);
  var first_paint = clt.firstPaintTime * 1000;
  var first_paint_time = first_paint - wt.navigationStart;

  var text = "Time to first paint: "+first_paint_time+"ms."

  var type = "info"

  if(first_paint_time > 700) {type = "warning";}
  if(first_paint_time > 1400) {type = "error";}
  if(first_paint_time <= 0) {
    type = "unfinished"
    text = "Time to first paint: Could not calculate!"
  }

  return this.createResult('SPEED', text, type);
}
