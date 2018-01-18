window.onload = function(){

  var bar = $('#bar')
  var swipearea = $('#swipearea')
  var verticalLayout = $('#vertical-layout')
  var horizontalLayout = $('#horizontal-layout')
  var horizontalHeader = $('#horizontal-header')
  var roadmapImage = $('#roadmap-image')

  //initialize in portrait mode
  horizontalLayout.hide()
  horizontalHeader.hide()
  roadmapImage.hide()

  $( window ).on( "orientationchange", function( event ) {
    if (event.orientation == 'landscape') {
      verticalLayout.hide()
      horizontalLayout.show()
      horizontalHeader.show()
      $("html, body").animate({
        scrollTop: 800
      }, 600);
      }
    if (event.orientation == 'portrait') {
      verticalLayout.show()
      horizontalLayout.hide()
      horizontalHeader.hide()
      roadmapImage.hide()
    }
  });

  var deltas = [1,2,3,4,5,6,7, 8]

  var activeIndex = 0

  var viewportWidth = $(window).width();

  console.log(viewportWidth);

  deltaBoxWidth = 164

  var leaveCurrent = function() {
    jObjectsArray[activeIndex].parent().removeClass("active");
  }

  var viewDelta = function(object) {
    console.log(object.data.value);
    deltabox = $(this).parent();
    deltabox.addClass("active")
    activeIndex = object.data.index
    jObjectsArray[activeIndex].removeClass("unread")
    jObjectsArray[activeIndex].parent().addClass("active");
  }

  var clickViewDelta = function(object) {
    $(this).removeClass("unread");
    jObjectsArray[activeIndex].parent().removeClass("active")


    deltabox = $(this).parent();
    deltabox.addClass("active");
    deltabox.addClass("active");
    activeIndex = object.data.index
    viewDelta(object)
    scrollToActiveDelta();
  }

  var jObjectsArray = []

//THIS IS FOR THE VERTICAL VIEW
  _.forEach(deltas, function(value, index){
    var deltabox = $('<div>');
    var delta = $('<div>');
    var inner = $('<div>');
    deltabox.addClass("deltabox")
    delta.addClass("delta unread")
    inner.addClass("inner")
    deltabox.append(delta)
    delta.append(inner);
    inner.html(`${value}`);
    jObjectsArray.push(delta);
    delta.click({value: value, index: index},clickViewDelta)
    // delta.draggable();
    bar.append(deltabox);
  })

//THIS IS FOR THE HORIZONTAL VIEW
  _.forEach(deltas, function(value, index){
    var timelineRow = $('<div>');
    var timelineRowDelta = $('<div>');
    var innerHorizontal = $('<div>');
    var timelineRowDuration = $('<div>');
    var timelineRowDurationItem = $('<div>');
    timelineRow.addClass("timeline-row")
    timelineRowDelta.addClass("timeline-row-delta")
    innerHorizontal.addClass("inner-horizontal")
    innerHorizontal.html(`${value}`);
    innerHorizontal.draggable({
      start: function(event,ui) {
        console.log(value);
        horizontalLayout.hide()
        roadmapImage.show()
      },
      revert: function(event,ui) {
        $(this).data("uiDraggable").originalPosition = {
          top: 0,
          left: 0
        };
        console.log('we let go')
        verticalLayout.show()
        horizontalLayout.hide()
        horizontalHeader.hide()
        roadmapImage.hide()
        verticalLayout.hide()
        horizontalLayout.show()
        horizontalHeader.show()
        $("html, body").animate({
          scrollTop: 800
        }, 600);
        return !event;
      }
    });
    timelineRowDuration.addClass("timeline-row-duration")
    timelineRowDurationItem.addClass("timeline-row-duration-item")
    timelineRow.append(timelineRowDelta)
    timelineRowDelta.append(innerHorizontal)
    timelineRow.append(timelineRowDuration)
    timelineRowDuration.append(timelineRowDurationItem)
    horizontalLayout.append(timelineRow)

    //randomize lengths of duration
    randoStartDate = Math.floor(Math.random() * 70) + 10
    randoDuration = Math.floor(Math.random() * 600) + 100
    timelineRowDurationItem.css({
      "margin-left": randoStartDate,
      "width": randoDuration
    })
  })


  var swipedleft = function(){
    leaveCurrent()
    if (activeIndex < jObjectsArray.length - 1) {
      activeIndex++
      leftSwipeAnimation()
    }
    viewDelta({data: {index: activeIndex}})
    scrollToActiveDelta();
  }

  var leftSwipeAnimation = function() {
    $('#rightCard').animate({
        left: '50%',
    }, {
      duration: 500 ,
      complete: function(){
        $('#rightCard').css({
          left: '150%',
        });
      }});
    $('#swipearea').animate({
        left: '-150%',
    }, {
      duration: 500 ,
      complete: function() {
        $('#swipearea').css({
          left: '50%',
        });
      }});
  }

  var swipedright = function(){
    leaveCurrent()
    if (activeIndex > 0) {
      activeIndex--
      rightSwipeAnimation()
    }
    console.log(activeIndex);
    viewDelta({data: {index: activeIndex}})
    scrollToActiveDelta();
  }

  var rightSwipeAnimation = function() {
    $('#leftCard').animate({
        left: '50%',
    }, {
      duration: 500 ,
      complete: function(){
        $('#leftCard').css({
          left: '-150%',
        });
      }});
    $('#swipearea').animate({
        left: '150%',
    }, {
      duration: 500 ,
      complete: function() {
        $('#swipearea').css({
          left: '50%',
        });
      }});
  }

  var scrollToActiveDelta = function() {
    var half = viewportWidth/2

    //this finds if it should be scrolled at all (not for first deltas)
    if (activeIndex * deltaBoxWidth +deltaBoxWidth/2 <= half) {
      amountToScroll = 0
    }
    //this find the scroll position of every delta to be in the middle (so sick)
    if (activeIndex * deltaBoxWidth +deltaBoxWidth/2 > half) {
      amountToScroll = (activeIndex * deltaBoxWidth + deltaBoxWidth/2) - half
    }
    bar.animate({
      scrollLeft: amountToScroll
    }, 600);
  }

  //to initialize you are looking at the first Delta
  viewDelta({data: {index: activeIndex}});

  swipearea.on("swiperight",swipedright)
  swipearea.on("swipeleft",swipedleft)
}
