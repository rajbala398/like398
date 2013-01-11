var all_elements          = [],
    happy                 = [],
    comment               = [],
    more_comment          = [],
    function_timeout      = [],
    is_happy_empty        = true,
    is_comment_empty      = true,
    is_more_comment_empty = true,
    halt                  = false,
    scrolling_on          = false,
    scrolling_count       = 0,
    last_no_of_comments   = 0,
    tc                    = 0,
    last_tc               = 0;
   
var happyDiv = document.createElement('div');
document.getElementsByTagName('body')[0].appendChild(happyDiv);


function click_link ( links, period, name ) {
    document.title = "(" + tc + ") " + links.length + "-" + name;

    if ( halt || scrolling_on || !links || !links.length ) {
        if ( name == "comment" ) is_comment_empty = true;
        if ( name == "more_comment" ) is_more_comment_empty = true;
        return;
    }

    for ( var i=0; i < 10; i++ ) { 
        links[0].click();
	if (name == "comment") break;
    }
    function_timeout['click_link'+name] = setTimeout(function() { click_link ( links.splice(1), period, name ); }, period );
}


function happyFn(happy,period) {
    if (halt || scrolling_on || !happy || !happy.length) {
	is_happy_empty = true;
        return;
    }

    tc++;
    happy[0].click();
    happy[0].style.color='#FF0000';
    var countSpan = document.querySelector('#happy span');
    countSpan.innerHTML = parseInt(countSpan.innerHTML) + 1;
    
    function_timeout['happyFn'] = setTimeout(function() { happyFn(happy.splice(1), period); }, period);
}


function haltFn() {
    halt = true;
    return false; // prevent default event
}


function is_class (class_name, e) {
	if ( typeof all_elements[e].attributes['class'] == "undefined") {
		value = all_elements[e].getAttribute("class");
	} else {
		value = all_elements[e].attributes['class'].nodeValue;
	}

	if ( value != null ) {	
		if ( value == class_name ) {
			return true;
		}
	}
	return false;
}


function pageScroll() 
{
    // stop page scrolling if there was few new likes in last iteration
    if ( halt || scrolling_count > 3000 ) {
        document. title = tc + ' STOP scrolling ';
	scrolling_on = false;
	like_me ();
        return;
    }

    scrolling_count++;
    window. scrollBy ( 0, 100000 ); // horizontal and vertical scroll increments
    document. title = tc + ' scrolling down ' + scrolling_count.toString();
    function_timeout['pageScroll'] = setTimeout ( 'pageScroll()', 100 ); // scrolls every 100 milliseconds
}


function start_page_scrolling_if_no_like_in_last_iteration () 
{
    // if no like is happned since last iteration, we need to scroll 
    // down to update the page (or to get old feeds)
    if ( last_tc == tc ) {
        for (key in function_timeout) { clearTimeout(key) }
	document. title = tc + ' scrolling down - no like was detected in past iteration';
	scrolling_on = true;
        pageScroll ();
    }
    last_tc = tc;
}


function like_me ()
{

    if ( halt ) {
        happyDiv.innerHTML = '';
        return;
    }

    // re-read page only if all last iteration has been finished
    if ( is_happy_empty && is_comment_empty && is_more_comment_empty ) {
    	happy = [];
	comment = [];
        more_comment = [];
    	is_happy_empty        = false;
    	is_comment_empty      = false;
    	is_more_comment_empty = false;
	
        all_elements = document.getElementsByTagName('*');
    
	var ignore = 0;
        for (var i = 0; i < all_elements.length; i++) {
            if (all_elements[i] && (all_elements[i].title == 'Like this comment' || all_elements[i].title == 'Like this item')) {
                happy. push(all_elements[i]);
            } else if ( is_class ( "uiLinkButton comment_link", i) ) {
                if (last_no_of_comments < ++ignore) comment. push(all_elements[i]);
            } else if ( is_class ( "UFIPagerLink", i) ) {
                more_comment. push(all_elements[i]);
            }
        }
	more_comment.reverse();

        happyDiv.innerHTML = '<div id=\'happy\' style=\'background-color:#ddd;font-size:16px;text-align:center;position:fixed;top:40px;right:40px;width:200px;height:100px;border:4px solid black;z-index:9999;padding-top:15px;\'><span>0</span> of '+happy.length+' items liked.<div id=\'happyStatus\' style=\'margin-top:30px;\'><a id=\'happyButton\' href=\'#\' style=\'display:block;\' onclick=\'haltFn();\'>Stop it.</a></div></div>';

	click_link ( comment, 100, "comment" );
	click_link ( more_comment, 100, "more_comment" );
        happyFn ( happy, 800 );

        start_page_scrolling_if_no_like_in_last_iteration ();

	last_no_of_comments += comment.length;
    }

    function_timeout['like_me'] = setTimeout('like_me()', 1000);
}


like_me ();
