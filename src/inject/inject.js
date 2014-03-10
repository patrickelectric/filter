chrome.extension.sendMessage({}, function(settings) {
  var readyStateCheckInterval = setInterval(function() {

    // Start script once loading has been completed
    if( $("#stream_pagelet").length ) {
      clearInterval(readyStateCheckInterval);
      console.log("Boom");

      function createButton () {
        $sample = $("#pageNav #navHome").first();
        classes = $sample.attr("class");
        link_classes = $sample.find("a").attr("class");
        $control = $("<li>").addClass(classes).append("<a>")
        $control_btn = $control.find("a").addClass(link_classes).attr("id", "filter-btn").append("Filter")
        $sample.after($control);

        $control_btn.click(function() { $("#filter-screen").toggle(); });
      }

      function createControlScreen () {
        $("#content").append("<div id=\"filter-screen\"></div>");
        right = $(document).width() - ($("#pageNav").offset().left + $("#pageNav").width()) - 1;
        $screen = $("#filter-screen").css("right", right + "px");
        $screen.append("<a id=\"filter-close-screen\">&times;</a>");
        $("#filter-close-screen").click(function() { $("#filter-screen").toggle(); });

        $screen.append("<label>Enter words to filter. Comma separated.</label><br />");
        $screen.append("<textarea id=\"filter-text\">" + ($.cookie("filter_text_ext")||"") + "</textarea>");
        classes = $("button[type=submit]").attr("class");
        $screen.append("<label id=\"filter-count\"></label>");
        $screen.append("<a id=\"filter-save\" class=\"_42ft _42fu _11b selected _42g-\">Save</a>");
        $screen.append("<label id=\"filter-status\"></label>");
        bindCookieSaving()
      }

      function bindCookieSaving () {
        $save_btn = $("#filter-save");
        $filter_text = $("#filter-text");
        $save_btn.click( function () {
          $("#filter-status").show().html("Saving..");
          $.cookie("filter_text_ext", $filter_text[0].value );
          $("#filter-status").html("Saved.");
          $("#filter-status").delay(1500).fadeOut();
          removeFilteredWords();
        })
      }

      function removeFilteredWords () {
        var i = 0
        $("._filtered").removeClass("_filtered");
        $words = $.grep( ($.cookie("filter_text_ext")||"").split(","), function(val) { return val != "" } );
        if ($words.length > 0) {
          $.each( $words, function (_, w) {
            var reg = new RegExp( $.trim(w) ,"gi");
            $("._5pcb .mbm").each(function(_, story) {
              if ( $(story).find(".userContentWrapper").text().match(reg) ) {
                $(story).addClass("_filtered");
                i++;
              }
            })
          });
        }
        $("#filter-count").html(i);
      }

      window.checkNewElements = function () {
        if ($(".hidden_elem").length) {
          removeFilteredWords();
        }
      }

      $("#content").on("DOMNodeInserted", function() {
        if(!window.justRefreshed) {
          console.log("New stories");
          window.justRefreshed = true;
          setTimeout( "window.justRefreshed = false", 2000);
        }
      })

      createButton();
      createControlScreen();
      removeFilteredWords();

    }
	}, 100);
});
