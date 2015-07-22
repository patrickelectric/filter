var readyStateCheckInterval = setInterval(function () {
  var mainStream = document.querySelector('[id^=topnews_main_stream]')

  // Start script once loading has been completed
  if (mainStream) {
    clearInterval(readyStateCheckInterval)

    document.getElementById('content').addEventListener('DOMNodeInserted', function () {
      if (!window.justRefreshed) {
        window.justRefreshed = true

        setTimeout(function () {
          window.justRefreshed = false
        }, 500)
        checkNewElements()
      }
    })

    Array.prototype.forEach.call(document.getElementsByClassName('jewelButton'), function(ele) {
      ele.onclick = function bindClick () {
        document.getElementById('filter-close-screen').click()
      }
    })

    createButton()
    createControlScreen()
    removeFilteredWords()
  }

  function checkNewElements () {
    if (document.getElementsByClassName('hidden_elem').length) {
      removeFilteredWords()
    }
  }

  function createButton () {
    var sampleButton = document.querySelector('#blueBarNAXAnchor ._2pdh')
    var sampleButtonClasses = sampleButton.className
    var linkClasses = sampleButton.getElementsByTagName('a')[0].className
    var control = document.createElement('li')
    control.className = sampleButtonClasses
    var controlLink = document.createElement('a')
    controlLink.className = linkClasses
    controlLink.id = 'filter-btn'
    controlLink.innerText = 'Filter'

    control.appendChild(controlLink)

    sampleButton.parentElement.insertBefore(control, sampleButton.nextSibling)

    controlLink.onclick = function () {
      var filterScreen = document.getElementById('filter-screen')
      filterScreen.style.display = filterScreen.style.display === 'block' ? 'none' : 'block'
    }
  }

  function createControlScreen () {
    var filterScreen = document.createElement('div')
    filterScreen.id = 'filter-screen'
    document.getElementById('blueBarNAXAnchor').appendChild(filterScreen)

    var left = document.getElementById('filter-btn').getBoundingClientRect().left - 275
    filterScreen.style.left = left + 'px'

    var closeButton = document.createElement('a')
    closeButton.id = 'filter-close-screen'
    closeButton.innerHTML = '&times;'

    filterScreen.appendChild(closeButton)
    closeButton.onclick = function () { filterScreen.style.display = 'none' }

    var textLabel = document.createElement('label')
    textLabel.innerHTML = 'Enter words to filter. Comma separated.'
    filterScreen.appendChild(textLabel)

    var textarea = document.createElement('textarea')
    textarea.id = 'filter-text'
    textarea.value = ($.cookie('filter_text_ext') || '')
    filterScreen.appendChild(textarea)

    var countLabel = document.createElement('label')
    countLabel.id = 'filter-count'
    filterScreen.appendChild(countLabel)

    var saveButton = document.createElement('a')
    saveButton.id = 'filter-save'
    saveButton.className = '_42ft _4jy0 _11b _4jy3 _4jy1 selected _51sy'
    saveButton.innerText = 'Save'
    filterScreen.appendChild(saveButton)

    saveButton.onclick = function () {
      $.cookie('filter_text_ext', textarea.value)
      statusLabel.innerText = 'Saved.'
      statusLabel.style.display = 'inline'

      setTimeout(function removeStatus (argument) {
        statusLabel.style.display = 'none'
      }, 1500)

      removeFilteredWords()
    }

    var statusLabel = document.createElement('label')
    statusLabel.id = 'filter-status'
    filterScreen.appendChild(statusLabel)
  }

  function removeFilteredWords () {
    var i = 0

    Array.prototype.forEach.call(document.getElementsByClassName('_filtered'), function(ele) {
      ele.classList.remove("_filtered")
    })

    var filterWords = ($.cookie('filter_text_ext') || '').split(',').filter(function (val) { return val !== '' })
    filterWords.forEach(function (w) {
      var reg = new RegExp(w.replace(/^\s+|\s+$/g, ''), 'gi')
      var stories = document.querySelectorAll('[id^=hyperfeed_story]')

      Array.prototype.forEach.call(stories, function(story) {
        if (story.innerText.match(reg)) {
          story.classList.add('_filtered')
          i++
        }
      })
    })

    document.getElementById('filter-count').innerText = i
  }
}, 100)
