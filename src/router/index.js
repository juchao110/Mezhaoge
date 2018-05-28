import Vue from 'vue'
import Router from 'vue-router'

// 登录模块
import LoginModule from '../components/login/loginModule.vue' // 登录模块
import Login from '../components/login/login.vue' // 登录页
import FindPassword from '../components/login/findPassword.vue' // 找回密码和重置密码
import BindAccount from '../components/login/bindAccount.vue' // 绑定账号
import Register from '../components/login/register.vue' // 注册
import SetPassword from '../components/login/setPassword.vue' // 注册

// 首页模块
import IndexModule from '../components/home/indexModule.vue' // 首页模块
import Index from '../components/home/index.vue' // 首页
import WordSearch from '../components/home/wordSearch.vue' // 文字搜索
import ImgSearch from '../components/home/imgSearch.vue' // 图片搜索
import SearchList from '../components/product/searchList.vue' // 搜索结果页（图、文）

// 求购大厅
import SendPurchase from '../components/purchase/sendPurchase.vue' // 发布求购
import PurchaseLobby from '../components/purchase/purchaseLobby.vue' // 求购大厅

// 产品和分类
import ProductCategory from '../components/product/productCategory.vue' // 产品分类
import ProductList from '../components/product/productList.vue' // 产品列表
import ProductListA from '../components/product/productListA.vue' // 产品列表
import ProductListB from '../components/product/productListB.vue' // 产品列表
import ProductDetail from '../components/product/productDetail.vue' // 产品详情

// 买家中心
import UserModule from '../components/user/userModule.vue'
import AboutUs from '../components/user/aboutUs.vue' // 关于我们
import Join from '../components/user/join.vue' // 卖家入驻
import MyPurchaseList from '../components/user/myPurchaseList.vue' // 我的求购列表
import UserCenter from '../components/user/userCenter.vue' // 用户中心
import Service from '../components/user/service.vue' // 在线客服

// 卖家中心
import sellModule from '../components/sell/sellModule.vue'
import ChooseType from '../components/sell/chooseType.vue' // 选择类目
import MyProductList from '../components/sell/myProductList.vue' // 产品列表
import Offer from '../components/sell/offer.vue' // 发起报价
import OfferList from '../components/sell/offerList.vue' // 报价列表
import ReleaseProduct from '../components/sell/releaseProduct.vue' // 发布产品
import SellCenter from '../components/sell/sellCenter.vue' // 卖家中心
import SetStore from '../components/sell/setStore.vue' // 店铺设置

// 撮合模块
import MyPurchaseDetail from '../components/match/myPurchaseDetail.vue' // 求购详情
import OfferDetail from '../components/match/offerDetail.vue' // 报价详情

// 资讯详情
import Information from '../components/information/information.vue' // 资讯详情

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '',
    redirect: '/index'
  },
  {
    path: '/login',
    component: LoginModule,
    children: [{
      path: '/',
      redirect: 'loginin'
    },
    {
      path: 'loginin',
      component: Login

    },
    {
      path: 'findpassword/:type',
      component: FindPassword,
      name: 'findpassword'
    },
    {
      path: 'bindaccount',
      component: BindAccount,
      name: 'bindaccount'
    },
    {
      path: 'register',
      component: Register,
      name: 'register'
    },
    {
      path: 'setpassword/:type/:phone',
      component: SetPassword,
      name: 'setpassword'
    }
    ]
  },
  {
    path: '/index',
    component: IndexModule,
    children: [{
      path: '',
      component: Index
    },
    {
      path: 'wordsearch',
      component: WordSearch
    },
    {
      path: 'imgsearch',
      component: ImgSearch
    }, {
      path: 'searchlist',
      component: SearchList
    }
    ]
  },
  {
    path: '/purchaselobby',
    component: PurchaseLobby
  },
  {
    path: '/sendpurchase',
    component: SendPurchase
    // meta: {
    //   title: '',
    //   requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    // }
  },
  {
    path: '/productcategory',
    component: ProductCategory
  },
  {
    path: '/productlist',
    component: ProductList,
    children: [{
      path: '',
      redirect: 'productlista'
    },
    {
      path: 'productlista',
      component: ProductListA
    },
    {
      path: 'productlistb',
      component: ProductListB
    }
    ]
  },
  {
    path: '/productdetail/:id',
    component: ProductDetail
  },
  {
    path: '/purchasedetail/:id/:source',
    component: MyPurchaseDetail,
    name: 'MyPurchaseDetail'
  },
  {
    path: '/offerdetail/:id/:source',
    component: OfferDetail
  },
  {
    path: '/user',
    component: UserModule,
    meta: {
      title: '',
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [{
      path: '',
      redirect: 'usercenter'
    },
    {
      path: 'usercenter',
      component: UserCenter
    },
    {
      path: 'aboutus',
      component: AboutUs
    },
    {
      path: 'mypurchaselist',
      component: MyPurchaseList
    },
    {
      path: 'join',
      component: Join
    },
    {
      path: 'changepassword/:type',
      component: FindPassword
    },
    {
      path: 'service',
      component: Service
    }
    ]
  },
  {
    path: '/sell',
    component: sellModule,
    meta: {
      title: '',
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      requireJoin: true // 需要成为入驻商家
    },
    children: [{
      path: '',
      redirect: 'sellcenter'
    },
    {
      path: 'sellcenter',
      component: SellCenter
    },
    {
      path: 'choosetype',
      component: ChooseType
    },
    {
      path: 'myproductlist',
      component: MyProductList
    },
    {
      path: 'offer/:id',
      component: Offer
    },
    {
      path: 'offerlist',
      component: OfferList
    },
    {
      path: 'releaseproduct',
      component: ReleaseProduct
    },
    {
      path: 'setstore',
      component: SetStore
    }
    ]
  },
  {
    path: '/information/:id',
    component: Information
  }

  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(savedPosition.x, savedPosition.y)
      }, 200)
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})

export default router
