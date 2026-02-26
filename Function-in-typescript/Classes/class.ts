/*  we are going to learn about classes in typescript, we will cover the following topics:
   class
   read only properties
   optional properties
    static variables and methods- static properties and methods are common/shared among all instances of the class, 
    they belong to the class itself rather than any specific object created from the class. 
    This means that you can access static properties and methods without creating an instance of the class,
    using the class name directly.
    They can be modifies using class name as well, and they are shared among all instances of the class.
  */

 class Student
 {
    // defining properties of the Student class

    readonly studentId: number; // Read-only property can only be assigned once
    name: string; // Regular property
    email?: string; // Optional property, can be undefined
    schoolName: string;
    static schoolAddress: string = "Lanet, Nakuru"; // Static property shared by all instances/objects of the class

    // constructor to initialize properties, purpose is to assign data to the properties of the class when an object is created
    constructor(studentId: number, name: string, schoolName: string, email?: string) {
        this.studentId = studentId;
        this.name = name;
        this.schoolName = schoolName;
        if (email) {
            this.email = email; // Assign email only if it's provided, if you dont it will be undefined
        }
    }

    //method to display student information, purpose is to provide a way to output the details of the student in a readable format
    displayStudentInfo(): void {
        console.log(`Student ID: ${this.studentId}`);
        console.log(`Name: ${this.name}`);
        console.log(`School: ${this.schoolName}`);
        if (this.email) {
            console.log(`Email: ${this.email}`);
        } else {
            console.log("Email: Not provided");
        }
    }

    // static method to display school information, can be called without creating an instance of the class
    static displaySchoolInfo(): void {
        console.log("Welcome to our school! We provide quality education.");
    }
 }
    // purpose of creating a class is to create a blueprint for objects that share common properties and behaviors, it allows us to encapsulate data and functions together, making our code more organized and reusable. Classes also support features like inheritance and polymorphism, which enable us to create complex and flexible code structures.
    // creating an object of the Student class
    let student1 = new Student(1, "Alice", "Enaiposha High");//email is optional, so we can choose not to provide it
    let student2 = new Student(2, "Anne", "Enaiposha High", "anne@gmail.com");

    //Display information of the students
    student1.displayStudentInfo();
    student2.displayStudentInfo();

    //modifying the student Id which is readonly will result in an error
    // student1.studentId = 3; // This will cause an error because studentId is read-only

    //static properties and methods- accessing through the class name without creating an instance of the class
    console.log(Student.schoolAddress); // Accessing static property without creating an instance
    Student.displaySchoolInfo(); // Calling static method without creating an instance

    //changing the static property value
    Student.schoolAddress = "New Lanet, Nakuru";
    console.log(Student.schoolAddress); // Accessing the updated static property value

    // we can access static variables and methods using the class name directly, without needing to create an instance of the class. This is because static members belong to the class itself rather than any specific object created from the class.
    // accessing static properties and methods using objects of the class, this is not recommended but it is possible in java , impossible in typescript
    // console.log(student1.schoolAddress); // Accessing static property through an instance (not recommended)
    // student1.displaySchoolInfo(); // Calling static method through an instance (not recommended)