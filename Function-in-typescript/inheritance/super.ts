//super() - The super keyword is used to call the parent class constructor and methods. It is used in the child class to access the properties and methods of the parent class.
//super - used to call the parent class constructor and methods. It is used in the child class to access the properties and methods of the parent class.Used to invoke the immediate parent class constructor and methods. It is used in the child class to access the properties and methods of the parent class. It is also used to call the parent class constructor from the child class constructor.
// this-keyword used to access 
class Parent{
    num: number= 10;
    constructor(){
        console.log("Parent class constructor called");
    }
    display(){
        console.log(`The number is: ${this.num}`);
    }
 }

 class Child extends Parent{
    num: number = 20; // this will override the num property of the parent class.Property overriding occurs when a child class has a property with the same name as a property in the parent class. In this case, the num property in the Child class will override the num property in the Parent class. When we create an instance of the Child class and access the num property, it will return the value defined in the Child class (20) instead of the value defined in the Parent class (10).
    constructor(){ // when creating a child class constructor, we must call the parent class constructor-invoking the parent class constructor is necessary to ensure that the properties and methods of the parent class are properly initialized and available for use in the child class. If we do not call the parent class constructor
        super(); // calling the parent class constructor
        console.log("Child class constructor called");
    }
    // method overriding- when a child class has a method with the same name as a method in the parent class, the child class method will override the parent class method. This is called method overriding. It allows you to provide a specific implementation of a method that is already defined in the parent class.
    display(){
        super.display(); // calling the display method of the parent class
        console.log(`The number in child class is: ${this.num}`);
    }
    show(){
        console.log(`The number in child class is: ${this.num}`);
    }
 }

 //super can be used to call the parent class constructor and methods. It is used in the child class to access the properties and methods of the parent class. It is also used to call the parent class constructor from the child class constructor
    let child = new Child(); // Parent class constructor called, Child class constructor which calls the parent class constructor using super() is called.
    child.display(); // The number is: 10, The number in child class is: 20
    child.show(); // The number in child class is: 20
    // parent.display(); // wont work because parent is not defined, we need to create an instance of the Parent class to call the display method of the Parent class.