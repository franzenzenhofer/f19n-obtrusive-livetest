const sampleData = [
   {
      "frameId": 0,
      "parentFrameId": -1,
      "processId": -1,
      "tabId": 465,
      "timeStamp": 1.46274189E12,
      "url": "http://example.com/",
      "event": "onBeforeNavigate"
   },
   {
      "frameId": 0,
      "method": "GET",
      "parentFrameId": -1,
      "requestId": "17423",
      "tabId": 465,
      "timeStamp": 1.46274189E12,
      "type": "main_frame",
      "url": "http://example.com/",
      "event": "onBeforeRequest"
   },
   {
      "frameId": 0,
      "method": "GET",
      "parentFrameId": -1,
      "requestId": "17423",
      "tabId": 465,
      "timeStamp": 1.46274189E12,
      "type": "main_frame",
      "url": "http://example.com/",
      "event": "onBeforeSendHeaders"
   },
   {
      "frameId": 0,
      "method": "GET",
      "parentFrameId": -1,
      "requestId": "17423",
      "responseHeaders": {
         "accept-ranges": "bytes",
         "cache-control": "max-age=604800",
         "date": "Sun, 08 May 2016 21:10:25 GMT",
         "expires": "Sun, 15 May 2016 21:10:25 GMT",
         "last-modified": "Fri, 09 Aug 2013 23:54:35 GMT",
         "server": "ECS (lga/13A2)",
         "vary": "Accept-Encoding",
         "x-cache": "HIT",
         "x-ec-custom-error": "1",
         "content-encoding": "gzip",
         "content-type": "text/html",
         "etag": "\"359670651+gzip\"",
         "content-length": "606"
      },
      "statusCode": 200,
      "statusLine": "HTTP/1.1 200 OK",
      "tabId": 465,
      "timeStamp": 1.46274189E12,
      "type": "main_frame",
      "url": "http://example.com/",
      "event": "onHeadersReceived"
   },
   {
      "frameId": 0,
      "fromCache": true,
      "ip": "2606:2800:220:1:248:1893:25c8:1946",
      "method": "GET",
      "parentFrameId": -1,
      "requestId": "17423",
      "statusCode": 200,
      "statusLine": "HTTP/1.1 200 OK",
      "tabId": 465,
      "timeStamp": 1.46274189E12,
      "type": "main_frame",
      "url": "http://example.com/",
      "event": "onCompleted"
   },
   {
      "frameId": 0,
      "processId": 133,
      "tabId": 465,
      "timeStamp": 1.46274189E12,
      "transitionQualifiers": [
         "from_address_bar"
      ],
      "transitionType": "typed",
      "url": "http://example.com/",
      "event": "onCommitted"
   },
   {
      "html": "<head>\n    <title>Example Domain<\/title>\n\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <style type=\"text/css\">\n    body {\n        background-color: #f0f0f2;\n        margin: 0;\n        padding: 0;\n        font-family: \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n        \n    }\n    div {\n        width: 600px;\n        margin: 5em auto;\n        padding: 50px;\n        background-color: #fff;\n        border-radius: 1em;\n    }\n    a:link, a:visited {\n        color: #38488f;\n        text-decoration: none;\n    }\n    @media (max-width: 700px) {\n        body {\n            background-color: #fff;\n        }\n        div {\n            width: auto;\n            margin: 0 auto;\n            border-radius: 0;\n            padding: 1em;\n        }\n    }\n    <\/style>    \n<\/head>\n\n<body>\n<div>\n    <h1>Example Domain<\/h1>\n    <p>This domain is established to be used for illustrative examples in documents. You may use this\n    domain in examples without prior coordination or asking for permission.<\/p>\n    <p><a href=\"http://www.iana.org/domains/example\">More information...<\/a><\/p>\n<\/div>\n\n\n<\/body>",
      "location": {
         "hash": "",
         "search": "",
         "pathname": "/",
         "port": "",
         "hostname": "example.com",
         "host": "example.com",
         "protocol": "http:",
         "origin": "http://example.com",
         "href": "http://example.com/",
         "ancestorOrigins": {}
      },
      "event": "documentEnd"
   },
   {
      "html": "<head>\n    <title>Example Domain<\/title>\n\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <style type=\"text/css\">\n    body {\n        background-color: #f0f0f2;\n        margin: 0;\n        padding: 0;\n        font-family: \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n        \n    }\n    div {\n        width: 600px;\n        margin: 5em auto;\n        padding: 50px;\n        background-color: #fff;\n        border-radius: 1em;\n    }\n    a:link, a:visited {\n        color: #38488f;\n        text-decoration: none;\n    }\n    @media (max-width: 700px) {\n        body {\n            background-color: #fff;\n        }\n        div {\n            width: auto;\n            margin: 0 auto;\n            border-radius: 0;\n            padding: 1em;\n        }\n    }\n    <\/style>    \n<\/head>\n\n<body>\n<div>\n    <h1>Example Domain<\/h1>\n    <p>This domain is established to be used for illustrative examples in documents. You may use this\n    domain in examples without prior coordination or asking for permission.<\/p>\n    <p><a href=\"http://www.iana.org/domains/example\">More information...<\/a><\/p>\n<\/div>\n\n\n<div class=\"f19n-panel-wrapper\"><iframe src=\"chrome-extension://fbmomkjjhaljgbncnahgomipbcajcndb/panel.html\"><\/iframe><\/div><\/body>",
      "location": {
         "hash": "",
         "search": "",
         "pathname": "/",
         "port": "",
         "hostname": "example.com",
         "host": "example.com",
         "protocol": "http:",
         "origin": "http://example.com",
         "href": "http://example.com/",
         "ancestorOrigins": {}
      },
      "event": "documentIdle"
   }
];

export default sampleData;
