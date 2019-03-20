/*
var all = document.getElementsByTagName("body");

for (var i=0, max=all.length; i < max; i++) {
     let f = window.getComputedStyle(all[i]).fontSize;
}
*/

function(page, done) {
  var idom = page.getIdleDom();
  let selector = "body > *";
  var elems = idom.querySelectorAll(selector);
  let msg = "";
  if (elems && elems.length>1)
  {
  	for (let i=0, max=elems.length; i < max; i++) {
     let f = window.getComputedStyle(elems[i]).fontSize;
     
     
     
     msg = msg+" "+f
	}
    done(this.createResult('BODY',msg,'info','idle'));
  }
  done();
}