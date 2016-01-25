  // SC.initialize({
  //   client_id: '7ced8b6711d35bd5bb609bbe18746d56'
  // });

  // // find all sounds of buskers licensed under 'creative commons share alike'
  // SC.get('/tracks', {
  //   q: 'buskers', license: 'cc-by-sa'
  // }).then(function(tracks) {
  //   console.log(tracks);
  // });


$(document).ready(function(){

$(document).on('submit', function(e){
  e.preventDefault();
  function search() {
      var selector = $("input[name]").val();
      return selector;
  };
  document.getElementById('terms').src = "//w.soundcloud.com/player/?url=//soundcloud.com/" + search();
  // setInfo();


  var player = SC.Widget($('iframe.sc-widget')[0]);
  var pOffset = $('.player').offset();
  var pWidth = $('.player').width();
  var scrub;

  player.bind(SC.Widget.Events.READY, function() {
    setInfo();
    player.play();
  }); //Set info on load

  player.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
    if( e.relativePosition < 0.003 ) { setInfo(); }
    //Event listener when track is playing
    $('.position').css('width', ( e.relativePosition*100)+"%");
  });

   $('.player').mousemove(function(e){ //Get position of mouse for scrubbing
    scrub = (e.pageX-pOffset.left);
  });

  $(document).on('keydown', function(e){
    switch(e.keyCode){
      case 32:
        player.toggle();
        setInfo();
      break;
      case 39:
        player.next();
        setInfo();
      break;
      case 37:
        player.prev();
        setInfo();
      break;
    }
  });

  $('.player').click(function(){ //Use the position to seek when clicked
    $('.position').css('width',scrub+"px");
    var seek = player.duration*(scrub/pWidth);

    //Seeking to the start would be a previous?
    if ( seek < player.duration * .05 ) {
      player.prev();
    } else if ( seek > player.duration * .99 ) {
      player.next();
    } else {
      player.seekTo(seek);
    }

  });

   function setInfo() {
    player.getCurrentSound(function(song) {
      console.log(song);

      $('.waveform').css('background-image', "url('" + song.waveform_url + "')");
      $('.player').css('background-image', "url('" + song.artwork_url.replace('-large', '-t500x500') + "')");

      var info = song.title;
      $('.info').html(info);

      player.current = song;
    });

    player.getDuration(function(value){
      player.duration = value;
    });

    player.isPaused(function(bool){
      player.getPaused = bool;
    });
  }

});

});