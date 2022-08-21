//ES7 装饰器模式
@buttonDecorator
class Button{ 
  constructor(){
    console.log(`book has decorator${ (Button as any).isDecorator }`);
  }

  @clickDecorator
  click(){
    console.log(`类方法调用`);
  }
}

function buttonDecorator(target: any) {
  (target as any).isDecorator = true;
  return target;
}


function clickDecorator(target: any, name: any, descriptor: any) {
  let originMethod: Function = descriptor.value;
  descriptor.value = function(){
    console.log(`装饰器func调用`);
    return originMethod.apply(this, arguments);
  }
  return descriptor;
}

let btn = new Button();
btn.click();


// 代理
function add(...nums: number[]) {
  return nums.reduce((acc,cur) => { return acc + cur }, 0);
}

let proxyAdd = (function(){
  let resAddCache: Record<string, number> = {};
  return function(...nums: number[]) {
    let argString = Array.prototype.join.call(arguments, ",");
    if (resAddCache.hasOwnProperty(argString)) {
      return resAddCache[argString]
    }else {
      return resAddCache[argString] = add(...arguments);
    }
  }  
})()

console.log(proxyAdd(1,2,3,4,5));
console.log(proxyAdd(1,2,3,4,5));

//策略模式


type TAG = 'pre' | 'onSale' | 'back' | 'fresh';
type salePrice = (origin: number) => number;
const PRICES: Record<TAG, salePrice> = {
  pre: (originPrice: number) => {
    if (originPrice >= 100) {
      return originPrice - 20;
    }
    return originPrice * 0.9;
  },
  onSale: (originPrice: number) => {
    if (originPrice >= 100) {
      return originPrice - 30;
    }
    return originPrice * 0.8;
  },
  back: (originPrice: number) => {
    if (originPrice >= 200) {
      return originPrice - 50;
    }
    return originPrice;
  },
  fresh: (originPrice: number) => {
    return originPrice * 0.5;
  }
}
function askPrice(tag: TAG, originPrice: number) {
  return PRICES[tag](originPrice);
}

export {}