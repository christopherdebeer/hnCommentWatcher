var hnCW = {

    OP: "",
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
        }",
    
    nextButton: $("<p><a class='nextNew' href='#'>Next</a>"),

    init: function () {
        _this = this;

        _this.OP = $(".subtext:first a:first").text();
        _this.commentCount = _this.getCommentCount();
        _this.reapplyCSS();
        $("body").attr("id","hnCW");
        $(".default").each(function (comment) {
            _this.comments[hash] = processComment(comment);
        });
    },

    getCommentCount: function(){
        return parseInt($(".subtext:first a:nth-child(4n)").text().replace(" comments",""));
    },
    processComment: function(comment) {

        _this = comment;
        var txt = $(".comment", _this).text();

        var thisComment = {
            depth: parseInt($(_this).parent().find("td:first img").attr("width")) > 0 ? parseInt($(_this).parent().find("td:first img").attr("width")) / 40 : 0,
            poster: $(".comhead:first a:first", _this).text(),
            text: txt,
            hash: Jenkins.hashlittle2(txt,1).b.toString() + Jenkins.hashlittle2(txt,1).c.toString(),
            parent: null,
            siblings: null,
            type: "old",
            age: 0
        }

        // check if comment has a parent and siblings
        if (thisComment.depth > 0) {
            thisComment.parent = $(_this).closest("table").closest("tr");                    
        } else {
            thisComment.parent = null;
        }

        var sibs = $("table", thisComment.parent);
        thisComment.siblings = sibs.length > 1 ? sibs.length : null; 
        
        
        return thisComment; 
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
        
        var thisUrl = document.location.href;
        $.get(thisUrl, function (data) {

            // update the page        
            $("body").html(data);
            $("body").attr("id","hnCW");
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
                
                thisComment = processComment(comment);

                // check if user is OP
                if (thisComment.poster === _this.OP) {
                    $(".comhead", this).prepend("OP: ");
                    $(this).addClass("hncOP");
                }


                // does it exist already?
                if (typeof _this.comments[thisComment.hash] !== 'undefined') {

                    thisComment.age = _this.comments[thisComment.hash].age;

                    if (thisComment.age > 5 ) {
                        $(this).removeClass("hncNew").removeClass("hncNewish");
                    } else {
                        $(this).addClass("hncNewish");
                    }
                    thisComment.age++;

                // else its new
                } else {

                    // new comment
                    _this.newComments[thisComment.hash] = thisComment;

                    $(this).append(_this.nextButton.clone());
                    $(this).addClass("hncNew");
                    if (first) {$.scrollTo($(this), 1000); first = false;}
                }

                _this.comments[thisComment.hash] = thisComment;

            });












            $(".nextNew").click(function(e){
                e.preventDefault();
                var _comm = $(this).parent();

                var text = $(".comment", _comm).text();
                var hashObj = Jenkins.hashlittle2(text,1);
                var hash = hashObj.b.toString() + hashObj.c.toString();

                var ind = _.indexOf(_this.newComments, _comm);

                if (ind !== -1) {
                    $.scrollTo($(_this.newComments[ind+1]),1000);
                }
                return false;
            });
        });
    }
}
