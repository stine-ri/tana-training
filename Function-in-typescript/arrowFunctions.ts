// arrow functions/lamba functions.
/* Lambda functions are anonymous functions that can be used as expressions. 
They are often used as callbacks or to create small, one-off functions. 
In TypeScript, you can define lambda functions using the arrow syntax. 
There are three parts to an arrow function: 
the parameters
the arrow (=>)
the function body.

syntax
let variableName = (parameters) => {
    // function body
};
variableName(); // Call the arrow function
*/


// example 1: Arrow function with no parameters
const greet = (): void => {
    console.log("Hello, World!");
};
greet(); 

// example 2: Arrow function with parameters and return type
const add = (a: number, b: number): number => {
    return a + b;
};
const result = add(5, 10);
console.log(result); 

// example 3: Arrow function with optional parameters
const greetPerson = (name?: string): void => {
    if (name) {
        console.log(`Hello, ${name}!`);
    } else {
        console.log("Hello, Stranger!");
    }
};
greetPerson("Alice");
greetPerson(); 

// example 4: Arrow function with default parameters
const multiply = (a: number, b: number = 1): number => {
    return a * b;
};
console.log(multiply(5)); 
console.log(multiply(5, 2)); 

// example 5: Arrow function with implicit return
const square = (x: number): number => x * x;
console.log(square(4)); 

// example 6: Arrow function with multiple parameters and implicit return
const concatenate = (str1: string, str2: string): string => `${str1} ${str2}`;
console.log(concatenate("Hello", "World")); 

// example 7: Arrow function used as a callback
const numbers = [1, 2, 3, 4, 5];
const squaredNumbers = numbers.map(num => num * num);
console.log(squaredNumbers); 

// example 8: Arrow function with no parameters and implicit return
const getCurrentYear = (): number => new Date().getFullYear();
console.log(getCurrentYear());

// example 9: Arrow function with rest parameters
const sumAll = (...numbers: number[]): number => {
    return numbers.reduce((acc, curr) => acc + curr, 0);
};
console.log(sumAll(1, 2, 3, 4)); 

// example 10: Arrow function with destructured parameters
const printCoordinates = ({ x, y }: { x: number; y: number }): void => {
    console.log(`X: ${x}, Y: ${y}`);
};
printCoordinates({ x: 10, y: 20 }); 

// example 11: Arrow function with optional parameters 
const greetWithTime = (name: string, timeOfDay?: string): void => {
    if (timeOfDay) {
        console.log(`Good ${timeOfDay}, ${name}!`);
    } else {
        console.log(`Hello, ${name}!`);
    }
};
greetWithTime("Alice", "morning"); 
greetWithTime("Bob"); 

// example 12: Arrow function with default parameters and implicit return
const calculateArea = (radius: number, pi: number = 3.14): number => pi * radius * radius;
console.log(calculateArea(5)); 
console.log(calculateArea(5, Math.PI)); 