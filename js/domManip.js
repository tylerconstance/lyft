$(document).ready(function(){

  // A few jQuery tweaks for manipulating the DOM

  $(window).scroll(function() {
    var currentScroll = $(window).scrollTop();

    // First, change the opacity of the header when scrolled down a little bit
    if (currentScroll >= 50) {
      $("header").css("background","#333D47");
    } else {
      $("header").css("background","rgba(0,0,0,.5)");
    }

    // Next, let's make the hero image a little more parallax-y
    $("div.heroImage").css("-moz-transform","translate3d(0px, "+ currentScroll*.5 +"px, 0px)");
    $("div.heroImage").css("-webkit-transform","translate3d(0px, "+ currentScroll*.5 +"px, 0px)");
    $("div.heroImage").css("transform","translate3d(0px, "+ currentScroll*.5 +"px, 0px)");

  });


});
