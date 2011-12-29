var hnCW = {

    OP: $(".subtext:first a:first").text(),
    comments: {},
    commentCount: 0,
    newComments: [],
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
            position: absolute; \
            width: 100%; \
            height: 100%; \
            z-index: 999999; \
            top: 0; \
        } \
        #hnCW #hncLoader div{ \
            width: 100px; \
            height: 100px; \
            background: url(" + hncBase + "assets/loader.gif) center center no-repeat #FF6600; \
            margin: 100px auto; \
            border-radius: 10px; \
            color: #fff; \
            font-weight: bold; \
            text-align: center; \
        } \
        ",
    
    nextButton: $("<p><a class='nextNew' href='#'>Next</a>"),
    loadingOverlay: $("<div id='hncLoader'><div><p>hnCommentWatcher</p></div></div>"),

    processComment: function(comment) {

        // if it has content
        if ($(".comment", comment).length > 0) {

            // console.log(comment)
            var txt = $(".comment", comment).text();

        } else {
            var txt = "";        
        }

        var thisComment = {
            depth: parseInt($(comment).parent().find("td:first img").attr("width")) > 0 ? parseInt($(comment).parent().find("td:first img").attr("width")) / 40 : 0,
            poster: $(".comhead:first a:first", comment).text(),
            text: txt,
            hash: Jenkins.hashlittle2(txt,1).b.toString() + Jenkins.hashlittle2(txt,1).c.toString(),
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

        this.commentCount = this.getCommentCount();
        this.reapplyCSS();
        _that = this;

        $("body").attr("id","hnCW");
        $(".default").each(function (comment) {

            thisComment = _that.processComment(comment);
            thisComment.age = 6;
            _that.comments[thisComment.hash] = thisComment;

        });
    },

    getCommentCount: function(){
        return parseInt($(".subtext:first a:nth-child(4n)").text().replace(" comments",""));
    },
    reapplyCSS: function () {
      var $css = $("<style />");
        $css.attr("type","text/css");
        $css.html(this.css);
        $("body").append($css);  
    },

    loop: function () {

        _this = this;
        _this.newComments = [];

        $("body").append(_this.loadingOverlay);
        
        var thisUrl = document.location.href;
        $.get(thisUrl, function (data) {

            // update the page        
            $("body").html(data);
            $("body").attr("id","hnCW");
            $("body").append(_this.loadingOverlay);
            _this.reapplyCSS();

            // check whats new
            $("#commDiff").remove();
            var commentNum = _this.getCommentCount();
            if (commentNum > _this.commentCount) {
                var diff = commentNum - _this.commentCount;
                $(".subtext:first a:nth-child(4n)").prepend("<span id='commDiff'>(+" + diff.toString() + ")</span> ");
            }
            var first = true;
            $(".default").each(function (comment) {
                
                thisComment = _this.processComment(comment);

                // check if user is OP
                if (thisComment.poster === _this.OP) {
                    $(".comhead", this).prepend("OP: ");
                    $(this).addClass("hncOP");
                }

                // does it exist already?
                if (typeof _this.comments[thisComment.hash] !== 'undefined') {

                    thisComment.age = _this.comments[thisComment.hash].age;

                    if (thisComment.age > 1 ) {
                        $(this).removeClass("hncNew").removeClass("hncNewish");
                    } else {
                        $(this).addClass("hncNewish");
                    }
                    thisComment.age++;

                // else its new
                } else {

                    // console.log("supposedly new (is it?): ", thisComment.text ,typeof _this.comments[thisComment.hash]);

                    // new comment
                    _this.newComments[thisComment.hash] = thisComment;
                    _this.comments[thisComment.hash] = thisComment;

                    console.log("should have added comment to newComments: ", _this.newComments)

                    $(this).append(_this.nextButton.clone());
                    $(this).addClass("hncNew");
                    if (first) {$.scrollTo($(this), 1000); first = false;}
                }

                $("#hnCW .loading").remove();


            });

            $(".nextNew").click(function(e){
                e.preventDefault();
                var _comm = $(this).closest(".default");
                _comm.removeClass("hncNew").addClass("hncNewish");
                $(this).remove();

                var nextNew = $(".hncNew:first");
                if (nextNew.length > 0) {
                    $.scrollTo(nextNew,1000);
                }                
                return false;
            });
        });
    }
}
