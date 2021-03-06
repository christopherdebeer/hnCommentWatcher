/*
Welcome to a Hacker News Bookmarklet...
"hnCommentWatcher" by cChristopher de Beer
v1.1

jQuery Bookmarklet loader/initialiser
*/

// Loadem Up!

if (typeof window.hnCW !== "undefined") {
    hnCW.loop();
} else {
    (function(opts){fullFunc(opts)})({
        css: [
            hncBase + "hnCommentWatcher.css"
        ],
        js : [
            hncBase + "lib/hnutimer.js",
            hncBase + "lib/jquery.scrollTo.js",
            hncBase + "lib/jenkinsHash.js",
            hncBase + "lib/underscore-1.2.3.min.js",
            hncBase + "hnCommentWatcher.js"
        ],
        ready : function() {

            // Only works on the main page
            // var loc = window.document.location;
            // if(loc.hostname !== "news.ycombinator.com" || loc.pathname !== "/item" ){
            //     alert("Only works on Hacker News item/post page:\nhttp://news.ycombinator.com/item");
            //     return;
            // };

            // Start the show.
            hnCW.init();
            hnutimer.init(function(){hnCW.loop();})
            
            // Open all links in a new tab.
            // ... I don't usually like to do such a thing, but by public demand...
            $("body a").live("click", function(){
                $(this).attr("target", "_blank");
            });
        }
    });

}
    // jQuery bookmarklet magic...
    // ... by Brett Barros (& Paul Irish)
    // ... http://www.latentmotion.com/downloads/blank-bookmarklet-v1.js
    function fullFunc(a){function d(b){if(b.length===0){a.ready();return false}
    $.getScript(b[0],function(){d(b.slice(1))})}function e(b){$.each(b,function(c,f){$("<link>")
    .attr({href:f,rel:"stylesheet",type:'text/css'}).appendTo("head")})}a.jqpath=a.
    jqpath||"//ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js";
    (function(b){var c=document.createElement("script");c.type="text/javascript";c.src=b;
    c.onload=function(){e(a.css);d(a.js)};document.body.appendChild(c)})(a.jqpath)};
