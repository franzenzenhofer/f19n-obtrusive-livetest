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


/*
export const isNodeList = (el) => {
  if (typeof el.length == 'number'
  && typeof el.item == 'function'
  && typeof el.nextNode == 'function'
  && typeof el.reset == 'function') { return true; }
  return false;
}

export const isIterable = (obj) => {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

*/
export const htmlEntitiesEncode = (str) => {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

export const dataUrlTextLink = (str, anchor) => {
  str = String(str).replace(/"/g, '\"');
  return '<a href="data:text;base64, '+btoa(str)+'" target="_blank">'+anchor+'</a>';
}

/*
export const dataUrlCodeLink = (str, anchor) => {
  if (if typeof str !== 'string' && isIterable(str) && str[0].outerHTML )
  {
    var node_list = str;
    var node_list_array = Array.prototype.slice.call(node_list);
    var temp_string = '';
    node_list_array.forEach(
      function(value)
      {
        temp_string = temp_string + value.outerHTML + "\n";
      }
    )
    str = temp_string;
  }
  return dataUrlTextLink(str, anchor);
}
*/
/*
export const makeid = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export const codeBox = (str) = {
  var id = this.makeid();
  var boxcode = '<textarea readonly id="'+id+'">'+str+'</textarea>';
  viewcodelink = '<a href="data:,'+str+'" target="_blank">View Code</a>';
}
*/
