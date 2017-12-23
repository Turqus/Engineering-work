
    function tilt_direction(item) {
      var left_pos = item.position().left,
        move_handler = function (e) {
          if (e.pageX >= left_pos) {
            item.addClass("right");
            item.removeClass("left");
          } else {
            item.addClass("left");
            item.removeClass("right");
          }
          left_pos = e.pageX;
        };
      $("html").bind("mousemove", move_handler);
      item.data("move_handler", move_handler);
    }

    $(".portlet")
      .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
      .find(".portlet-header")
      .addClass("ui-widget-header ui-corner-all")
      .prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $(".portlet-toggle").click(function () {
      var icon = $(this);
      icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
      icon.closest(".portlet").find(".portlet-content").toggle();
    });
