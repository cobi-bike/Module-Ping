// Implementation of menu carousel
var carousel = (function(document, $) {
  'use strict';

  var $carousel = $('.carousel'),
    $list = $('#list'),
    $listItems = $('#list li'),
    $nItems = $listItems.length, // Total item count
    $nView = 3, // How many items should be displayed?
    $current = 0, // Current item
    _init = function() {
      _initWidth();
      _eventInit();
      COBI.app.textToSpeech.write({ content: _currentName($current), language: i18next.language });
    },
    // Set view of carousel menu
    _initWidth = function() {
      $list.css({
        'margin-left': Math.floor(100 / $nView) + '%',
        width: Math.floor(100 * ($nItems / $nView)) + '%'
      });
      $listItems.css('width', 100 / $nItems + '%');
      // Fade in carousel
      $carousel.delay(250).animate({ opacity: 1 }, { duration: 500 });
    },
    _eventInit = function() {
      //  replacements for setTimeout()/setInterval() that makes use of
      //  requestAnimationFrame() where possible for better performance
      window.requestAnimFrame = (function() {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(callback, element) {
            window.setTimeout(callback, 1000 / 60);
          }
        );
      })();

      window.requestInterval = function(fn, delay) {
        if (
          !window.requestAnimationFrame &&
          !window.webkitRequestAnimationFrame &&
          !window.mozRequestAnimationFrame &&
          !window.oRequestAnimationFrame &&
          !window.msRequestAnimationFrame
        )
          return window.setInterval(fn, delay);
        var start = new Date().getTime(),
          handle = new Object();

        function loop() {
          var current = new Date().getTime(),
            delta = current - start;
          if (delta >= delay) {
            fn.call();
            start = new Date().getTime();
          }
          handle.value = requestAnimFrame(loop);
        }
        handle.value = requestAnimFrame(loop);
        return handle;
      };

      window.clearRequestInterval = function(handle) {
        window.cancelAnimationFrame
          ? window.cancelAnimationFrame(handle.value)
          : window.webkitCancelRequestAnimationFrame
            ? window.webkitCancelRequestAnimationFrame(handle.value)
            : window.mozCancelRequestAnimationFrame
              ? window.mozCancelRequestAnimationFrame(handle.value)
              : window.oCancelRequestAnimationFrame
                ? window.oCancelRequestAnimationFrame(handle.value)
                : window.msCancelRequestAnimationFrame
                  ? msCancelRequestAnimationFrame(handle.value)
                  : clearInterval(handle);
      };

      // Hook on touch event of each coursel item
      $.each($listItems, function(i) {
        var $this = $(this);
        $this.on('touchstart click', function(e) {
          e.preventDefault();
          _stopMove(i);
          _moveIt($this, i);
        });
      });
    },
    // Move to right item
    _next = function() {
      if ($current >= $nItems - 1) {
        _moveTo(0);
      } else {
        _moveTo($current + 1);
      }
    },
    // Move to left item
    _prev = function() {
      if ($current <= 0) {
        _moveTo($nItems - 1);
      } else {
        _moveTo($current - 1);
      }
    },
    // Return current item id
    _current = function() {
      return $current;
    },
    // Slides to item
    _moveTo = function(x) {
      _moveIt($listItems.eq(x), x);
      // Announce new selected item
      COBI.app.textToSpeech.write({ content: _currentName(x), language: i18next.language });
    },
    // Returns heading of current item
    _currentName = function(x) {
      var experience = document.getElementById('experience');
      return experience.getElementsByTagName('h2')[x].innerText;
    },
    // Animate item movement
    _moveIt = function(obj, x) {
      var n = x;
      $current = n;

      obj.find('figure').addClass('active');
      $listItems
        .not(obj)
        .find('figure')
        .removeClass('active');

      $list.velocity(
        {
          translateX: Math.floor(-(100 / $nItems) * n) + '%',
          translateZ: 0
        },
        {
          duration: 600,
          easing: [0, 50],
          queue: false
        }
      );
    },
    // Cancel animation
    _stopMove = function(x) {
      _moveTo(x);
    };

  return {
    init: _init,
    move: _moveTo,
    next: _next,
    prev: _prev,
    current: _current,
    currentName: _currentName
  };
})(document, jQuery);
