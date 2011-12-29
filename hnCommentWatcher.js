var hnCW = {

    OP: "",
    comments: {},
    commentCount: 0,
    newComments: [],

    init: function () {
        _this = this;

        _this.OP = $(".subtext:first a:nth-child(2n)").text();
        _this.commentCount = _this.getCommentCount();
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

    loop: function () {

        _this = this;
        _this.newComments = [];
        
        var thisUrl = document.location.href;
        $.get(thisUrl, function (data) {

            // update the page        
            $("body").html(data);

            // check whats new
            $("#commDiff").remove();
            var commentNum = _this.getCommentCount();
            if (commentNum > _this.commentCount) {
                var diff = commentNum - _this.commentCount;
                $(".subtext:first a:nth-child(4n)").prepend("<span id='commDiff'>(+" + diff.toString() + ")</span> ");
            }
            var first = true;
            $(".default").each(function (comment) {


                var poster  = $(this, ".comhead:first a:first").text();
                console.log("poster: ", poster);
                var text    = $(".comment", this).text();
                var hashObj = Jenkins.hashlittle2(text,1);
                var hash    = hashObj.b.toString() + hashObj.c.toString();

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
                    _this.newComments.push(this);

                    _this.comments[hash] = 1;
                    $(this).addClass("hncNew");

                    if (first) {$.scrollTo($(this), 1000); first = false;}
                } 

            });

            $(".nextNew").click(function(e){
                e.preventDefault();
               var _this = $(this).parent();
               var ind = _.indexOf(_this.newComments, _this);
               if (ind !== -1) {
                   $.scrollTo($(_this.newComments[ind+1]),1000);
               }
               return false;
            });
        });

    }
}
