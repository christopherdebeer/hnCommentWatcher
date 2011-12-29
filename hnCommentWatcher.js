var comments = {};
var commentCount = 0;
var newComments = [];

var init = function () {
    commentCount = getCommentCount();
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
            $(".subtext:first a:nth-child(4n)").prepend("<span id='commDiff'>(+" + diff.toString() + ")</span> ");
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
            e.preventDefault();
           var _this = $(this).parent();
           var ind = _.indexOf(newComments, _this);
           if (ind !== -1) {
               $.scrollTo($(newComments[ind+1]),1000);
           }
           return false;
        });
    });


    
    // setTimeout(function(){
    //     loop();
    // },50000); 
}
