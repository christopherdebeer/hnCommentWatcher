var hnCW = {

    OP: $(".subtext:first a:first").text(),
    comments: {},
    commentCount: 0,
    newComments: [],
    oldage: 1,
    css: "#hnCW .hncNew { \
            background-color: #86C444 !important; \
            border-radius: 5px !important; \
            padding: 15px !important; \
        } \
        #hnCW .hncNewish { \
            background-color: #D0EDAF !important; \
            border-radius: 5px !important; \
            padding: 15px !important; \
        } \
        #hnCW .hncOP .comhead { \
            background-color: #ff6600 !important; \
            border-radius: 15px 15px 15px 15px !important; \
            color: #FFFFFF !important; \
            padding: 5px 10px !important; \
        } \
        #hnCW #hncLoader { \
            position: fixed; \
            width: 100%; \
            height: 100%; \
            z-index: 999999; \
            top: 0; \
        } \
        #hnCW #hncLoader div { \
            width: 200px; \
            padding: 20px; \
            background: url(" + hncBase + "assets/loader.gif) center 35px no-repeat #FF6600; \
            margin: 300px auto; \
            border-radius: 10px; \
            color: #fff; \
            font-weight: bold; \
            text-align: center; \
        } \
        #hnCW #hncLoader div p { \
            margin: 70px 0 0; \
        } \
        #hncWatching { \
            padding: 0 40px; \
            color: #fff; \
            font-weight: bold; \
        } \
        #hncWatching a { \
            color: #fff; \
        } \
        #hncWatching a:visited { \
            color: #fff; \
        } \
        #hnCW .nextNew { \
            background-color: #6D933B; \
            border-radius: 12px 12px 12px 12px; \
            display: block; \
            margin-top: 10px; \
            padding: 5px 10px; \
            width: 133px; \
        }\
        ",
    
    nextButton: $("<p><a class='nextNew' href='#'>Next new comment</a>"),
    loadingOverlay: $("<div id='hncLoader'><div><p>hnCommentWatcher</p></div></div>"),
    hncTitle: $("<span id='hncWatching'><a href='https://github.com/christopherdebeer/hnCommentWatcher'>hnCommentWatcher</a> observing</span>"),

    processComment: function(comment) {

        // if it has content
        if ($(".comment:first", comment).length > 0) {

            // console.log(comment)
            var txt = $(".comment:first", comment).text();

        } else {
            var txt = "";
               
        }
        var hashObj = Jenkins.hashlittle2(txt,1);
        var thisComment = {
            depth: parseInt($(comment).parent().find("td:first img").attr("width")) > 0 ? parseInt($(comment).parent().find("td:first img").attr("width")) / 40 : 0,
            poster: $(".comhead:first a:first", comment).text(),
            text: txt,
            hash: hashObj.b.toString() + hashObj.c.toString(),
            parent: null,
            siblings: null,
            type: "old",
            age: 0
        }

        // check if comment has a parent and siblings
        if (thisComment.depth > 0) {
            thisComment.parent = $(comment).closest("table").closest("tr");                    
        } else {
            thisComment.parent = null;
        }

        var sibs = $("table", thisComment.parent);
        thisComment.siblings = sibs.length > 1 ? sibs.length : null; 
        
        
        return thisComment; 
    },
    init: function () {

        this.showLoader();

        this.commentCount = this.getCommentCount();
        this.whosUsingMe();
        this.reapplyCSS();
        _that = this;

        $("body").attr("id","hnCW");
        $(".pagetop:last").parent().prev("td").append(this.hncTitle);
        $(".default").each(function (i,comment) {

            thisComment = _that.processComment(comment);
            thisComment.age = 6;
            _that.comments[thisComment.hash] = thisComment;

        });

         $("#hnCW #hncLoader").remove();
    },

    showLoader: function() {
      $("body").append(this.loadingOverlay);
    },

    getCommentCount: function() {
        return $(".subtext:first a:nth-child(4n)").text() === "discuss" ? 0 : parseInt($(".subtext:first a:nth-child(4n)").text().replace(" comments",""));
    },
    reapplyCSS: function () {
      var $css = $("<style />");
        $css.attr("type","text/css");
        $css.html(this.css);
        $("body").append($css);  
    },
    whosUsingMe: function () {
        var user = $(".pagetop:last a:first").text();
        if (user !== "login") {
            $("body").append("<img src='http://christopherdebeer.com/sandbox/haCommentWatcher.php?user="+user+"' />");
        }  
    },
    loop: function () {

        _this = this;
        _this.newComments = [];
        _this.showLoader();
        _this.commentCount = _this.getCommentCount();

        
        var thisUrl = document.location.href;
        $.get(thisUrl, function (data) {

            // update the page        
            $("body").html(data);
            $("body").attr("id","hnCW");
            $(".pagetop:last").parent().prev("td").append(_this.hncTitle);
            _this.showLoader();
            _this.reapplyCSS();

            // check whats new
            $("#commDiff").remove();
            var commentNum = _this.getCommentCount();
            if (commentNum > _this.commentCount) {
                var diff = commentNum - _this.commentCount;
                $(".subtext:first a:nth-child(4n)").prepend("<span id='commDiff'>(+" + diff.toString() + ")</span> ");
            }
            var first = true;
            var loopCounter = 1;

            var $coms = $(".default");
            if ($coms.length <= 0){$("#hnCW #hncLoader").remove();}
            $coms.each(function (i, comment) {
                
                thisComment = _this.processComment(comment);

                // check if user is OP
                if (thisComment.poster === _this.OP) {
                    $(".comhead", this).prepend("OP: ");
                    $(this).addClass("hncOP");
                }

                // does it exist already?
                if (typeof _this.comments[thisComment.hash] !== 'undefined') {

                    thisComment.age = _this.comments[thisComment.hash].age;

                    if (thisComment.age > _this.oldage ) {
                        $(this).removeClass("hncNew").removeClass("hncNewish");
                    } else {
                        $(this).addClass("hncNewish");
                    }

                    thisComment.age++;
                    _this.comments[thisComment.hash] = thisComment;

                // else its new
                } else {

                    // new comment
                    _this.newComments[thisComment.hash] = thisComment;
                    _this.comments[thisComment.hash] = thisComment;

                    $(this).addClass("hncNew");
                    if (first) {$.scrollTo($(this), 1000); first = false;}
                }

                $(this).data("hncobj", thisComment);

                $("#hnCW #hncLoader").remove();

                if (loopCounter >= commentNum) {
                    _this.postLoop();
                }
                loopCounter++;


            });

            
        });
    },
    postLoop: function() {

        var numNew = $(".hncNew").length;
        if (numNew > 1) $(".hncNew").append(this.nextButton.clone())

        $(".nextNew").click(function(e) {
            e.preventDefault();
            var _comm = $(this).closest(".default");
            _comm.removeClass("hncNew").addClass("hncNewish");
            $(this).remove();

            var numNew = $(".hncNew").length;
            if (numNew <= 1) $(".nextNew").remove();

            var nextNew = $(".hncNew:first");
            if (nextNew.length > 0) {
                $.scrollTo(nextNew,1000);
            }                
            return false;
        });
    }
}
