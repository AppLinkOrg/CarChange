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
    var indexbrand = this.Base.getMyData().indexbrand;
    console.log(indexbrand);
    var brand=null;
    for (var i = 0; i < indexbrand.length;i++){
      if (indexbrand[i].brand_id==id){
        brand=indexbrand[i];
        break;
      }
    }
    if(brand!=null){
      brand.id = brand.brand_id;
      brand.name = brand.brand_name;
    }
    AppBase.CarSearchData={brand_id:id,brand:brand};
    wx.switchTab({
      url: '/pages/carsearch/carsearch',
    })
  }
  switchPrice(e) {
    var idx = e.currentTarget.id;
    console.log(idx);
    var priceoptions = this.Base.getMyData().priceoptions;
    console.log(priceoptions);
    var currentpriceoption = priceoptions[idx];
    AppBase.CarSearchData = { currentpriceoption: currentpriceoption };
    wx.switchTab({
      url: '/pages/carsearch/carsearch',
    })
  }
  switchSize(e){
    var id = e.currentTarget.id;
    var sizelist = this.Base.getMyData().sizelist;
    console.log(sizelist);
    var size = null;
    for (var i = 0; i < sizelist.length; i++) {
      if (sizelist[i].id == id) {
        size = sizelist[i];
        break;
      }
    }
    AppBase.CarSearchData = { size_id: id, size: size };
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
body.switchPrice = content.switchPrice;
body.switchSize = content.switchSize;
Page(body)