var isIterable = function (stuff) {
 if(stuff)
 {
  return typeof stuff[Symbol.iterator] === 'function';
 }
 return false;
}

var isString = function (stuff) {
  return typeof stuff === 'string';
}


var nodeToString = (stuff) =>
{
  if (stuff.outerHTML) { return stuff.outerHTML; }
  if (isIterable(stuff)) {
    if (isString(stuff)) {return stuff;}
    var temp_string = '';
    stuff = Array.prototype.slice.call(stuff);
    stuff.forEach(function(v){
    	if(v.outerHTML){ temp_string = temp_string + v.outerHTML+"\n";}
      else {temp_string = temp_string + v + "\n";}
    });
    return temp_string;
  };
};


var allNodesToString = (...stuffs) =>
{
	
  stuffs = Array.prototype.slice.call(stuffs);
	if(!stuffs){return false;}
	var s = '';
  stuffs.forEach(function(stuff){
  	s = s + nodeToString(stuff);
  });
  return s;
}
