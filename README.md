hnCommentWatcher
===============

There are many bookmarklets for HackerNews but I needed one for watching the comments on posts not just the front page. SO this bookmarklet is for running on Threads/Posts and highlights the newest comments periodically as well as scrolling to the first new comment. I'll fix it up soon.

*Disclaimer:*

Heavily based on @mrspeakers HackemUP repo
I just threw this together it needs alot of refactoring and has comeblatant copy pasting of other peoples code. Until such time as i can organise it, that will have to do.


*bookmarklet*

Use the code below in a bookmark:

    javascript:(function(){window.hncBase='https://github.com/christopherdebeer/hnCommentWatcher/raw/master/';var%20a=document.getElementsByTagName('head')[0],b=document.createElement('script');b.type='text/javascript';b.src=hncBase+'hnCOmmentWatcher.js?'+Math.floor(Math.random()*99999);a.appendChild(b);})();%20void%200
