import { appname, add, Calculator } from './modules';

console.log(appname);
console.log(add(2, 3));

let calculator = new Calculator();
console.log(calculator.add(5, 10));