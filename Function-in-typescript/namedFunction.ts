//example 1: Named function without parameters and return type
function greetIndividual(): void {
    console.log("Hello, World!");
}
greet(); 

//example 2: Named function with parameters and return type
function addNum(a: number, b: number): number {
    return a + b;
}
const sum = add(5, 10);
console.log(sum); 
//example 3: Named function with optional parameters
function greetFunction(name?: string): void {
    if (name) {
        console.log(`Hello, ${name}!`);
    } else {
        console.log("Hello, Stranger!");
    }
}
greetFunction("Alice"); 
greetFunction(); 

//example 4: Named function with default parameters
function multiplyNum(a: number, b: number = 1): number {
    return a * b;
}
console.log(multiplyNum(5)); 
console.log(multiplyNum(5, 2)); 
