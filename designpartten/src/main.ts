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

//状态模式
type State = 'american' | 'latte' | 'vanillaLatte' | 'mocha' | 'init';
class CoffeeMaker {
  public state: State;
  public leftMilk: number;
  public coffeeProcessor: Record<'that' | State, any> = {
    that: this,
    american() {
      if (this.that.leftMilk <= 0) {
        throw new Error("剩余牛奶不足!")
      }
      console.log(`left milk:${this.that.leftMilk}`);
      console.log(`我只吐黑咖啡`);
      
    },
    latte() {
      this.american();
      this.that.leftMilk -= 100;
      console.log(`加点奶`);
      
    },
    vanillaLatte() {
      this.latte();
      console.log(`加点香草糖浆`);
      
    },
    mocha() {
      this.latte();
      console.log(`加点巧克力`);
      
    },
    init() {

    }
  }

  constructor() {
    this.state = "init";
    this.leftMilk = 500;
  }
  makeCoffee(state: State) {
    if (!this.coffeeProcessor[state]) {
      return;
    }
    return this.coffeeProcessor[state]();
  }
}

let coffeeMaker = new CoffeeMaker();
coffeeMaker.makeCoffee("latte");
coffeeMaker.makeCoffee("latte");
coffeeMaker.makeCoffee("latte");

//观察者模式

interface IObserver {
  update: (...args: unknown[]) => any;
}


class Publisher {
  private _observers: IObserver[];
  constructor(name: string) { 
    this._observers = [];
  }

  addObserver(...observers: IObserver[]) {
    this._observers.push(...observers);
  }

  removeObserver(observer: IObserver) {
    const idx = this._observers.indexOf(observer);
    this._observers.splice(idx, 1);
  }

  checkObserver() {
    return this._observers && this._observers.length;
  }

  notify() {
    if (this.checkObserver()) {
      this._observers.forEach(observer => {
        observer.update();
      })
    }
  }
}

class Observer implements IObserver {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
  update(){
    console.log(`${this.name} has been active!`);
  }
}

let pb = new Publisher("p1");
let observer1 = new Observer("zhangsan");
let observer2 = new Observer("lisi");
let observer3 = new Observer("wangwu");
pb.addObserver(observer1, observer2, observer3);

pb.notify();
export {}