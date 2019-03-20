/* global window, document */

import { isNumber } from 'lodash';
//import myRobotsParser from 'robots-parser';
//import _robotsTxt from 'robotstxt';

import simpleRobotParser from 'simple-functional-robots-txt-parser';

const callbacks = {};

let globals = {};

export const setGlobals = (object) => {
  globals = object;
};

export const getGlobals = () => {
  return globals;
};

export const createResult = (...args) => {
  const result = {
    label: null,
    message: null,
    type: 'info',
    what: null,
    priority: 0,
  };

  if (args.length > 1) {
    const [label, message, type = 'info', what, priority = 0] = args;
    return Object.assign(result, { label, message, type, what, priority });
  }

  return Object.assign(result, args[0]);
};

/*export const waitForAsync = (message = 'Waiting for async rule.') => {
  return createResult('async', message, 'pending');
}*/

//https://www.npmjs.com/package/robots-parser
//export const robotsParser = myRobotsParser;

/*export const robotsTxt = function(useragent ="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")
{
  let blank_robots_txt = _robotsTxt(null, useragent);
  return blank_robots_txt;
}*/

export const simpleRobotTxt = (txt,url,ua="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")=>
{
  return simpleRobotParser(txt,url,ua);
}

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

export const sinmpleGscFetch= (token, api, requestbody, callback) =>
{
    fetch(api,
        {
            method: "POST",
            mode: 'cors',
            headers: 
            {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer '+token
            },
            body: JSON.stringify(requestbody)
        }, success);
}

/*export const utf8TextLink = (str, anchor) =>
{
  //str = String(str).replace(/"/g, '\\"');
  str = str.trim();
  str = encodeURIComponent(str);
  return '<a href="data:text/plain;charset=utf-8,'+str+'" target="_blank" title="">'+anchor+'</a>';
}*/

export const utf8TextLink = (str, anchor) => //utf8TextLinkObjectUrl = (str, anchor) =>
{


  str = str.trim();
  let str_enc = encodeURIComponent(str);


  return '<a href="'+globals.codeviewUrl+'?show='+str_enc+'" target="_blank" >'+anchor+'</a>';
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

    if(!Array.isArray(stuff))
    {
      stuff = Array.from(stuff);
    }

      stuff.forEach(function(v){
    	   if(v.outerHTML){ temp_string = temp_string + v.outerHTML+"\n";}
         else {temp_string = temp_string + v + "\n";}
       });

    return temp_string;
  };
  if(stuff !== null && typeof stuff === 'object')
  {

    var stuff_keys = Object.keys(stuff);
    stuff_keys.forEach(function(k)
    {
      temp_string = temp_string + k +': '+stuff[k]+ "\n";
    });
    return temp_string;
  }
  return "Don't know how to transform this data into a data URL!";
};



export const allNodesToString = (...stuffs) =>
{

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


export const partialStringifyLink = (obj) => {
  return '     '+utf8TextLink(JSON.stringify(obj, null, 2), '<span class="show-partial-source Button Button--haptic Button--inline">&lt;/&gt;</span>');
}

export const stringifyLink = partialStringifyLink;

export const partialTextLink = (anchor, ...nodes) => {
	var str = allNodesToString(...nodes);
  return '     '+utf8TextLink(str, anchor);
}

export const highlightLink = (selector, anchortext="Highlight", bordercss="5px solid red") =>
{
  if(!selector){return "";}
  selector = selector.replace(/"/g, '\\"');
  selector = selector.replace(/'/g, "\\'");
  let link = " <a href='javascript://' onclick=\"for(e of window.top.document.querySelectorAll('"+htmlEntitiesEncode(selector)+"')){e.style.border='"+htmlEntitiesEncode(bordercss)+"';}\">"+anchortext+"</a>";
  return link;
}


export const dateMinus = (minus = 0) => {
  let date = new Date();
  date.setDate(date.getDate() - minus);
  
  
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  return '' + y + '-' + (m < 10 ? '0' : '') +m + '-' + (d < 10 ? '0' : '') + d;
}




