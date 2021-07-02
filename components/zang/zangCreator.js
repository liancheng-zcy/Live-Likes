
const { heart1, heart2, heart3, heart4, heart5, heart6, heart7, heart8, heart9 } = require("./hearts");
module.exports = class Zang {
  that = {}
  count = 0
  zangCanvas = ''
  movingList = []
  timer = ''
  dpr = ''
  delayTimer = ''
  canvasPara = {}
  zang_option = [{
    url: heart1,
  },{
    url: heart2,
  },{
    url: heart3,
  },{
    url: heart4,
  },{
    url: heart5,
  },{
    url: heart6,
  },{
    url: heart7,
  },{
    url: heart8,
  },{
    url: heart9,
  },]

  constructor(that){
    this.that = that;
    this.getCanvas(that);
  }
// 获取canvas
  getCanvas(that) {
    that.createSelectorQuery()
    .select('#zangCanvas')
    .fields({
      node: true,
      size: true,
    })
    .exec(this.initCanvas.bind(this));
  }
 //  初始化canvas
  initCanvas(res) {
    if (!res || !res[0] || !res[0].node) return;
    const width = res[0].width;
    const height = res[0].height;

    const canvas = res[0].node;
    if(!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if(!ctx || !ctx.scale) return;
    this.ctx = ctx;
    this.zangCanvas = res[0].node;

    const dpr = wx.getSystemInfoSync().pixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    this.dpr = dpr;
    
    const min = -0.8 * width
    const max = 0.8 * width
    var k = max - min;
    this.zang_option.forEach( (item,i) => {
      const img = canvas.createImage();
      if (typeof img === 'object') {
        img.onload = () => {
          item._img = img
        };
        img.src = item.url;
        item.position = {};
        item.position.p0 = [width-15,height]
        item.position.p1 = [min+k/8*i,2*height/3]
        item.position.p2 = [width-k/8*i,1*height/3]
        item.position.p3 = [width/2,-50]
      }
    })
  }

  renderCanvas() {
    if(!this.ctx || !this.movingList || !this.zangCanvas) return 
    // console.log(this.count++);
    this.timer = '';
    // console.log('this.zangCanvas.width',this.zangCanvas.width);
    this.ctx.clearRect(0, 0, this.zangCanvas.width/2, this.zangCanvas.height/2);
    for (var i=0;i<this.movingList.length;i++) {
      var item = this.movingList[i];
      (()=>{
        if( item.t > 1 ) return
        const _img = this.zang_option[item.opt]._img
        const p = this.zang_option[item.opt].position
        const t = item.t+=item.speed;
        const cx = 3 * ( p.p1[0] - (p.p0[0]) )
        const bx = 3 * ( p.p2[0] - p.p1[0] ) - cx
        const ax = p.p3[0] - (p.p0[0]) - cx - bx
        const cy = 3 * ( p.p1[1] - (p.p0[1]) )  
        const by = 3 * ( p.p2[1] - p.p1[1] ) - cy
        const ay = p.p3[1] - (p.p0[1]) - cy - by
        const x = ax * (t*t*t) + bx * (t*t) + cx * t + (p.p0[0])
        const y = ay * (t*t*t) + by * (t*t) + cy * t + p.p0[1]
        if (item.width < this.zangCanvas.width/(5 * this.dpr)) {
          item.width += 0.9;
          item.height += 0.9;
        }
        this.ctx.restore();
        if (item.t > 0.4 && item.opacity > 0.05) {
          item.opacity -= 0.02;
          this.ctx.globalAlpha = item.opacity;
        } else if (item.opacity <= 0.05) {
          this.ctx.globalAlpha = 0;
        } else {
          this.ctx.globalAlpha = 1;
        };
        this.ctx.drawImage(_img, x, y, item.width, item.height);
        this.ctx.save();
      })();
    }
    // this.ctx.restore();
    if(this.movingList.length && this.movingList[this.movingList.length-1].t < 1) {
      this.timer = this.zangCanvas.requestAnimationFrame(this.renderCanvas.bind(this));
    }
  }

  // 点赞触发方法
  handleZang() {
    if (!this.zangCanvas) return; 
    if (this.delayTimer) clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(()=>{
      const obj1 = {
        width: 0,
        height: 0,
        t: 0,
        speed: 0.01,
        opt: Math.floor(Math.random()*9),
        opacity: 1,
      };
      const obj2 = {
        width: 0,
        height: 0,
        t: 0,
        speed: 0.007,
        opt: Math.floor(Math.random()*9),
        opacity: 1,
      };
      this.movingList.push(obj1,obj2);
      if(this.movingList.length > 50) {
        this.movingList = this.movingList.slice(20);
      };
      if (!this.timer) {
        this.timer = this.zangCanvas.requestAnimationFrame(this.renderCanvas.bind(this));
      };
    },0)
  }
}


