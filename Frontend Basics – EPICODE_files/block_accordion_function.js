
 jQuery(document).ready(function($) {

  $('.accordion-block > ul > li:has(ul)').addClass("has-sub");

  $('.accordion-block > ul > li > a').click(function() {
  var $accordion = $(this);
  var checkElement = $(this).next();

  $accordion.find('li').removeClass('active');
  $accordion.closest('li').addClass('active');

  if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
    //console.log('disattivo ');
    $accordion.closest('li').removeClass('active');
    checkElement.slideUp('normal');
  }

  if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
    //console.log('attivo ');
    $accordion.find('ul ul:visible').slideUp('normal');
    checkElement.slideDown('normal');
  } 

  if (checkElement.is('ul')) {
    return false;
  } else {
    return true;
  }
  
});

});