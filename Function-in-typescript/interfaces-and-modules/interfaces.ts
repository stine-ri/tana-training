 /*
  An interface in typescript is a way to define the structure of an object.
  It tells the compiler what properties and types an object should have
  It's like a blueprint for objects
  Abstract method: we only declare the method signature in the interface, and the classes that implement the interface will provide the implementation for that method. This allows us to define a common structure for different classes while allowing them to have their own specific implementations of the methods.
  Interfaces can also be used to define the structure of a class, and a class can implement multiple interfaces. This allows for a more flexible and modular design of the code.
  Interfaces are also useful for defining the structure of objects that are passed as arguments to functions or returned from functions, which can help to ensure that the correct types of data are being used in the code.
  Interfaces in TypeScript are a powerful tool for defining the structure of objects and classes, and they can help to ensure that the code is more organized, maintainable, and type-safe.

  syntax:
    interface InterfaceName {
        property1: type;
        abstractMethod1(): returnType;
        abstractMethod2(): returnType;
    }
      interfaces allows different types of properties:
        - regular properties: these are properties that have a specific type and can be assigned a value.
        - optional properties: these are properties that may or may not be present in an object. They are denoted by a question mark (?) after the property name.
        - readonly properties: these are properties that can only be assigned a value once and cannot be modified afterwards. They are denoted by the readonly keyword before the property name.
        - index signatures: these allow you to define properties with dynamic names and types. They are denoted by square brackets [] and a type for the property name and value. 
        - extending interfaces: interfaces can extend other interfaces, allowing you to create a new interface that inherits the properties and methods of the existing interface. This is done using the extends keyword.
        - class implementation interfaces can be implemented by classes, which means that the class must provide an implementation for all the properties and methods defined in the interface. This is done using the implements keyword.
  */

 // basic interface example
interface Person{
    name: string;
    age: number;
  
}
// creating an object of the Person interface- when we create an object of the Person interface, we need to provide values for the properties defined in the interface. In this case, we are creating an object called person1 and assigning it a name and age. The properties of the person1 object must match the properties defined in the Person interface, otherwise, we will get a type error.
let person1: Person = {
    name: "John",
    age: 30
}
console.log(person1.name); // Output: John
console.log(person1.age); // Output: 30

// interface with optional properties (?)
interface Employee{
    id: number;
    name: string;
    department?: string; // optional property
}
let employee1: Employee = {
    id: 1,
    name: "Alice"
}
let employee2: Employee = {
    id: 2,
    name: "Bob",
    department: "HR"
}
console.log(employee1.id); // Output: 1
console.log(employee1.name); // Output: Alice
console.log(employee1.department); // Output: undefined
console.log(employee2.id); // Output: 2
console.log(employee2.name); // Output: Bob
console.log(employee2.department); // Output: HR

// interface with readonly properties to ensure that the properties cannot be modified after they are assigned a value. In this case, we have defined an interface called Car with a readonly property called make. This means that once we assign a value to the make property, we cannot change it later in the code. If we try to modify the make property, we will get a type error.
interface Vehicle{
    readonly make: string;
    model: string;
    year: number;
}
let vehicle1: Vehicle = {
    make: "Toyota",
    model: "Camry",
    year: 2020
}
console.log(vehicle1.make); // Output: Toyota
console.log(vehicle1.model); // Output: Camry
console.log(vehicle1.year); // Output: 2020
// vehicle1.make = "Honda"; // Error: Cannot assign to 'make' because it is a read-only property.


interface Book{
    title: string;
    readonly isbn: string;

    displayInfo(): void; // abstract method
}

let book1: Book = {
    title: "The Great Flood",
    isbn: "978-3-16-148410-0",
    displayInfo: function(){
        console.log(`Title: ${this.title}, ISBN: ${this.isbn}`);
    }
}
book1.displayInfo(); // Output: Title: The Great Gatsby, ISBN: 978-3-16-148410-0
// book1.isbn = "123-4-56-789012-3"; // Error: Cannot assign to 'isbn' because it is a read-only property.

// extending interfaces-inheritance in interfaces allows us to create a new interface that inherits the properties and methods of an existing interface. This is done using the extends keyword. When an interface extends another interface, it can add new properties and methods or override existing ones. This allows for a more flexible and modular design of the code, as we can create new interfaces based on existing ones without having to duplicate code.
//parent interface 
interface Animal{
    name: string;
}
//child interface- the Dog interface extends the Animal interface, which means that it inherits the name property from the Animal interface. In addition to the name property, the Dog interface also has its own property called breed. This allows us to create a new interface that builds upon the existing structure of the Animal interface while adding specific properties for dogs.
interface Dog extends Animal{
    color: string;
}

//object for the interface
let dog1: Dog = {
    name: "Buddy",
    color: "Brown"
}
console.log(dog1.name); // Output: Buddy
console.log(dog1.color); // Output: Brown

// class and interface implementation- when a class implements an interface, it means that the class must provide an implementation for all the properties and methods defined in the interface. This is done using the implements keyword. By implementing an interface, a class can ensure that it adheres to a specific structure and provides the necessary functionality defined by the interface. This allows for better code organization and type safety, as the class must conform to the contract established by the interface.
// a class can implement interfaces, which means that the class must provide an implementation for all the properties and methods defined in the interface. This is done using the implements keyword. By implementing an interface, a class can ensure that it adheres to a specific structure and provides the necessary functionality defined by the interface. This allows for better code organization and type safety, as the class must conform to the contract established by the interface.
interface Shape{
    area(): number; // abstract method
}
class Circle implements Shape{ // the Circle class implements the Shape interface, which means that it must provide an implementation for the area method defined in the Shape interface. In this case, the Circle class has a radius property and provides an implementation for the area method that calculates the area of a circle using the formula πr^2.
    radius: number;
    constructor(radius: number){
        this.radius = radius;
    }
    area(): number{
        return Math.PI * this.radius * this.radius;
    }
}
let circle1 = new Circle(5);
console.log(circle1.area()); // Output: 78.54

//abstract method in interface- when we define an abstract method in an interface, we only declare the method signature without providing an implementation. The classes that implement the interface are then responsible for providing their own specific implementation of the abstract method. This allows us to define a common structure for different classes while allowing them to have their own specific implementations of the methods. In this example, we have defined an interface called Shape with an abstract method called area. The Circle class implements the Shape interface and provides its own implementation of the area method to calculate the area of a circle based on its radius.
//example:
interface house{
    area(): number; // abstract method
}
class SquareHouse implements house{
    sideLength: number;
    constructor(sideLength: number){
        this.sideLength = sideLength;
    }
    area(): number{
        return this.sideLength * this.sideLength;
    }
}
let squareHouse1 = new SquareHouse(4);
console.log(squareHouse1.area()); // Output: 16 


