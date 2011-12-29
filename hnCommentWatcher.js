
var hnutimer = {
    refreshTime: 2 * (60 * 1000),
    waitOnFocusTime: 1500,

    timerId: null,
    lastCheck: null,
    focusedTime: null,

    init: function(onTimerExpire) {
        $(window).bind({
            "focus": function(){ hnutimer.onFocus(); },
            "blur": function(){ hnutimer.onBlur(); }
        });
        this.onTimerExpire = onTimerExpire;
        // Init onfocus to avoid first time load delay
        this.focusedTime = new Date().getTime() - this.waitOnFocusTime;
        this.update();
    },
    update: function() {
        var doFetch = true,
            refreshTime = this.refreshTime,
            previous = this.lastCheck,
            rightNow = new Date().getTime(),
            elapsed = previous ? rightNow - previous : refreshTime;

        if (elapsed < refreshTime) {
            doFetch = false;
            refreshTime -= elapsed;
        }

        if(doFetch) {
            if(rightNow - this.focusedTime >= this.waitOnFocusTime){
                this.onTimerExpire && this.onTimerExpire();
                this.lastCheck = rightNow;
            } else {
                refreshTime = this.waitOnFocusTime;
            }
        }
        this.timerId = setTimeout(function(){ hnutimer.update(); }, refreshTime);
    },
    onFocus: function() {
        this.focusedTime = new Date().getTime();
        this.update();
    },
    onBlur: function() {
        clearTimeout(this.timerId);
    }
};

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);


var Jenkins = {
    rot: function(x,k) {
        return (x<<k) | (x>>>(32-k));
    },

    mix: function(a,b,c) {
        a = (a - c) | 0;  a ^= Jenkins.rot(c, 4);  c = (c + b) | 0;
        b = (b - a) | 0;  b ^= Jenkins.rot(a, 6);  a = (a + c) | 0;
        c = (c - b) | 0;  c ^= Jenkins.rot(b, 8);  b = (b + a) | 0;
        a = (a - c) | 0;  a ^= Jenkins.rot(c,16);  c = (c + b) | 0;
        b = (b - a) | 0;  b ^= Jenkins.rot(a,19);  a = (a + c) | 0;
        c = (c - b) | 0;  c ^= Jenkins.rot(b, 4);  b = (b + a) | 0;
        return {a : a, b : b, c : c};
    },

    final: function(a,b,c) {
       c ^= b; c -= Jenkins.rot(b,14) | 0;
       a ^= c; a -= Jenkins.rot(c,11) | 0;
       b ^= a; b -= Jenkins.rot(a,25) | 0;
       c ^= b; c -= Jenkins.rot(b,16) | 0;
       a ^= c; a -= Jenkins.rot(c,4) | 0;
       b ^= a; b -= Jenkins.rot(a,14) | 0;
       c ^= b; c -= Jenkins.rot(b,24) | 0;
       return {a : a, b : b, c : c};
    },  

    hashlittle2: function(k, initval, initval2) {
        var length = k.length;
        a = b = c = 0xdeadbeef + length + initval;
        c += initval2;

        offset = 0;
        while (length > 12) {
            a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8) + (k.charCodeAt(offset+2)<<16) + (k.charCodeAt(offset+3)<<24)); a = a>>>0;
            b += (k.charCodeAt(offset+4) + (k.charCodeAt(offset+5)<<8) + (k.charCodeAt(offset+6)<<16) + (k.charCodeAt(offset+7)<<24)); b = b>>>0;
            c += (k.charCodeAt(offset+8) + (k.charCodeAt(offset+9)<<8) + (k.charCodeAt(offset+10)<<16) + (k.charCodeAt(offset+11)<<24)); c = c>>>0;
            o = Jenkins.mix(a,b,c);
            a = o.a; b = o.b; c = o.c;
            length -= 12;
            offset += 12;
        }

        switch(length) {
            case 12: c += (k.charCodeAt(offset+8) + (k.charCodeAt(offset+9)<<8) + (k.charCodeAt(offset+10)<<16) + (k.charCodeAt(offset+11)<<24)); b += (k.charCodeAt(offset+4) + (k.charCodeAt(offset+5)<<8) + (k.charCodeAt(offset+6)<<16) + (k.charCodeAt(offset+7)<<24)); a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8) + (k.charCodeAt(offset+2)<<16) + (k.charCodeAt(offset+3)<<24)); break;
            case 11: c += (k.charCodeAt(offset+8) + (k.charCodeAt(offset+9)<<8) + (k.charCodeAt(offset+10)<<16)); b += (k.charCodeAt(offset+4) + (k.charCodeAt(offset+5)<<8) + (k.charCodeAt(offset+6)<<16) + (k.charCodeAt(offset+7)<<24)); a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8) + (k.charCodeAt(offset+2)<<16) + (k.charCodeAt(offset+3)<<24)); break;
            case 10: c += (k.charCodeAt(offset+8) + (k.charCodeAt(offset+9)<<8)); b += (k.charCodeAt(offset+4) + (k.charCodeAt(offset+5)<<8) + (k.charCodeAt(offset+6)<<16) + (k.charCodeAt(offset+7)<<24)); a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8) + (k.charCodeAt(offset+2)<<16) + (k.charCodeAt(offset+3)<<24)); break;
            case 9: c += (k.charCodeAt(offset+8)); b += (k.charCodeAt(offset+4) + (k.charCodeAt(offset+5)<<8) + (k.charCodeAt(offset+6)<<16) + (k.charCodeAt(offset+7)<<24)); a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8) + (k.charCodeAt(offset+2)<<16) + (k.charCodeAt(offset+3)<<24)); break;
            case 8: b += (k.charCodeAt(offset+4) + (k.charCodeAt(offset+5)<<8) + (k.charCodeAt(offset+6)<<16) + (k.charCodeAt(offset+7)<<24)); a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8) + (k.charCodeAt(offset+2)<<16) + (k.charCodeAt(offset+3)<<24)); break;
            case 7: b += (k.charCodeAt(offset+4) + (k.charCodeAt(offset+5)<<8) + (k.charCodeAt(offset+6)<<16)); a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8) + (k.charCodeAt(offset+2)<<16) + (k.charCodeAt(offset+3)<<24)); break;
            case 6: b += ((k.charCodeAt(offset+5)<<8) + k.charCodeAt(offset+4)); a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8) + (k.charCodeAt(offset+2)<<16) + (k.charCodeAt(offset+3)<<24)); break;
            case 5: b += (k.charCodeAt(offset+4)); a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8) + (k.charCodeAt(offset+2)<<16) + (k.charCodeAt(offset+3)<<24)); break;
            case 4: a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8) + (k.charCodeAt(offset+2)<<16) + (k.charCodeAt(offset+3)<<24)); break;
            case 3: a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8) + (k.charCodeAt(offset+2)<<16)); break;
            case 2: a += (k.charCodeAt(offset+0) + (k.charCodeAt(offset+1)<<8)); break;
            case 1: a += (k.charCodeAt(offset+0)); break;
            case 0: return {b : b, c : c};
        }

        o = Jenkins.final(a,b,c);
        a = o.a; b = o.b; c = o.c;

        return {b : b>>>0, c : c>>>0};
    }
}


var comments = {};
var commentCount = 0;
var newComments = [];

var init = function () {
    commentCount = getCommentCount;
    $(".default").each(function (comment) {
        var text = $(".comment", this).text();
        var hashObj = Jenkins.hashlittle2(text,1);
        var hash = hashObj.b.toString() + hashObj.c.toString();

        comments[hash] = 6;
    });

    setTimeout(loop, 5000);
}

var getCommentCount = function(){
    return parseInt($(".subtext:first a:nth-child(4n)").text().replace(" comments",""));
}

var loop = function () {

    newComments = [];
    
    var thisUrl = document.location.href;
    $.get(thisUrl, function (data) {

        // update the page        
        $("body").html(data);

        // check whats new
        $("#commDiff").remove();
        var commentNum = getCommentCount();
        if (commentNum > commentCount) {
            var diff = commentNum - commentCount;
            $(".subtext:first a:nth-child(4n)").prepend("<span id='commDiff'>(+" + diff.toString() + ")</span>");
        }
        var first = true;
        $(".default").each(function (comment) {
            
            var text = $(".comment", this).text();
            var hashObj = Jenkins.hashlittle2(text,1);
            var hash = hashObj.b.toString() + hashObj.c.toString();

            if (typeof comments[hash] !== 'undefined') {

                if (comments[hash] > 5 ) {
                    $(this).css("background-color","transparent")
                        .css("border-radius","0")
                        .css("padding","0");
                } else {
                    comments[hash]++;
                    $(this).css("background-color", "#D0EDAF")
                        .css("border-radius","5px")
                        .css("padding","15px");
                }
            } else {

                // new comment
                $(this).append("<p><a class='nextNew' href='#'>Next</a>");
                newComments.push(this);

                comments[hash] = 1;
                $(this).css("background-color", "#86C444")
                    .css("border-radius","5px")
                    .css("padding","15px");

                if (first) {$.scrollTo($(this), 1000); first = false;}
            }

        });

        $(".nextNew").click(function(e){
           var _this = $(this).parent();
           var ind = _.indexOf(newComments, _this);
           if (ind !== -1) {
               $.scrollTo($(newComments[ind+1]),1000);
           } 
        });
    });


    
    // setTimeout(function(){
    //     loop();
    // },50000); 
}
