// 마우스 이벤트 생성
var $on = document.addEventListener.bind(document);
var xmouse, ymouse;
$on('mousemove', function (e) {
  xmouse = e.clientX || e.pageX;
  ymouse = e.clientY || e.pageY;
});

// 여기에서 원하는대로 조절!!!!
var user = {
  limit:1.2,    // 반지름의 120% 영역에서부터 끌림
  view:[2.5,0.1],
};

var moons = [];
var dddd;

fetch('data/planet_data.json')
  .then(bejson=>bejson.json())
  .then(data=>{
    // 달 생성
    for (var i=0; i<data.length; i++) {
      moons.push(new Mkmoons(i, data[i][1]*browser_width/10, browser_height/2, data[i][2]/1000, user.limit, data[i][0]));
    }
  });


var followMouse = function followMouse() {
  this.location.key = requestAnimationFrame(followMouse);
  moons.forEach(Element => mvmoon(Element, user.view, user.speed));
};