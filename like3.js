var speed_s = prompt ("Please enter Like speed (1 is fastest)", "1");
var load_more=confirm("Enable Load More?");
if (load_more) alert ("You have enabled load more");

var all_elements          = [],
    happy                 = [],
    comment               = [],
    clicked_comments      = [],
    more_comment          = [],
    function_timeout      = [],
    is_happy_empty        = true,
    is_comment_empty      = true,
    is_more_comment_empty = true,
    halt                  = false,
    tc                    = 0,
    all_elements_length   = 0,
    speed                 = parseInt ( speed_s );
   
var happyDiv = document. createElement('div');
document. getElementsByTagName ('body')[0]. appendChild (happyDiv);


function click_link ( links, period, name ) 
{
    document. title = "(" + tc + ") " + links. length + "-" + name;

    if ( halt || !links || !links.length ) {
        if ( name == "comment" ) is_comment_empty = true;
        if ( name == "more_comment" ) is_more_comment_empty = true;
        return;
    }

    links[0]. style.fontSize="small";
    links[0]. style.color='#00AA00';
    if (links. length > 1) {
        links[1]. style.fontSize="small";
        links[1]. style.color='#FF0000';
    }

    try { links[0]. touchend(); } catch(err) { alert (err); }
    function_timeout['click_link'+name] = setTimeout(function() { click_link ( links.splice(1), period, name ); }, period );
}


function happyFn ( happy, period ) 
{
    if (halt || !happy || !happy.length) {
	is_happy_empty = true;
        return;
    }

    if ( tc > 1000 ) location.reload();
    document. title = "(" + tc + ")  cc:" + clicked_comments. length + ", TE:" + all_elements_length;
    tc++;
    try { happy[0]. touchend (); } catch(err) { alert (err); }
    
    for( var i =0; i< 1000; ++i) happy[0]. scrollIntoViewIfNeeded();
    var countSpan = document.querySelector('#happy span');
    countSpan.innerHTML = parseInt(countSpan.innerHTML) + 1;
    
    happy[0]. style. fontSize="small";
    happy[0]. style. color='#009900';
    if (happy. length > 1) {
	    happy[1]. style.color='#FF0000';
	    happy[1]. style.fontSize="xx-large";
    }
    function_timeout['happyFn'] = setTimeout(function() { happyFn(happy.splice(1), period); }, period);
}


function haltFn() 
{
    halt = true;
    return false; // prevent default event
}


function is_class (class_name, e) 
{
	if ( typeof all_elements[e]. attributes['class'] == "undefined") {
		value = all_elements[e]. getAttribute("class");
	} else {
		value = all_elements[e]. attributes['class'].nodeValue;
	}

	if ( value != null ) {	
		if ( value == class_name ) {
			return true;
		}
	}
	return false;
}


function like_me ()
{

    if ( halt ) {
        happyDiv. innerHTML = '';
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
	
        all_elements = document. getElementsByTagName('*');
    
	var ignore = 0;
	all_elements_length = all_elements. length;
        for (var i = 0; i < all_elements_length; i++) {
	    var e = all_elements[i];
            if ( e && ( e. title == 'Like this comment' || e. title == 'Like this item') ) {
                happy. push ( e );
            } else if ( is_class ( "uiLinkButton comment_link", i) ) {
		if ( clicked_comments. indexOf (e) == -1 ) comment. push (e);
            } else if ( is_class ( "UFIPagerLink", i) ) {
                more_comment. push(e);
            }
        }
        for (var i = 0; i < comment.length; i++) {
            clicked_comments. push ( (comment[i]) );
        };
	
	more_comment. reverse();

        happyDiv.innerHTML = '<div id=\'happy\' style=\'background-color:#ddd;font-size:16px;text-align:center;position:fixed;top:40px;right:40px;width:200px;height:100px;border:4px solid black;z-index:9999;padding-top:15px;\'><span>0</span> of '+happy.length+' items liked.<div id=\'happyStatus\' style=\'margin-top:30px;\'><a id=\'happyButton\' href=\'#\' style=\'display:block;\' onclick=\'haltFn();\'>Stop it.</a></div></div>';

	click_link ( comment, speed*1000, "comment" );
	click_link ( more_comment, speed*500, "more_comment" );
        happyFn ( happy, speed*800 );

        try {
    	    if (load_more) UIIntentionalStream.instance.loadOlderPosts();
        }
        catch(err) {
        }
    }

    function_timeout['like_me'] = setTimeout('like_me()', speed*1000);
}

if (speed_s != null) like_me ();


