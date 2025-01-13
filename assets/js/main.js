// Import jQuery (must come first)
import $ from 'jquery';
window.$ = window.jQuery = $;

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// Import AOS CSS and JS
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import Pace.js
import 'pace-js';

import p5 from 'p5';
window.p5 = p5; // Attach p5 to the global window object

// Import p5.js scene initializer
import { initBoidsScene } from './boids.js';

// // Import p5.js scene initializer
import { initSummitScene } from './summit.js';

// Custom styles
import '../css/main.scss';

// Initialize libraries and scripts
$(document).ready(() => {
  // Initialize AOS
  AOS.init({
    offset: 120, // Customize settings
    duration: 400,
    once: true,
  });

initBoidsScene();
initSummitScene();


  // Navbar and intro scroll logic
  const navpos = $('#navbar').offset();
  $(window).on('scroll', () => {
    if ($(window).scrollTop() > navpos.top) {
      $('#navbar').addClass('fadein').removeClass('fadeout');
      $('#intro').addClass('introout').removeClass('introin');
    } else {
      $('#navbar').removeClass('fadein').addClass('fadeout');
      $('#intro').removeClass('introout').addClass('introin');
    }
  });
});


$(document).ready(function() {
  var navpos = $('#navbar').offset();
  console.log(navpos.top);
    $(window).bind('scroll', function() {
      if ($(window).scrollTop() > 100) {

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

    $('.square').click(function(){

            var index = $(this).index();
            var size = $('.square').length;
            console.log(index);
            console.log(size);
            
             $('.popup-square__container').addClass('popup__display');
             $('.popup-square').addClass('popup__opacity');
             $('.popup-square--long').addClass('popup__opacity');

              var  $tb = $(this).position().top;
              var $posSquare = $(this).position().top;

              // if ($posSquare == $('.square:last-child').position().top) {
              //   $tb = $( '.square:last-child').position().top - $( '.square:last-child').outerHeight(true) - 20;
              // } 
             


             $('.popup-square__wrapper').css("top", $tb);

             $('.popup-cover').addClass('cover__opacity');

            if ($(this).is(":last-child, :nth-last-child(2), :nth-last-child(3)")) {
                  $('.popup-square__wrapper').css("top", "inherit");
                  $('.popup-square__wrapper').css("bottom", "0px");
             }




  });

            function closePopup(){
              $('.popup-square__container').removeClass('popup__display');
              $('.popup-square').removeClass('popup__opacity');
              $('.popup-square--long').removeClass('popup__opacity');
              $('.popup-cover').removeClass('cover__opacity')
            }

        $('.popup__close').click(function(){
             closePopup();
         });

        $('.popup-cover').click(function(){
             closePopup();
         });


});

