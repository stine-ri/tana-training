// example 1: Anonymous function assigned to a variable
const greetings = function(): void {
    console.log("Hello, World!");
};
greetings(); 

// example 2: Anonymous function with parameters and return type
const addNumbers = function(a: number, b: number): number {
    return a + b;
};
const sumOfNumbers = addNumbers(5, 10);
console.log(sumOfNumbers); 

// example 3: Anonymous function with optional parameters
const greetUser = function(name?: string): void {
    if (name) {
        console.log(`Hello, ${name}!`);
    } else {
        console.log("Hello, Stranger!");
    }
};
greetUser("Alice"); 
greetUser(); 

// example 4: Anonymous function with default parameters
const multiplyNumbers = function(a: number, b: number = 1): number {
    return a * b;
};
console.log(multiplyNumbers(5)); 
console.log(multiplyNumbers(5, 2)); 
