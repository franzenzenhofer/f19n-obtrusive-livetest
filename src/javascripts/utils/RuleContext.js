export const createResult = (priority, label, message, type = 'info') => {
  return {
    priority,
    label,
    message,
    type,
  };
};






export const htmlEntitiesEncode = (str) => {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

export const dataUrlTextLink = (str, anchor) => {
  str = String(str).replace(/"/g, '\"');
  return '<a href="data:text;base64, '+btoa(str)+'" target="_blank">'+anchor+'</a>';
}
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
