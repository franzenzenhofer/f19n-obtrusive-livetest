/* global window, document */

import { isNumber } from 'lodash';
import myRobotsParser from 'robots-parser';

const callbacks = {};

export const createResult = (label, message, type = 'info', what = null) => {
  let result = { label: label, message: message, type: type, what: what };

  // TODO remove priority argument + warning
  //if (isNumber(_priority)) {
  //  console.log('Deprecation warning: `priority` has been removed');
  //  result = { label, message, type };
  //}

  return result;
};

export const waitForAsync = (message = 'Waiting for async rule.') => {
  return createResult('async', message, 'pending');
}

//https://www.npmjs.com/package/robots-parser
export const robotsParser = myRobotsParser;

export const htmlEntitiesEncode = (str) => {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

export const fetch = (url, options, callback) => {
  window.addEventListener('message', (event) => {
    const { command } = event.data;
    if (command === 'fetchResult') {
      const { runId, response } = event.data;
      if (callbacks[runId]) {
        callbacks[runId](response);
        delete callbacks[runId];
      }
    }
  });

  const runId = Math.round(Math.random() * 10000000);
  callbacks[runId] = callback;

  window.parent.postMessage({ command: 'fetch', url, options, runId }, '*');
};

export const utf8TextLink = (str, anchor) =>
{
  //str = String(str).replace(/"/g, '\\"');
  str = str.trim();
  str = encodeURIComponent(str);
  return '<a href="data:text/plain;charset=utf-8,'+str+'" target="_blank" title="">'+anchor+'</a>';
}

export const dataUrlTextLink = (str, anchor) => {
  str = String(str).replace(/"/g, '\"');
  return '<a href="data:text;base64, '+btoa(str)+'" target="_blank" title="'+htmlEntitiesEncode(str)+'">'+anchor+'</a>';
}

//can't open file in _blank due to some security restrictions
export const blobUrlTextLink = (str, anchor) => {
  str = String(str).replace(/"/g, '\"');
  var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
  blob.close();
  return '<a href="'+URL.createObjectURL(blob)+'" target="_blank" title="'+htmlEntitiesEncode(str)+'">'+anchor+'</a>';
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
  Element.prototype.isNodeList = function() {return false;}
  Element.prototype.isElement = function() {return true;}
  NodeList.prototype.isNodeList = HTMLCollection.prototype.isNodeList = function(){return true;}
  var temp_string = '';
  if (stuff === undefined || stuff === null) { return '' }
  if (!stuff) {return stuff }
  if (stuff.outerHTML) { return stuff.outerHTML; }
  if (isIterable(stuff)) {
    if (isString(stuff)) {return stuff;}
    /*if (Array.isArray(stuff)) {
      console.log('is Array');
      console.log(stuff);
      //return allNodesToString(stuff);
      return stuff.join("\n");
    }*/
    if(!Array.isArray(stuff))
    {
      stuff = Array.from(stuff);
    }
    /*console.log('what is it');
    if((stuff.isNodeList && stuff.isNodeList()) ||
    {*/
      stuff.forEach(function(v){
    	   if(v.outerHTML){ temp_string = temp_string + v.outerHTML+"\n";}
         else {temp_string = temp_string + v + "\n";}
       });
    /*}
    else {
      return "Iterable but not a NodeString";
    }*/
    return temp_string;
  };
  if(stuff !== null && typeof stuff === 'object')
  {
    //console.log('stuff');
    //console.log(stuff);
    //console.log(Object.keys(stuff));
    var stuff_keys = Object.keys(stuff);
    stuff_keys.forEach(function(k)
    {
      temp_string = temp_string + k +': '+stuff[k]+ "\n";
    });
    return temp_string;
  }
  return "Don't know how to transform this data into a data URL!";
};

//show only beginning tag tag = elem.innerHTML ? elem.outerHTML.slice(0,elem.outerHTML.indexOf(elem.innerHTML)) : elem.outerHTML;

//console.log(nodeToString(document.querySelectorAll('h1')));
//console.log(nodeToString('test'));

export const allNodesToString = (...stuffs) =>
{
  //console.log('allnodestostring');
	//console.log(stuffs);
  if(!Array.isArray(stuffs))
  {
    stuffs = Array.from(stuffs);
  }
	if(!stuffs){return false;}
  if(stuffs.length===0){return false;}
	var s = '';
  stuffs.forEach(function(stuff){
  	s = s + "\n" + nodeToString(stuff);
  });
  return s;
}

export const partialCodeLink = (...nodes) => {
	var str = allNodesToString(...nodes);
  return '     '+utf8TextLink(str, '<span class="show-partial-source Button Button--haptic Button--inline">&lt;/&gt;</span>');
}

export const partialTextLink = (anchor, ...nodes) => {
	var str = allNodesToString(...nodes);
  return '     '+utf8TextLink(str, anchor);
}


/*

export const codeBox = (str) = {
  var id = this.makeid();
  var boxcode = '<textarea readonly id="'+id+'">'+str+'</textarea>';
  viewcodelink = '<a href="data:,'+str+'" target="_blank">View Code</a>';
}
*/
