jQuery(document).ready(function($) {
  $(".srs-slider").each(function() {
    var delay = $(this).data("speed");
    var slider = $(this).unslider({
      autoplay: true,
      delay: delay,
      infinite: true,
      arrows: {
        //  Unslider default behaviour
        prev:
          '<span class="unslider-arrow prev  he-chevron-circle-left"></span>',
        next:
          '<span class="unslider-arrow next  he-chevron-circle-right"></span>'
      }
    });
    slider
      .on("mouseover", function() {
        slider.unslider("stop");
      })
      .on("mouseout", function() {
        slider.unslider("start");
      });
  });
});
