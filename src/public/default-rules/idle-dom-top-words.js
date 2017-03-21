function(page)
{
 
function getFrequency2(string, cutOff, minlength) {
  if(!minlength){minlength = 0}
  var cleanString = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()<>"']/g," "),
      words = cleanString.split(' '),
      frequencies = {},
      word, frequency, i;

  for( i=0; i<words.length; i++ ) {
    word = words[i].trim();
    if(word.length>=minlength)
    {
      frequencies[word] = frequencies[word] || 0;
      frequencies[word]++;
    }
  }

  words = Object.keys( frequencies );

  return words.sort(function (a,b) { return frequencies[b] -frequencies[a];}).slice(0,cutOff);
}

var dom = page.getIdleDom();
if(dom)
{
  var parser = new DOMParser();
  var doc = parser.parseFromString(dom.body.innerText, "text/html");
  var wA = getFrequency2( doc.body.innerText, 1000, 5);

  var top10 = wA.slice(0,10).join(', ');
  return this.createResult('DOM', 'Top words (5 or more chars): '+top10+' - '+this.partialTextLink('more',wA), 'info', 'idle');
}
else
{
  return null;
}


}
