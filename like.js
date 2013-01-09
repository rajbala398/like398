var all_elements          = [],
    happy                 = [],
    comment               = [],
    more_comment          = [],
    is_happy_empty        = true,
    is_comment_empty      = true,
    is_more_comment_empty = true,
    halt                  = false,
    tc                    = 0,
    last_tc               = 0,
    recall_period         = 100;
   
var happyDiv = document.createElement('div');
document.getElementsByTagName('body')[0].appendChild(happyDiv);


function click_link ( links, period, name ) {

    document.title = "(" + tc + ") " + links.length + "-" + name;

    if ( halt || !links || !links.length ) {
        if ( name == "comment" ) is_comment_empty = true;
        if ( name == "more_comment" ) is_more_comment_empty = true;
        return;
    }

    for ( var i=0; i < 10; i++ ) { 
        links[0].click();
  if (name == "comment") break;
    }
    setTimeout(function() { click_link ( links.splice(1), period, name ); }, period );
}


function happyFn(happy,period) {
    if (halt || !happy || !happy.length) {
	is_happy_empty = true;
        return;
    }

    tc++;
    happy[0].click();
    happy[0].style.color='#FF0000';
    var countSpan = document.querySelector('#happy span');
    countSpan.innerHTML = parseInt(countSpan.innerHTML) + 1;
    
    window.setTimeout(function() { happyFn(happy.splice(1), period); }, period);
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


function pageScroll() {
    // stop page scrolling if there was few new likes in last iteration
    if ( halt || tc > last_tc ) {
	alert ( "STOP pageScroll: tc=" + tc + "   last_tc=" + last_tc)
        document.title = tc + ' STOP scrolling ';
        recall_period = 100; // resume comment clicking within 100 milisec
	    click_link (comment, recall_period, "comment" );
	    click_link (more_comment, recall_period, "more_comment" );
            happyFn (happy, recall_period*8);
        return;
    }

    window.scrollBy(0,200); // horizontal and vertical scroll increments
    scrolldelay = setTimeout('pageScroll()',100); // scrolls every 100 milliseconds
}


function start_page_scrolling_if_no_like_in_last_iteration () 
{
    // if no like is happned since last iteration, we need to scroll 
    // down to update the page (or to get old feeds)
    if (last_tc == tc) {
        recall_period = 60000; // pause comment clicking for 1 min
        //is_happy_empty = true;
	//is_comment_empty = true;
	//is_more_comment_empty = true;
	document.title = tc + ' scrolling down - no like was detected in past iteration';
        pageScroll();
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
    
        for (var i = 0; i < all_elements.length; i++) {
            if (all_elements[i] && (all_elements[i].title == 'Like this comment' || all_elements[i].title == 'Like this item')) {
                happy. push(all_elements[i]);
            } else if ( is_class ( "uiLinkButton comment_link", i) ) {
                comment. push(all_elements[i]);
            } else if ( is_class ( "UFIPagerLink", i) ) {
                more_comment. push(all_elements[i]);
            }
        }

        happyDiv.innerHTML = '<div id=\'happy\' style=\'background-color:#ddd;font-size:16px;text-align:center;position:fixed;top:40px;right:40px;width:200px;height:100px;border:4px solid black;z-index:9999;padding-top:15px;\'><span>0</span> of '+happy.length+' items liked.<div id=\'happyStatus\' style=\'margin-top:30px;\'><a id=\'happyButton\' href=\'#\' style=\'display:block;\' onclick=\'haltFn();\'>Stop it.</a></div></div>';

	click_link (comment, recall_period, "comment" );
	click_link (more_comment, recall_period, "more_comment" );
        happyFn (happy, recall_period*8);

        start_page_scrolling_if_no_like_in_last_iteration ();
    }

    like_again = setTimeout('like_me()', 1000);
}


like_me ();
