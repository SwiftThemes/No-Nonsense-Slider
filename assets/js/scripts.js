jQuery(document).ready(function($) {
  $(".srs-slider").each(function() {
    // return;
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

    var self = this;

    var timeout = delay / 2 < 2500 ? delay / 2 : 2500;
    setTimeout(function() {
      $(self)
        .find("img.srsImgNotLoaded")
        .each(function(el) {
          $(this).removeClass("srsImgNotLoaded");
          var src = $(this).data("src");
          var srcset = $(this).data("srcset");
          if (src) {
            $(this).attr("src", src);
          }
          if (srcset) {
            $(this).attr("srcset", srcset);
          }
        });
    }, timeout);
  });
});
