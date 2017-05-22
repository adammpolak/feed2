window.onload = function(){

  var bar = $('#bar')

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


  var swipedleft = function(){
    leaveCurrent()
    if (activeIndex < jObjectsArray.length - 1) {
      activeIndex++
    }
    viewDelta({data: {index: activeIndex}})
    scrollToActiveDelta();
  }

  var swipedright = function(){
    leaveCurrent()
    if (activeIndex > 0) {
      activeIndex--
    }
    console.log(activeIndex);
    viewDelta({data: {index: activeIndex}})
    scrollToActiveDelta();
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

  var swipearea = $('#swipearea')
  swipearea.on("swiperight",swipedright)
  swipearea.on("swipeleft",swipedleft)
}
