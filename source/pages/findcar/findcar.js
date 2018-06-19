// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";
import { CarApi } from "../../apis/car.api.js";
import { WechatApi } from "../../apis/wechat.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({mobile:""});
  }
  onMyShow() {
    var that = this;

    var mobile=this.Base.getMyData().mobile;
    if(mobile==""){

      var memberapi = new MemberApi();
      memberapi.info({}, (memberinfo) => {
        this.Base.setMyData({ mobile: memberinfo.mobile });
      });
    }


  }

  getPhoneNo(e) {
    var that = this;
    console.log(e);
    var api = new WechatApi();
    api.decrypteddata(e.detail, (ret) => {
      console.log(ret);
      var memberapi = new MemberApi();
      memberapi.bindmobile({ mobile: ret.return.phoneNumber }, (aa) => {
        that.Base.setMyData({ mobile: ret.return.phoneNumber });
      });
    });
  }
  formSubmit(e){
    console.log(e);
    var automodel = e.detail.value.automodel;
    var mobile = e.detail.value.mobile;
    var price = e.detail.value.price;
    var arequire = e.detail.value.require;

    if(automodel==""){
      wx.showToast({
        title: "请输入意向车型",
        icon:"none"
      });
      return;
    }
    if (price == "") {
      wx.showToast({
        title: "请输入购车预算",
        icon: "none"
      });
      return;
    }
    if (mobile == "") {
      wx.showToast({
        title: "请输入手机号码",
        icon: "none"
      });
      return;
    }
    var carapi=new CarApi();
    carapi.find({ "automodel": automodel, 
      "price": price, 
      "require": arequire, 
      "mobile": mobile},(ret)=>{
        this.Base.setMyData({ noticesuccess:true});
      });
  }
  closenotice() {
    this.Base.setMyData({ noticesuccess: false });
    
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.getPhoneNo = content.getPhoneNo; 
body.onMyShow = content.onMyShow; 
body.formSubmit = content.formSubmit;
body.closenotice = content.closenotice;
Page(body)