var readyStateCheckInterval = setInterval(function () {

  // Start script once loading has been completed
  if ($('[id^=topnews_main_stream]').length) {
    clearInterval(readyStateCheckInterval)
    console.log('Boom')

    $('#content').on('DOMNodeInserted', function () {
      if (!window.justRefreshed) {
        console.log('New stories')
        window.justRefreshed = true
        setTimeout(function () {
          window.justRefreshed = false
        }, 500)
        checkNewElements()
      }
    })

    $('.jewelButton').click(function bindClick () {
      $('#filter-close-screen').click()
    })

    createButton()
    createControlScreen()
    removeFilteredWords()
  }

  function checkNewElements () {
    if ($('.hidden_elem').length) {
      removeFilteredWords()
    }
  }

  function createButton () {
    var $sample = $('#blueBarNAXAnchor ._2pdh').first()
    var classes = $sample.attr('class')
    var link_classes = $sample.find('a').attr('class')
    var $control = $('<li>').addClass(classes).append('<a>')
    var $control_btn = $control.find('a').addClass(link_classes).attr('id', 'filter-btn').append('Filter')
    $sample.after($control)

    $control_btn.click(function () { $('#filter-screen').toggle() })
  }

  function createControlScreen () {
    $('#blueBarNAXAnchor').append('<div id=\'filter-screen\'></div>')
    var left = $('#filter-btn').offset().left - 275
    var $screen = $('#filter-screen').css('left', left + 'px')
    $screen.append('<a id=\'filter-close-screen\'>&times;</a>')
    $('#filter-close-screen').click(function () { $('#filter-screen').toggle(false) })

    $screen.append('<label>Enter words to filter. Comma separated.</label><br />')
    $screen.append('<textarea id=\'filter-text\'>' + ($.cookie('filter_text_ext') || '') + '</textarea>')
    $screen.append('<label id=\'filter-count\'></label>')
    $screen.append('<a id=\'filter-save\' class=\'_42ft _4jy0 _11b _4jy3 _4jy1 selected _51sy\'>Save</a>')
    $screen.append('<label id=\'filter-status\'></label>')
    bindCookieSaving()
  }

  function bindCookieSaving () {
    var $save_btn = $('#filter-save')
    var $filter_text = $('#filter-text')
    $save_btn.click(function () {
      $('#filter-status').show().html('Saving..')
      $.cookie('filter_text_ext', $filter_text[0].value)
      $('#filter-status').html('Saved.')
      $('#filter-status').delay(1500).fadeOut()
      removeFilteredWords()
    })
  }

  function removeFilteredWords () {
    var i = 0
    $('._filtered').removeClass('_filtered')
    var $words = $.grep(($.cookie('filter_text_ext') || '').split(','), function (val) { return val !== '' })
    if ($words.length > 0) {
      $.each($words, function (_, w) {
        var reg = new RegExp($.trim(w), 'gi')
        $('[id^=hyperfeed_story]').each(function (_, story) {
          if ($(story).find('.userContentWrapper').text().match(reg)) {
            $(story).addClass('_filtered')
            i++
          }
        })
      })
    }
    $('#filter-count').html(i)
  }
}, 100)
