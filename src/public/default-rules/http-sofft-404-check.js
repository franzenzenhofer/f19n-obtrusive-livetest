(page,done)=>
{
	let that = this;
	let l = page.getLocation();
	let u = l.origin+l.pathname;
	console.log(u);
	let un = u.substring(0,u.lastIndexOf('/'));
	let msg = '';
	let type = 'info';
	un = un + "/fake-url-for-soft-404-error-check-"+Math.floor(Math.random() * 100000000000);
	console.log(un);
	let un_link = "<a href='"+un+"' target='_top'>"+un+"</a>";
	let redirectmsg = "";
	let nopriormsg = "";
	that.fetch(un, { responseFormat: 'text' }, (response) => {
		if(response.redirected === true)
		{
			redirectmsg = "after redirect/s ";
			nopriormsg = " no prior redirects";
			type="error";
		}
		if(response.status===404&&response.redirected===true){
			msg="Non existing URL "+un_link+" returns HTTP 404 "+redirectmsg+"(should HTTP 404"+nopriormsg+")";
			type="error";
		} else if(response.status===410){
			msg="Non existing URL "+un_link+" returns HTTP 410 "+redirectmsg+"(should HTTP 404"+nopriormsg+")";
			type="warning";
		}else if(response.status===200){
			msg="<a href='https://support.google.com/webmasters/answer/181708?hl=en' target='_blank'>Soft 404</a>: Non existing URL "+un_link+" returns HTTP 200 "+redirectmsg+"(should HTTP 404"+nopriormsg+")";
			type="error";
		} else if(response.status===404&&!response.redirected)
		{
			done(); return;
		}
		else
		{
			msg="<a href='https://support.google.com/webmasters/answer/181708?hl=en' target='_blank'>Soft 404</a>: Non existing URL "+un_link+" returns HTTP "+response.status+" "+redirectmsg+"(should HTTP 404"+nopriormsg+")";
			type="error";			
		}
		msg = msg + that.stringifyLink(response);
		done(that.createResult('URL', msg, type));
	});
}