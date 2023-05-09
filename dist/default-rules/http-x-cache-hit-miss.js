function(page,done)
{
	let that = this;
	let h = page.getHttpHeaders('last');
	let hh = page.getRawHttpHeaders('last');
	let msgA = [];
	if(h['x-cache'])
	{
		if(h['x-cache'].toLowerCase().includes('hit'))
		{
			msgA.push('Delivered via cache. X-Cache: '+h['x-cache']);
		}
		else if(h['x-cache'].toLowerCase().includes('miss'))
		{
			msgA.push('Cache missed. X-Cache: '+h['x-cache']);
		}
	}
	if(h['x-cache-lookup'])
	{
		if(h['x-cache-lookup'].toLowerCase().includes('hit'))
		{
			msgA.push('X-Cache-Lookup: '+h['x-cache-lookup']);
		}
		else if(h['x-cache-lookup'].toLowerCase().includes('miss'))
		{
			msgA.push('Cache Lookupm missed. X-Cache-Lookup: '+h['x-cache-lookup']);
		}
	}
	if(msgA.length>0)
	{
		//msgA[msgA.length-1]+that.partialCodeLink(hh);
		msgA.push(that.partialCodeLink(hh));
		done(that.createResult('HTTP', msgA.join(' ')));return;
	}
	done();return;
}