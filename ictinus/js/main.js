$(document).ready(function() {
  var navpos = $('#navbar').offset();
  console.log(navpos.top);
    $(window).bind('scroll', function() {
      if ($(window).scrollTop() > navpos.top) {

        $('#navbar').addClass('fadein');
        $('#navbar').removeClass('fadeout');

        $('#intro').addClass('introout');
        $('#intro').removeClass('introin');
       }
       else {
        $('#navbar').removeClass('fadein');
        $('#navbar').addClass('fadeout');

        $('#intro').removeClass('introout');
        $('#intro').addClass('introin');
       
       }
    });
});