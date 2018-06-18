// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { CarApi } from "../../apis/car.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ currenttab: 0 });
  }
  onMyShow() {
    var that = this;
    var instapi=new InstApi();
    instapi.indexbanner({},(indexbanner)=>{
      that.Base.setMyData({ indexbanner: indexbanner});
    });
    instapi.info({}, (info) => {
      that.Base.setMyData(info);
    });
    instapi.aboutuslist({ inhome: "Y" }, (aboutuslist) => {
      that.Base.setMyData({ aboutuslist: aboutuslist });
    });
    instapi.newslist({ inhome: "Y" }, (newslist) => {
      that.Base.setMyData({ newslist: newslist });
    });
    instapi.servicelist({ }, (servicelist) => {
      that.Base.setMyData({ servicelist: servicelist });
    });
    instapi.productlist({ inhome: "Y" }, (productlist) => {
      that.Base.setMyData({ productlist: productlist });
    });

    var carapi = new CarApi();
    carapi.indexbrand({}, (indexbrand)=>{
      this.Base.setMyData({ indexbrand});
    });
    carapi.priceoptions({}, (priceoptions) => {
      this.Base.setMyData({ priceoptions });
    });
    carapi.sizelist({}, (sizelist) => {
      this.Base.setMyData({ sizelist });
    });

    carapi.list({ recomm: "Y" }, (recommlist) => {
      this.Base.setMyData({ recommlist });
    });
    carapi.list({ hotcar: "Y" }, (hotlist) => {
      this.Base.setMyData({ hotlist });
    });
  } 
  gotoSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }

  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.detail.current });
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.currentTarget.id });
  }
  switchBrand(e){
    var id=e.currentTarget.id;
    AppBase.CarSearchData={brand_id:id};
    wx.switchTab({
      url: '/pages/carsearch/carsearch',
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.gotoSearch = content.gotoSearch;
body.changeCurrentTab = content.changeCurrentTab; 
body.changeTab = content.changeTab;
body.switchBrand = content.switchBrand;
Page(body)