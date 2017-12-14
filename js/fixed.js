var basicTimeline = anime.timeline({
  autoplay:false
});

var Hgrade = new Array(8.25,8.2,7.5,7.23,6.31);
for(i=0;i<Hgrade.length;i++){
  // Hgrade[i] = 1520-Hgrade[i]*Hgrade[i]*Hgrade[i];
  Hgrade[i] = 1170-Hgrade[i]*Hgrade[i]*2;
}

basicTimeline
  .add({
    targets: '#fixed #mj',
    translateX: -440,
    translateY: Hgrade[1],
    scale:7.9,
    rotate:"1turn",
    //easing: 'easeOutExpo',
    offset:800,
    backgroundColor:"#ff6d6e",

    backgroundImage:"url('../img/fmj.png')"
  })
  .add({
    targets: '#fixed #rj',
    translateX: -220,
    translateY: Hgrade[2]-20,
    scale:6.8,
    rotate:"1turn",
    //easing: 'easeOutExpo',
    offset:800,
    backgroundColor:"#33b9d6",
  })
  .add({
    targets: '#fixed #yj',
    // translateX: -400,
    translateY: Hgrade[0]-40,
    scale:8,
    rotate:"2turn",
    //easing: 'easeOutExpo',
    offset:800,
    backgroundColor:"#9b4454",

  })
  .add({
    targets: '#fixed #gcj',
    translateX: 220,
    translateY: Hgrade[4]+40,
    scale:5,
    rotate:"1turn",
    //easing: 'easeOutExpo',
    offset:800,
    backgroundColor:"#ffa88a",
  })
  .add({
    targets: '#fixed #hj',
    translateX: 440,
    translateY: Hgrade[3],
    scale:6.4,
    rotate:"1turn",
    //easing: 'easeOutExpo',
    offset:800,
    backgroundColor:"#927ce0",
  })
  ;

$("#explore").click(function(){
  $('html, body').animate({
          scrollTop: $("#first").offset().top
        }, 1000
  );
});

document.querySelector('#fixed #explore').onclick = basicTimeline.play;
// document.querySelector('#fixed .pause').onclick = basicTimeline.pause;


