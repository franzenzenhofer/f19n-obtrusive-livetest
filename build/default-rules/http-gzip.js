function(page, done) {
  var hh = page.getHttpHeaders("last");
  var hr = page.getRawHttpHeaders("last");
  var u = page.getURL("last");

  var gzip = true;
  var brotli = true; 

  if(!hh){done();return;} //wenn keine header, keine aussage

  var encoding = hh['content-encoding'] || "";
  if (encoding.indexOf('gzip')===-1)
  {
    gzip = false;
  }

  if (encoding.indexOf('br')===-1)
  {
    brotli = false;
  }

  if(brotli == false && gzip == false)
  {
    done(this.createResult('HTTP', u+" no <a href='https://checkgzipcompression.com/faq/what-is-gzip-compression/' target='_blank'>GZIP</a>/<a href='https://en.wikipedia.org/wiki/Brotli' target='_blank'>Brotli</a> compression! - <a href='https://checkgzipcompression.com/?url="+u+"' target='_blank'>Test</a>"+ this.partialCodeLink(hr), 'error'));
  }
  
  if(brotli)
  {
    done(this.createResult('HTTP', " <a href='https://en.wikipedia.org/wiki/Brotli' target='_blank'>Brotli</a> compression detected! - <a href='https://checkgzipcompression.com/?url="+u+"' target='_blank'>Test</a>"+ this.partialCodeLink(hr), 'info'));
  }

  if(gzip)
  {
    done(this.createResult('HTTP', " <a href='https://checkgzipcompression.com/faq/what-is-gzip-compression/' target='_blank'>GZIP</a> compression detected! - <a href='https://checkgzipcompression.com/?url="+u+"' target='_blank'>Test</a>"+ this.partialCodeLink(hr), 'info'));
  }

  done();
}
