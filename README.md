# hymp
惠电影小程序


mp核心功能分成三个Tab页：

- 电影列表，显示正在热映和即将上映的电影
- 影院列表，根据用户的位置由近及远显示影院列表
- 个人中心，用户推荐、反馈入口

## 电影列表

电影列表包含头部和主体两部分，头部是目前正在热映八部电影的海报以幻灯浮图的形式循环轮播，主体则根据电影上映时间划分成正在热映和即将上映两个子Tab电影列表。

### 热映浮图

一般影视网站首页都有最近热播视频幻灯视图，热映浮图与此类似，使用滑块试图容器[swiper](https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html)轮番展示8部最近热门电影海报大图。

![gif](https://thumbnail0.baidupcs.com/thumbnail/1431e42d0ab2bc85dab2564e0bb2cbfe?fid=2202709176-250528-499308517288517&time=1544342400&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-LB3Av0IHYue%2B6tyneUC67dFwoHs%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=7948366642352537994&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video)

### 正在热映

正在热映列表是从豆瓣电影API分页获取所有正在热映的电影，和热映浮图一起构成惠电影首页视图。

热映列表中包含以下电影信息：

- 电影标题
- 电影海报小图
- 电影豆瓣评分
- 电影导演
- 电影演员
- 比价按钮，进入影院选择列表和比价详情页查看电影比价信息

单击电影列表项可进入电影详情也，查看当前电影详情信息。

![GIF](https://thumbnail0.baidupcs.com/thumbnail/cb3bafc78df4ec10d9c5946c2113c019?fid=2202709176-250528-636357808382271&time=1544346000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-D%2B1NILPevl3taxt3iSUBbLaJJgw%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=7948494193947621137&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video)

#### 电影详情页

电影详情页展示的电影信息：

- 电影标题、海报、评分，同列表页
- 剧情摘要
- 导演、演员照片
- 剧照、预告片，单击预告片可播放
- 比价按钮，可选择具体影院查看电影比价信息入口

![GIF](https://thumbnail0.baidupcs.com/thumbnail/2be0b6163298cb7ff5ef80d636a6073a?fid=2202709176-250528-424602474924456&time=1544346000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-mM3%2FV5LKxBsqAdPwoxbbnUzs5pk%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=7948850378293029981&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video)

### 即将上映

与正在热映一样，只是分页展示的是即将上映的电影信息，列表项中无比价按钮，单击列表项同样可查看电影详情信息。正在热映和即将上映两个Tab位于同一container中，两个Tab随用户选择切换，同一时刻只有一个可展示。

使用[高颜值、好用、易扩展的小程序 UI 库vant-weapp](https://github.com/youzan/vant-weapp)中的zan-tab组件极大简化了Tab切换效果的实现。


## 影院

影院信息入口，可查看搜索影院，包括：

- 影院列表
- 影院搜索
- 城市选择


### 影院列表

根据微信定位的用户位置由近及远展示当前城市电影院名称、电影院位置、距离、最低价格，单击影院列表项可查看影院详情比价信息。

### 影院搜索

影院搜索框里用户可输入电影院名称或道路地址，借用百度map微信小程序js api提供的POI检索热词联想功能可根据用户的输入显示提示地址。用户输入或选择某个具体地址后，利用百度map逆地址解析将输入地址解析成经纬度，然后与当前城市所有影院计算距离排序后由近及远展示所有影院。

![gif](https://thumbnail0.baidupcs.com/thumbnail/aa3298ad2027466593d36689f722b9f9?fid=2202709176-250528-87394533182568&time=1544346000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-ZKwN3qyGN5lABBppR1A0ecShF8Y%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=7948800055281265791&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video)

### 城市选择

惠电影使用微信sdk定位用户位置经纬度信息，然后使用百度map sdk由经纬度获取到具体城市，默认显示当前城市影院列表,可通过城市选择更换目的地城市。城市选择组件基于[citySelect](https://github.com/chenjinxinlove/citySelect)实现。

![gif](https://thumbnail0.baidupcs.com/thumbnail/8d909761ba7ab1d822209e43664f1c27?fid=2202709176-250528-586509014907617&time=1544346000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-n7Tywztt2PZGPoz9RcC29WTGVU8%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=7948771580927247096&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video)


### 影院详情

- 影院详情地址
- 热映电影比较，是惠电影最核心的功能

##### 影院地址
展示影院详情地址，点击地址icon可打开地图查看位置和导航信息。

![gif](https://thumbnail0.baidupcs.com/thumbnail/3d44aa302659e982cd2422ff71f2a67b?fid=2202709176-250528-260247419151929&time=1544428800&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-OnYeS%2FF4FGwoHx1bldTOFJ8RJZA%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=7971246961790090938&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video)

##### 电影比较

浮图形式展现当前影院热映电影海报，海报下方显示了电影名称、评分及详情的比价信息，滑动海报可切换热映电影比价信息。

比价信息按可售卖日期分成多个可切换Tab,每个tab以列表项显示了当前电影的开场时间、结束时间、放映厅、渠道最低价、语言等信息，点击列表项可查看/隐藏所有渠道的价格信息，目前有猫眼、淘票票、糯米三个渠道。

![GIF](https://thumbnail0.baidupcs.com/thumbnail/178fc86dc4489cc680e1ea5c6dccaa4e?fid=2202709176-250528-344656705129957&time=1544428800&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-fku1GDTzXWpxhUaaq%2BxZUAyOGKo%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=7971237865045650771&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video)

## 个人中心

个人中心包括当前登录用户信息以及惠电影分享推荐、联系客服和关于我入口项。

![gif](https://thumbnail0.baidupcs.com/thumbnail/158e6db45edd1121a0179b0cce1c7099?fid=2202709176-250528-225075024518071&time=1544346000&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-qIEozM0%2BLIQz6iWSNf0%2BPczmqN8%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=7949037809334398901&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video)

## Todo

- 电影搜索
- 影院按区域过滤、按价格排序
- 更多渠道方价格信息

## GitHub

[GitHub地址](https://note.youdao.com/)

## 扫描体验

![image](https://thumbnail0.baidupcs.com/thumbnail/7951be9d8282f5552a43554bc1d91222?fid=2202709176-250528-419168454378902&time=1544432400&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-mqXTWraZ43ySpZ7%2BAomIYu%2BM%2Bjw%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=7971575583445634637&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video)
