// method overloading and constructor overloading in typescript
// method overloading is a feature that allows a class to have multiple methods with the same name but different parameters. It enables us to define multiple ways to call a method based on the number and types of arguments passed to it. This can make our code more flexible and easier to read, as we can use the same method name for different operations without having to create separate methods for each case.

// constructor overloading is a specific type of method overloading that applies to constructors. It allows a class to have multiple constructors with different parameter lists, enabling us to create objects in different ways based on the arguments provided during instantiation. This can be useful for providing default values or allowing for different initialization scenarios when creating objects from a class.

/* In TypeScript, we can achieve method overloading by defining multiple function signatures for a single method. However, TypeScript does not support true constructor overloading like some other languages (e.g., Java or C#). Instead, we can use optional parameters or default values in the constructor to simulate constructor overloading.*/


// 1. constructor overloading

 class Calculator
 {
     constructor(); // default constructor with no parameters
     constructor(a: number, b: number); // parameterized constructor with two numbers
       constructor(a?: number, b?: number) { // implementation of the constructor
            if (a !== undefined && b !== undefined) {
                console.log(`sum of a + b is ${a + b}`);
            } else {
                console.log("Default constructor called");
            }
       }
 }

 //usage
    let calc1 = new Calculator(); // Calls the default constructor
    let calc2 = new Calculator(5, 10); // Calls the parameterized constructor

class Add{
// 2. method overloading
 addNum (a: number, b: number): number; // method signature for adding two numbers
 addNum (a:number, b: number, c: number): number; // method signature for adding three numbers

  addNum(a: number, b: number, c?: number): number { // implementation of the addNum method
    if (c !== undefined) {
        return a + b + c; // If three parameters are provided, return their sum
    } else {
        return a + b; // If only two parameters are provided, return their sum
    }
    
  }

}
    
// usage-method overloading
let addition = new Add();
console.log("adding two numbers:" + addition.addNum(5, 10)); // Calls the method for adding two numbers
console.log("adding three numbers:" + addition.addNum(5, 10, 15)); // Calls the method for adding three numbers

