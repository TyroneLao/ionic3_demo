/**
 * 本地存储修饰器
 *
 * author:laotianlun
 * 2017-11-30
 */


/**
 * LocalStorage 用于存储字符串变量
 */
export function LocalStorage(
  target: Object, // 被修饰变量的所属类
  decoratedPropertyName: string // 被修饰变量的名称
) {

  // 重写该变量的get set 方法
  Object.defineProperty(target, decoratedPropertyName, {
    get: function () {//变量取值时 默认从localStorage 中获取
      return localStorage.getItem(decoratedPropertyName) || '';
    },
    set: function (newValue) {//变量设置值时 默认设置localStorage 中值
      localStorage.setItem(decoratedPropertyName, newValue);
    }
  });
}

/**
 * LocalStorage 通过正反转json来达到存储json对象变量的目的
 */
export function JsonLocalStorage(
  target: Object, // 被修饰变量的所属类
  decoratedPropertyName: string // 被修饰变量的名称
) {

  // 重写该变量的get set 方法
  Object.defineProperty(target, decoratedPropertyName, {
    get: function () {//变量取值时 默认从localStorage 中获取
      return JSON.parse(localStorage.getItem(decoratedPropertyName)) || '';
    },
    set: function (newValue) {//变量设置值时 默认设置localStorage 中值
      localStorage.setItem(decoratedPropertyName, JSON.stringify(newValue));
    }
  });
}


/**
 * SessionStorage 用于存储字符串变量
 */
export function SessionStorage(
  target: Object,// 被修饰变量的所属类
  decoratedPropertyName: string // 被修饰变量的名称
) {

  // 重写该变量的get set 方法
  Object.defineProperty(target, decoratedPropertyName, {
    get: function () {//变量取值时 默认从localStorage 中获取
      return sessionStorage.getItem(decoratedPropertyName) || '';
    },
    set: function (newValue) {//变量设置值时 默认设置localStorage 中值
      sessionStorage.setItem(decoratedPropertyName, newValue);
    }
  });
}
/**
 * SessionStorage 通过正反转json来达到存储json对象变量的目的
 */
export function JsonSessionStorage(
  target: Object, // 被修饰变量的所属类
  decoratedPropertyName: string // 被修饰变量的名称
) {

  // 重写该变量的get set 方法
  Object.defineProperty(target, decoratedPropertyName, {
    get: function () {//变量取值时 默认从localStorage 中获取
      return JSON.parse(sessionStorage.getItem(decoratedPropertyName)) || '';
    },
    set: function (newValue) {//变量设置值时 默认设置localStorage 中值
      sessionStorage.setItem(decoratedPropertyName, JSON.stringify(newValue));
    }
  });
}
