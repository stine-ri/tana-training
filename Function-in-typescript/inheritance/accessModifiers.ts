//Three access modifiers in TypeScript are public, private, and protected. They control the visibility and accessibility of class members (properties and methods).

class Person {
      public name:string; // public members can be accessed from anywhere, both inside and outside the class. By default, all members of a class are public if no access modifier is specified.
      protected age:number; // protected members can be accessed within the class and by derived classes (subclasses/child class), but not from outside the class. They are similar to private members, but they allow access to subclasses.
      private ssn:number;   // private members can only be accessed within the class they are defined in. They cannot be accessed from outside the class or by derived classes. Private members are used to encapsulate data and hide implementation details from the outside world.

      // constructor to initialize the properties of the Person class
      constructor(name:string, age:number, ssn:number){
        this.name = name;
        this.age = age;
        this.ssn = ssn;
      }
     // method to display the information of the person, this method is public, so it can be accessed from outside the class.
      public displayInfo(): void {
        console.log(`Name: ${this.name}, Age: ${this.age}, SSN: ${this.ssn}`);
      }
      displayInformation(){
        console.log(`Name: ${this.name}, Age: ${this.age}`); // cannot access ssn because it is private and can only be accessed within the Person class
      }
}

//child class that inherits from the Person class
class Employee extends Person {
    private employeeId: number;
    constructor(name: string, age: number, ssn: number, employeeId: number) {
        super(name, age, ssn); // calling the constructor of the parent class (Person) to initialize the inherited properties
        this.employeeId = employeeId; // initializing the employeeId property specific to the Employee class
    }
    // method to display the information of the employee, this method is public, so it can be accessed from outside the class.
    public displayEmployeeInfo(): void {
        console.log(`Employee ID: ${this.employeeId}`);
        this.displayInfo(); // calling the displayInfo method of the parent class to display the name, age, and ssn of the employee
    }
    showEmployeeDetails(){
        console.log(this.name); // can access name because it is public
        console.log(this.age); // can access age because it is protected and Employee is a subclass of Person
        // console.log(this.ssn); // cannot access ssn because it is private and can only be accessed within the Person class
        console.log(this.employeeId); // can access employeeId because it is private to the Employee class and we are accessing it within the Employee class
    }
}
// creating an instance of the Employee class
let employee1 = new Employee("John Doe", 30, 123456789, 101);
employee1.displayEmployeeInfo(); // Employee ID: 101, Name: John Doe, Age: 30, SSN: 123456789
employee1.showEmployeeDetails(); // John Doe, 30, 101
employee1.displayInformation(); // Name: John Doe, Age: 30 (cannot access ssn because it is private and can only be accessed within the Person class)
