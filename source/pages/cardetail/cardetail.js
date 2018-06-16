// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { CarApi } from "../../apis/car.api.js";
import { WechatApi } from "../../apis/wechat.api.js";
import { MemberApi } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    options.id = 1;
    super.onLoad(options);
    this.Base.setMyData({ currenttab: 0 });
  }
  onMyShow() {
    var that = this;
    var api = new CarApi();
    api.info({ id: this.Base.options.id }, (info) => {
      that.Base.setMyData({ info, faved: info.faved });
      api.modelinfo({ id: info.automodel_id }, (modelinfo) => {
        that.Base.setMyData({ modelinfo });
      });
      api.photolist({ car_id: info.id }, (photolist) => {
        that.Base.setMyData({ photolist });
      });
    });
    var memberapi = new MemberApi();
    memberapi.info({}, (memberinfo) => {
      this.Base.setMyData({ memberinfo });
    });
  }

  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.detail.current });
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.currentTarget.id });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow; 
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
Page(body)