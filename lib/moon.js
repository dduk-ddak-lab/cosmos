/* lim 정도도 scale 배율 곱해야함.. */


// SYNTAX
const $ = document.querySelectorAll.bind(document);
// 브라우저 높이, 폭
const browser_height = window.innerHeight;
const browser_width = window.innerWidth;
/* 기준 정하기  for sizing  # 화면의 가로가 큰지, 세로가 큰지!
  모든 행성은 criteria를 지름으로 하는 원 영역 내에 들어있다.   */
const criteria = browser_width>browser_height ? browser_width/2: browser_height/2;

// 초기값들
// 유저의 위치
var u_view=[browser_width/2,browser_height/2];
// 평행이동 변수
var delta = [0,0];
// 선택된 행성 ID 변수
var selected = '';

// 행성 클래스
class Mkmoons {
  constructor(_id,_xpos, _ypos, _factor, _lim, volume) {
    this.body = document.querySelectorAll('.planet')[_id];
    this.custom = {
      xmody : -0.9 * $('.planet')[_id].clientWidth / 2,
      ymody : -0.9 * $('.planet')[_id].clientHeight / 2,
      xpos : _xpos,
      ypos : _ypos,
      factor : _factor,
      lim : $('.planet')[_id].clientWidth * _lim/2,
      lim_save : _lim,
      radi : 0,
      volume:volume,
      scale: 0
    };
    this.location = {
      x : void 0,
      y : void 0,
      dx : void 0,
      dy : void 0,
      key : -1
    };
    // 클릭 이벤트!!
    this.body.addEventListener('click',()=>{
      let $x = this.custom.xpos;
      let $y = this.custom.ypos;
      selected = this.body.id;
      // 평행이동 변수
      delta = [$x-browser_width/2,$y-browser_height/2];
    });
  }
}

$('body')[0].addEventListener('keydown', function(event){
	if(event.key === "Escape"){
		selected = '';
	}
});

// 거리 함수
function radius(x, y) {
  return (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
}


function mvmoon(_moon, view_scale) {
  var _$_c = _moon.custom;
  var _$_l = _moon.location;
  // 무빙
  if (!_$_l.x || !_$_l.y) { // 초기설정
    _$_l.x = _$_c.xpos;
    _$_l.y = _$_c.ypos;
  } else {   // 살금살금 무빙
    let $x = _$_c.xpos-delta[0], $y = _$_c.ypos-delta[1];
    _$_c.radi = radius(xmouse - $x, ymouse - $y);
    // 태양 같은 애들은 마우스 못따라오도록!
    _$_c.lim = _$_c.lim > 150 ? 0 : _$_c.lim;
    _$_l.dx = _$_c.radi < _$_c.lim ? (xmouse - _$_l.x) : ($x - _$_l.x) * 2;
    _$_l.dx *= _$_c.factor;
    _$_l.x += _$_l.dx;
    _$_l.dy = _$_c.radi < _$_c.lim ? (ymouse - _$_l.y) : ($y - _$_l.y) * 2;
    _$_l.dy *= _$_c.factor;
    _$_l.y += _$_l.dy;
  }
  // 실제로 위치 프로퍼티에 대입
  _moon.body.style.left = _$_l.x + _$_c.xmody + 'px';
  _moon.body.style.top = _$_l.y + _$_c.ymody  + 'px';

  // 사이즈 조절
  _$_c.scale = view_scale[0]-(view_scale[0]-view_scale[1])*radius(_$_l.x-browser_width/2,_$_l.y-browser_height/2)/criteria;
  // 스케일 음수 & 0 제거
  _$_c.scale = _$_c.scale>0.1 ? _$_c.scale : 0.1;
  // 태양같은 애들은 사라질 수 있도록 0으로.
  _$_c.scale = _$_c.volume>5 && _$_c.scale === 0.1 ? 0 : _$_c.scale;
  // 선택된 행성 선별
  let draft_scale = 1;
  if (selected === '') {  // 아직 선택을 안했다면 그냥 1로~
  } else if (selected === _moon.body.id) {
    draft_scale = 2;  // 선택됐다면 2배로~
    _moon.body.style.zIndex = 1;
  } else {
    draft_scale = 0.5;  // 선택을 못 받았다면 0.2배로 ~
    _moon.body.style.zIndex = 'auto';
  }
  // 스케일이 너무 크면 수정
  draft_scale *= _$_c.scale*_$_c.volume;
  draft_scale = draft_scale > 5 ? 5 : draft_scale;
  _moon.body.style.transform = `scale(${draft_scale})`;

  // 거리 리미트 수정
  _$_c.lim = _moon.body.clientWidth/2*draft_scale;
}
