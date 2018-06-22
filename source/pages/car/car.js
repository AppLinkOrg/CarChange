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
    //options.id=1;
    super.onLoad(options);
    this.Base.setMyData({ noticesuccess:false});
  }

  onMyShow() {
    var that = this;
    var api = new CarApi();
    api.info({id:this.Base.options.id},(info)=>{
      that.Base.setMyData({info,faved:info.faved});
      api.modelinfo({id:info.automodel_id},(modelinfo)=>{
        var shengprice = parseFloat(modelinfo.totalprice) - parseFloat(info.price); 
        shengprice=shengprice.toFixed(2);
        that.Base.setMyData({ modelinfo: modelinfo, shengprice: shengprice });
      });
      api.photolist({ car_id: info.id }, (photolist) => {
        that.Base.setMyData({ photolist });
      });
    }); 
    var memberapi = new MemberApi();
    memberapi.info({},(memberinfo)=>{
      this.Base.setMyData({ memberinfo});
    });
  }
  gotoDetail(){
    wx.navigateTo({
      url: '/pages/cardetail/cardetail?id='+this.Base.options.id,
    })
  }
  getPhoneNo(e){
    var that=this;
    console.log(e);
    var api = new WechatApi();
    api.decrypteddata(e.detail,(ret)=>{
      console.log(ret);
      var memberapi = new MemberApi();
      memberapi.bindmobile({ mobile: ret.return.phoneNumber},(aa)=>{
        var memberinfo=that.Base.getMyData().memberinfo;
        memberinfo.mobile = ret.return.phoneNumber;
        that.Base.setMyData({ memberinfo: memberinfo });
        that.updateToTrack();
      });
    });
  }
  queryCar(e){
    var that=this;
    var memberinfo = that.Base.getMyData().memberinfo;
    if(memberinfo.mobile.length==11){
      this.updateToTrack();
    }
  }
  updateToTrack(){
    var api = new CarApi();
    api.query({car_id:this.Base.options.id},()=>{

      this.Base.setMyData({ noticesuccess: true });
    });
  }
  closenotice() {
    this.Base.setMyData({ noticesuccess: false });
  }
  fav() {
    var that = this;
    var api = new CarApi();
    api.fav({ car_id: this.Base.options.id }, (ret) => {

      that.Base.setMyData({ faved: ret.return });
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.gotoDetail = content.gotoDetail; 
body.getPhoneNo = content.getPhoneNo;
body.queryCar = content.queryCar; 
body.updateToTrack = content.updateToTrack;
body.closenotice = content.closenotice;
body.fav = content.fav;
Page(body)