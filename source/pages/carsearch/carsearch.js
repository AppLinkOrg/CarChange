// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { CarApi } from "../../apis/car.api.js";
import { MemberApi } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    var sorttype=[{name:"热门车源",orderby:" r_main.hotcar desc"},
      { name: "最新上架", orderby: " r_main.published_date desc" },
      { name: "价格最低", orderby: " r_main.price" },
      { name: "价格最高", orderby: " r_main.price desc" },
      { name: "里程最短", orderby: " r_main.milestone  desc" },
      { name: "车辆最短", orderby: " r_main.factory_date desc" }];
    this.Base.setMyData({
      sorttype, currentsorttype: sorttype[0], choosingSort: false, 
      priceoptions: [], currentpriceoption: { name: "价格不限" }, choosingPrice: false, 
    inviewing: false, 
    brandmodel: [], brand_id: 0, choosingBrand: false,
    sizelist: [], size_id: 0, choosingSize: false});

    
  }
  onMyShow() {
    var that = this;

    if (AppBase.CarSearchData!=null){
      this.Base.setMyData(AppBase.CarSearchData);
      AppBase.CarSearchData = null;
    }

    this.loaddata();
    var memberapi = new MemberApi();
    memberapi.info({}, (memberinfo) => {
      this.Base.setMyData({ memberinfo });
    });

    //var brandmodel = this.Base.getMyData().brandmodel;
    //if(brandmodel.length==0)
    {

      var carapi = new CarApi();
      carapi.brandmodel({}, (brandmodel) => {
        this.Base.setMyData({ brandmodel });
      });
      carapi.priceoptions({}, (priceoptions) => {
        var ret=[];
        ret.push({ name: "价格不限", min: 0, max: 0 });
        for(var i=0;i<priceoptions.length;i++){
          ret.push(priceoptions[i]);
        }
        
        this.Base.setMyData({ priceoptions: ret });
      });
      carapi.sizelist({}, (sizelist) => {
        this.Base.setMyData({ sizelist });
      });
    }
  }

  loaddata(){

    var currentsorttype = this.Base.getMyData().currentsorttype;
    var brand_id = this.Base.getMyData().brand_id;
    var currentpriceoption = this.Base.getMyData().currentpriceoption;
    var size_id = this.Base.getMyData().size_id;
    var carapi = new CarApi();
    carapi.list({ orderby: currentsorttype.orderby, brand_id: brand_id, maxprice: currentpriceoption.max, minprice: currentpriceoption.min, carsize_id: size_id }, (list) => {
      this.Base.setMyData({ list });
    });
  }

  getPhoneNo(e) {
    var that = this;
    console.log(e);
    var api = new WechatApi();
    api.decrypteddata(e.detail, (ret) => {
      console.log(ret);
      var memberapi = new MemberApi();
      memberapi.bindmobile({ mobile: ret.return.phoneNumber }, (aa) => {
        var memberinfo = that.Base.getMyData().memberinfo;
        memberinfo.mobile = ret.return.phoneNumber;
        that.Base.setMyData({ memberinfo: memberinfo });
        that.updateToTrack();
      });
    });
  }
  queryCar(e) {
    wx.switchTab({
      url: '/pages/findcar/findcar',
    })
  }
  updateToTrack() {
    var api = new CarApi();
    api.query({ car_id: 0 }, () => {

      this.Base.setMyData({ noticesuccess: true });
    });
  }
  closenotice() {
    this.Base.setMyData({ noticesuccess: false });
  }
  chooseSort() {
    this.Base.setMyData({ choosingSort: true, choosingBrand: false, choosingPrice: false, choosingSize: false });
  }
  changeSort(e){
    var idx=e.currentTarget.id;
    var sorttype=this.Base.getMyData().sorttype;
    this.Base.setMyData({ currentsorttype: sorttype[idx], choosingSort: false });
    this.loaddata();
  }
  choosePrice() {
    this.Base.setMyData({ choosingPrice: true, choosingBrand: false, choosingSort: false, choosingSize: false});
  }
  changePrice(e) {
    var idx = e.currentTarget.id;
    var priceoptions = this.Base.getMyData().priceoptions;
    this.Base.setMyData({ currentpriceoption: priceoptions[idx], choosingPrice: false });
    this.loaddata();
  }
  chooseBrand() {
    this.Base.setMyData({ choosingBrand: true, choosingSort: false, choosingPrice: false, choosingSize: false });
  }
  changeBrand(e) {
    var idx = e.currentTarget.id;
    var brandmodel = this.Base.getMyData().brandmodel;
    var brand=null;
    for(var i=0;i<brandmodel.length;i++){
      if(brandmodel[i].id==idx){
        brand=brandmodel[i];
      }
    }
    this.Base.setMyData({ brand_id: idx, choosingBrand: false, brand: brand });
    this.loaddata();
  }
  chooseSize() {
    this.Base.setMyData({choosingSize:true, choosingBrand: false, choosingSort: false, choosingPrice: false });
  }
  changeSize(e) {
    var idx = e.currentTarget.id;
    var sizelist = this.Base.getMyData().sizelist;
    var size = null;
    for (var i = 0; i < sizelist.length; i++) {
      if (sizelist[i].id == idx) {
        size = sizelist[i];
      }
    }
    this.Base.setMyData({ size_id: idx, choosingSize: false, size: size });
    this.loaddata();
  }
  scrolltoupper(e){
    console.log(e);
    this.Base.setMyData({ inviewing: false });
  }
  scrolltolower(e){
    console.log(e);
    this.Base.setMyData({ inviewing:true });
  }
  gotoSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
  closeSort(){

    this.Base.setMyData({ choosingBrand: false, choosingSort: false, choosingPrice:false,choosingSize:false });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getPhoneNo = content.getPhoneNo;
body.queryCar = content.queryCar;
body.updateToTrack = content.updateToTrack; 
body.closenotice = content.closenotice;
body.chooseSort = content.chooseSort;
body.changeSort = content.changeSort;
body.choosePrice = content.choosePrice;
body.changePrice = content.changePrice;
body.chooseBrand = content.chooseBrand;
body.changeBrand = content.changeBrand;
body.chooseSize = content.chooseSize;
body.changeSize = content.changeSize;
body.loaddata = content.loaddata; 
body.scrolltoupper = content.scrolltoupper; 
body.scrolltolower = content.scrolltolower;
body.gotoSearch = content.gotoSearch;
body.closeSort=content.closeSort;
Page(body)