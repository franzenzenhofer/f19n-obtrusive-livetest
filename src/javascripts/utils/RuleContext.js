import { isNumber } from 'lodash';

export const createResult = (_priority, label, message, type = 'info') => {
  let result = { label: _priority, message: label, type: message };

  // TODO remove priority argument + warning
  if (isNumber(_priority)) {
    console.log('Deprecation warning: `priority` has been removed');
    result = { label, message, type };
  }

  return result;
};


export const htmlEntitiesEncode = (str) => {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

export const dataUrlTextLink = (str, anchor) => {
  str = String(str).replace(/"/g, '\"');
  return '<a href="data:text;base64, '+btoa(str)+'" target="_blank">'+anchor+'</a>';
}

export const isIterable = function (stuff) {
 if(stuff)
 {
  return typeof stuff[Symbol.iterator] === 'function';
 }
 return false;
}

export const isString = function (stuff) {
  return typeof stuff === 'string';
}


export const nodeToString = (stuff) =>
{
  if (stuff === undefined || stuff === null) { return '' }
  if (!stuff) {return stuff }
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

//console.log(nodeToString(document.querySelectorAll('h1')));
//console.log(nodeToString('test'));

export const allNodesToString = (...stuffs) =>
{
	//console.log(stuffs);
  stuffs = Array.prototype.slice.call(stuffs);
	if(!stuffs){return false;}
	var s = '';
  stuffs.forEach(function(stuff){
  	s = s + nodeToString(stuff);
  });
  return s;
}

export const partialCodeLink = (...nodes) => {
	var str = allNodesToString(...nodes);
  return dataUrlTextLink(str, 'PSC');
}


/*

export const codeBox = (str) = {
  var id = this.makeid();
  var boxcode = '<textarea readonly id="'+id+'">'+str+'</textarea>';
  viewcodelink = '<a href="data:,'+str+'" target="_blank">View Code</a>';
}
*/
