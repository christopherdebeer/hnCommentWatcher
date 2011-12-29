var hnCW = {

    comments: {},
    commentCount: 0,
    newComments: [],

    init: function () {
        this.commentCount = this.getCommentCount();
        $(".default").each(function (comment) {
            var text = $(".comment", this).text();
            var hashObj = Jenkins.hashlittle2(text,1);
            var hash = hashObj.b.toString() + hashObj.c.toString();

            this.comments[hash] = 6;
        });
    },

    getCommentCount: function(){
        return parseInt($(".subtext:first a:nth-child(4n)").text().replace(" comments",""));
    },

    loop: function () {

        this.newComments = [];
        
        var thisUrl = document.location.href;
        $.get(thisUrl, function (data) {

            // update the page        
            $("body").html(data);

            // check whats new
            $("#commDiff").remove();
            var commentNum = this.getCommentCount();
            if (commentNum > this.commentCount) {
                var diff = commentNum - this.commentCount;
                $(".subtext:first a:nth-child(4n)").prepend("<span id='commDiff'>(+" + diff.toString() + ")</span> ");
            }
            var first = true;
            $(".default").each(function (comment) {
                
                var text = $(".comment", this).text();
                var hashObj = Jenkins.hashlittle2(text,1);
                var hash = hashObj.b.toString() + hashObj.c.toString();

                if (typeof this.comments[hash] !== 'undefined') {

                    if (this.comments[hash] > 5 ) {
                        $(this).removeClass("hncNew").removeClass("hncNewish");
                    } else {
                        this.comments[hash]++;
                        $(this).addClass("hncNewish");
                    }
                } else {

                    // new comment
                    $(this).append("<p><a class='nextNew' href='#'>Next</a>");
                    this.newComments.push(this);

                    this.comments[hash] = 1;
                    $(this).addClass("hncNew");

                    if (first) {$.scrollTo($(this), 1000); first = false;}
                }

            });

            $(".nextNew").click(function(e){
                e.preventDefault();
               var _this = $(this).parent();
               var ind = _.indexOf(this.newComments, _this);
               if (ind !== -1) {
                   $.scrollTo($(this.newComments[ind+1]),1000);
               }
               return false;
            });
        });

    }
}
