function(page, done) {

  function countDomDepth(main) {
    var depth = 0;
    var loop = function(main, d) {
    		
        var temp = d;
        do {
        		
        		if(main.nodeType == 1)
            {
            	d = d + 1;
              
            }
            if(main.hasChildNodes()){
                loop(main.firstChild,d);
             }

            if(d>depth){ depth = d; }
        		d = temp;
        }
        while (main = main.nextSibling);
    }
    loop(main, 0);
    return depth-1;
}

  var idle_dom = page.getIdleDom();
  var depth = countDomDepth(idle_dom.querySelector(':root'))
  var type = "info";
  var text = "DOM Depth count: "+depth+"";
  var comment = "(Good value ~10!)";
  if(depth > 20)
  {
    comment = "Deeply nested DOM! (Good value ~10! OK until ~20!)";
    type="warning";
  }

  if(depth > 32)
  {
    comment = "Excessivly nested DOM! (Good value ~10, OK until ~20! >32 harmful!)";
    type="error";
  }
  done(this.createResult("DOM", text+" "+comment, type, "Idle"));
}
