(page,done)=>
{
 /*POST https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fwww.fullstackoptimization.com%2F/searchAnalytics/query?fields=responseAggregationType%2Crows&key={YOUR_API_KEY}
 
{
 "startDate": "2019-02-01",
 "endDate": "2019-03-03",
 "dimensions": [
  "page"
 ],
 "dimensionFilterGroups": [
  {
   "filters": [
    {
     "dimension": "page",
     "expression": "https://www.fullstackoptimization.com/",
     "operator": "equals"
    }
   ]
  }
 ],
 "aggregationType": "auto"
}
 
}
*/
    done();
    return null;
}