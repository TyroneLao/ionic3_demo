import {Injectable} from '@angular/core';

@Injectable()
export class Const {

  /**
   * ### 调试时使用的跨域转发
   *
   * API        本地台式
   * API1       小姚
   * API2       金利
   * APIHttps   HTTPS测试地址
   * @type {string}
   */

    //public static DOMAIN = "API";// 本地测试地址   防跨域（ionic.config.json 中做了转发）API1 小姚
    // public static DOMAIN = "http://10.2.153.147:8080/tom/mobile";// 本地测试地址
    // public static DOMAIN = "http://10.2.153.240:8081/tom/mobile";// 小姚测试地址

    // public static DOMAIN = "http://10.2.8.166:8118/tom/mobile";// 测试地址

    // public static DOMAIN = "TESTAPIHttps";
   //public static DOMAIN = "https://wx.grgyintong.com/tom/mobile";

  // public static DOMAIN = "APIHttps";
   public static DOMAIN = "https://tom.grgyintong.com/mobile";//正式环境（不用tom）

  //图片服务器
  public static PIC_DOMAIN = "https://tom.grgyintong.com";//正式环境（不用tom）
   //public static PIC_DOMAIN = "https://wx.grgyintong.com/tom";// 测试地址
  // public static PIC_DOMAIN = "http://10.2.153.147:8080/tom";
  // public static PIC_DOMAIN = "http://10.2.153.240:8081/tom";//小姚测试地址



  //rsa 公钥
  public static PUBLIC_RSA_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCljYi7WnVGuPhg63bk1OlAOihjp6LbbVauM2E2Gh9wiaQazh1oSCR1DuW2Wj5sDZaK8/QMs2zUqF+epUF+0QcHZcKpMEc/4DgWkpSlhludR5Y6Zq06Rqcnq3++eBkhGE9kqCmwVzq+8jFKHJXZ9+Eie991VQD0a++gBP8MukIHrwIDAQAB";
  //aes 公钥
  public static AES_KEY = "GRGBANKINGTOMAPP";


  public static APPTYPE = "TOM";//app类型 员工APP
  public static IOS_DOWNLOAD = "itms-apps://itunes.apple.com/us/app/apple-store/id1333436060";//itms-apps://itunes.apple.com/us/app/apple-store/id --是固定部分  1333436060--是上传应用的apple id

  public static TELREG = /^1[0-9]{10}$/;
  public static PWDREG = /^(\w){6,16}$/;
  public static INTERGERREG = /^[0-9]*$/;//验证数字 reg.test(string)
  public static POSITIVE_INT_REG = /^\+?[1-9][0-9]*$/;//验证非零的正整数：

  public static IMAGE_SIZE = 1024;//拍照/从相册选择照片压缩大小
  public static QUALITY_SIZE = 50;//图像压缩质量，范围为0 - 100

  public static REQUEST_ROWS: number = 8;  // 请求页数
  public static REQUEST_TIMEOUT = 200000;  // 请求超时

  public static TIMING_TIME = 1 * 60 * 1000;  // 定时上传地址时间间隔 * 60


}
/*
验证数字的正则表达式集
验证数字：^[0-9]*$
验证n位的数字：^\d{n}$
验证至少n位数字：^\d{n,}$
验证m-n位的数字：^\d{m,n}$
验证零和非零开头的数字：^(0|[1-9][0-9]*)$
验证有两位小数的正实数：^[0-9]+(.[0-9]{2})?$
  验证有1-3位小数的正实数：^[0-9]+(.[0-9]{1,3})?$
  验证非零的正整数：^\+?[1-9][0-9]*$
  验证非零的负整数：^\-[1-9][0-9]*$
验证非负整数（正整数 + 0） ^\d+$
验证非正整数（负整数 + 0） ^((-\d+)|(0+))$
验证长度为3的字符：^.{3}$
验证由26个英文字母组成的字符串：^[A-Za-z]+$
验证由26个大写英文字母组成的字符串：^[A-Z]+$
验证由26个小写英文字母组成的字符串：^[a-z]+$
验证由数字和26个英文字母组成的字符串：^[A-Za-z0-9]+$
验证由数字、26个英文字母或者下划线组成的字符串：^\w+$
验证用户密码:^[a-zA-Z]\w{5,17}$ 正确格式为：以字母开头，长度在6-18之间，只能包含字符、数字和下划线。
验证是否含有 ^%&',;=?$\" 等字符：[^%&',;=?$\x22]+
  验证汉字：^[\u4e00-\u9fa5],{0,}$
验证Email地址：/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
验证InternetURL：^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$ ；^[a-zA-z]+://(w+(-w+)*)(.(w+(-w+)*))*(?S*)?$
  验证电话号码：^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$：--正确格式为：XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX。
验证身份证号（15位或18位数字）：^\d{15}|\d{}18$
验证一年的12个月：^(0?[1-9]|1[0-2])$ 正确格式为：“01”-“09”和“1”“12”
验证一个月的31天：^((0?[1-9])|((1|2)[0-9])|30|31)$ 正确格式为：01、09和1、31。
整数：^-?\d+$
非负浮点数（正浮点数 + 0）：^\d+(\.\d+)?$
  正浮点数 ^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$
非正浮点数（负浮点数 + 0） ^((-\d+(\.\d+)?)|(0+(\.0+)?))$
负浮点数 ^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$
浮点数 ^(-?\d+)(\.\d+)?$*/


