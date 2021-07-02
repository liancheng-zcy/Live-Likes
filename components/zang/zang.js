const Zang = require("./zangCreator");
const { icon } = require("./hearts");
let timer = null;
Component({
  properties: {
    width: {
      type: Number,
      value: 80
    },
    height: {
      type: Number,
      value: 80
    }
  },

  data: {
    zang: '',
    icon: icon,
  },
  lifetimes: {
    attached: function() {
      this.init()
      timer = setInterval(() => {
        this.click()
      }, 300)
    },
    detached() {
      clearInterval(timer)
    }
  },
  methods: {
    init() {
      if (!this.data.zang) {
        this.data.zang = new Zang(this);
      };
    },
    click() {
      this.data.zang.handleZang();
    },
  }
})



