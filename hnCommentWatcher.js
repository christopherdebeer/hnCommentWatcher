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

    init: function () {
        _this = this;

        _this.OP = $(".subtext:first a:first").text();
        _this.commentCount = _this.getCommentCount();
        _this.reapplyCSS();
        $("body").attr("id","hnCW");
        $(".default").each(function (comment) {
            var text = $(".comment", this).text();
            var hashObj = Jenkins.hashlittle2(text,1);
            var hash = hashObj.b.toString() + hashObj.c.toString();

            _this.comments[hash] = 6;
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


                var poster  = $(".comhead:first a:first", this).text();
                var text    = $(".comment", this).text();
                var hashObj = Jenkins.hashlittle2(text,1);
                var hash    = hashObj.b.toString() + hashObj.c.toString();

                
                // check if comment has a parent
                var commentDepth = parseInt($(this).parent().find("td:first img").attr("width"));
                var hasParent = false;
                var parent = null;
                var siblings = null;
                if (commentDepth > 0) {

                    hasParent = true;
                    // count its siblings and get its rank

                    parent = $(this).closest("table").closest("tr");
                    sibligns = $("table", parent);


                    commentDepth = commentDepth / 40;
                } else {
                    commentDepth = 0;
                }

                if (poster === _this.OP) {
                    $(".comhead", this).prepend("OP: ");
                    $(this).addClass("hncOP");
                }

                if (typeof _this.comments[hash] !== 'undefined') {

                    if (_this.comments[hash] > 5 ) {
                        $(this).removeClass("hncNew").removeClass("hncNewish");
                    } else {
                        _this.comments[hash]++;
                        $(this).addClass("hncNewish");
                    }
                } else {

                    // new comment
                    $(this).append("<p><a class='nextNew' href='#'>Next</a>");
                    _this.newComments[hash] = this;

                    _this.comments[hash] = {
                        parent: parent,
                        hasParent: hasParent,
                        depth: commentDepth,
                        siblingsCount: null,
                        siblings: siblings,
                        rank: 0
                    };
                    $(this).addClass("hncNew");

                    if (first) {$.scrollTo($(this), 1000); first = false;}
                } 

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
