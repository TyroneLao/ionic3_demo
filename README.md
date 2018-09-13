# ionic3_demo
一个持续更新的ionic3的模板集


### 解决相关问题
1. 解决support-v4不一致，导致打包报错的问题 
   安装插件 
   
### 编码规范


### 打包：

#### 添加平台
ionic cordova platform add android@6.3.0（不能用默认的7.0.0，目录的变化会导致错误）


### 插件安装

###### 1.安装device 插件
``````
 ionic cordova plugin add cordova-plugin-device                                                
 npm install --save @ionic-native/device 
``````
###### 2.安装App Version 插件
``````
 ionic cordova plugin add cordova-plugin-app-version
 npm install --save @ionic-native/app-version
`````` 
 
###### 3.安装File Transfer 插件
``````
 ionic cordova plugin add cordova-plugin-file-transfer
 npm install --save @ionic-native/file-transfer
``````
###### 4.安装File 插件
``````
 ionic cordova plugin add cordova-plugin-file
 npm install --save @ionic-native/file
``````
###### 5.安装File Opener 插件
``````
 ionic cordova plugin add cordova-plugin-file-opener2
 npm install --save @ionic-native/file-opener
``````
###### 6.安装Network 插件
``````
 ionic cordova plugin add cordova-plugin-network-information
 npm install --save @ionic-native/network
``````
###### 7.安装Toast 插件
``````
 ionic cordova plugin add cordova-plugin-x-toast
 npm install --save @ionic-native/toast
``````
###### 8.安装In App Browser 插件
``````
 ionic cordova plugin add cordova-plugin-inappbrowser
 npm install --save @ionic-native/in-app-browser
``````
###### 9.安装Screen Orientation 插件 设置屏幕旋转
``````
 ionic cordova plugin add cordova-plugin-screen-orientation  
 npm install --save @ionic-native/screen-orientation  
``````
###### 10.安装JPush 插件 极光推送
> 注意：插件从 v3.4.0 开始支持 cordova-android 7.0.0，因 cordova-android 7.0.0 修改了 Android 项目结构，因此不兼容之前的版本，升级前请务必注意。  
> 如果需要安装之前版本的插件，请先安装 v1.2.0 以下版本（建议安装 v1.1.12）的 cordova-plugin-jcore，再安装旧版本插件（比如 v3.3.2），否则运行会报错。  
  
``````
 ionic cordova plugin add cordova-plugin-jcore@1.1.12  
 ionic cordova plugin add jpush-phonegap-plugin@3.3.2 --variable APP_KEY="da517153774b5adea040cac8"  
 npm install --save @jiguang-ionic/jpush 
``````
###### 11.安装Diagnostic 插件 设备权限
``````
 ionic cordova plugin add cordova.plugins.diagnostic
 npm install --save @ionic-native/diagnostic
``````