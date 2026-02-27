/* inheritance:
    - A class can reuse the properties and methods of another class.
    -Inheritance is a mechanism where one class(child) can inherit the properties and methods of another class(parent).
    - Inheritance allows you to reuse the functionality of an existing class without having to rewrite the code.
    A ----properties + methods  (parent class/base class/super class)
    B ----properties + methods  (child class/derived class/sub class)
    */
   //method overriding: when a child class has a method with the same name as a method in the parent class, the child class method will override the parent class method. This is called method overriding. It allows you to provide a specific implementation of a method that is already defined in the parent class.
   //super keyword: The super keyword is used to call the parent class constructor and methods. It is used in the child class to access the properties and methods of the parent class.
   

    //parent class
    class Car{
        name:string;
        color:string;
        model:string;

        constructor(name:string,color:string,model:string){ // constructor is a special method that is called when an object is created from a class. It is used to initialize the properties of the class.
            this.name = name;
            this.color = color;
            this.model = model;
        }
        start(){
            console.log(`${this.name} is starting...`);
        }
        stop(){
            console.log(`${this.name} is stopping...`);
        }
        displayInformation(){
            console.log(`Name: ${this.name}, Color: ${this.color}, Model: ${this.model}`);
        }
    }
    //child class -honda is a child class that inherits the properties and methods of the Car class. It can also have its own properties and methods, and it can override the methods of the Car class to provide a specific implementation for Honda cars.
    class Honda extends Car{ // extends keyword is used to create a child class that inherits the properties and methods of the parent class.
        year:number;
        constructor(name:string,color:string,model:string,year:number){
            super(name,color,model); // super keyword is used to call the parent class constructor.
            this.year = year;
        }

        // method overriding- when a child class has a method with the same name as a method in the parent class, the child class method will override the parent class method. This is called method overriding. It allows you to provide a specific implementation of a method that is already defined in the parent class.
        start(){
            console.log(`Honda is starting...`);
        }
        stop(){
            console.log(`Honda is stopping...`);
        }
        displayInfo(){
            console.log(`Year: ${this.year}`);
        }
        yom(){
            console.log(`Year of manufacture: ${this.year}`);
        }
        
    }
    //child class - toyota is a child class that inherits the properties and methods of the Car class. It can also have its own properties and methods, and it can override the methods of the Car class to provide a specific implementation for Toyota cars.
    class Toyota extends Car{
        year:number;
        constructor(name:string,color:string,model:string,year:number){
            super(name,color,model);
            this.year = year;
        }
        start(){
            console.log(`Toyota is starting...`);
        }
        stop(){
            console.log(`Toyota is stopping...`);
        }
        displayInfo(){
            console.log(`Year: ${this.year}`);
        }
        yom(){
            console.log(`Year of manufacture: ${this.year}`);
        }
    }

    // creating objects of the Honda and Toyota classes- time an object is created from a class, the constructor of that class is called to initialize the properties of the object. In this case, when we create an object of the Honda class, the constructor of the Honda class is called, which in turn calls the constructor of the Car class using the super keyword to initialize the properties inherited from the Car class. The same process happens when we create an object of the Toyota class.
    let hondaCar = new Honda("Honda Civic", "Red", "Sedan", 2020);
    let toyotaCar = new Toyota("Toyota Camry", "Blue", "Sedan", 2021);

    console.log("Honda Car Information:");
    console.log(`Name: ${hondaCar.name}`);
    console.log(`Color: ${hondaCar.color}`);
    console.log(`Model: ${hondaCar.model}`);
    console.log(`Year: ${hondaCar.year}`);

    // calling methods of the Honda and Toyota classes
    hondaCar.start(); //Honda started.... //called child class method(method overriding)
    hondaCar.displayInfo(); // Year: 2020 //called child class method(method overriding)
    hondaCar.displayInformation(); // Name: Honda Civic, Color: Red, Model: Sedan // called parent class method
    hondaCar.yom();
    hondaCar.stop();

    toyotaCar.start();
    toyotaCar.displayInfo();
    toyotaCar.displayInformation();
    toyotaCar.yom();
    toyotaCar.stop();
    
    //storing in parent class reference variable- we can also store the child class object in a parent class reference variable. This is called upcasting. When we upcast, we can only access the properties and methods of the parent class, and we cannot access the properties and methods of the child class.
    let car1: Car = new Honda("Honda Accord", "Black", "Sedan", 2019); // upcasting
    let car2: Car = new Toyota("Toyota Corolla", "White", "Sedan", 2022); // upcasting

    console.log("Car 1 Information:");
    console.log(`Name: ${car1.name}`); // used template literals to display the name of the car, template literals are enclosed in backticks (`) and can contain placeholders for variables or expressions, which are indicated by the ${} syntax. In this case, we are using a template literal to display the name of the car by accessing the name property of the car1 object.
    console.log(`Color: ${car1.color}`);
    console.log(`Model: ${car1.model}`);
    // console.log(`Year: ${car1.year}`); // Error: Property 'year' does not exist on type 'Car'

    car1.start(); // Honda is starting... (calls the overridden method in the Honda class) why? because the start method is overridden in the Honda class, and when we call the start method on the car1 object, it will call the start method of the Honda class instead of the Car class. This is because of polymorphism, which allows us to use a parent class reference variable to refer to a child class object and call the overridden methods of the child class. In this case, even though car1 is of type Car, it is actually an instance of the Honda class, so it will call the start method of the Honda class.
    car1.displayInformation(); // Name: Honda Accord, Color: Black, Model: Sedan (calls the method in the Car class)
    // car1.displayInfo(); // Error: Property 'displayInfo' does not exist on type 'Car'

    console.log("Car 2 Information:");
    console.log(`Name: ${car2.name}`);
    console.log(`Color: ${car2.color}`);
    console.log(`Model: ${car2.model}`);
    // console.log(`Year: ${car2.year}`); // Error: Property 'year' does not exist on type 'Car'

    car2.start(); // Toyota is starting... (calls the overridden method in the Toyota class)
    car2.displayInformation(); // Name: Toyota Corolla, Color: White, Model: Sedan (calls the method in the Car class)
    // car2.displayInfo(); // Error: Property 'displayInfo' does not exist on type 'Car'    

    // downcasting- we can also downcast the parent class reference variable to the child class reference variable. This is called downcasting. When we downcast, we can access the properties and methods of the child class, but we need to use a type assertion to tell the compiler that we are sure that the object is of the child class type.
    let hondaCar2 = car1 as Honda; // downcasting
    let toyotaCar2 = car2 as Toyota; // downcasting

    console.log("Honda Car 2 Information:");
    console.log(`Name: ${hondaCar2.name}`);
    console.log(`Color: ${hondaCar2.color}`);
    console.log(`Model: ${hondaCar2.model}`);
    console.log(`Year: ${hondaCar2.year}`);

    hondaCar2.start(); // Honda is starting... (calls the overridden method in the Honda class)
    hondaCar2.displayInfo(); // Year: 2019 (calls the method in the Honda class)

    console.log("Toyota Car 2 Information:");
    console.log(`Name: ${toyotaCar2.name}`);
    console.log(`Color: ${toyotaCar2.color}`);
    console.log(`Model: ${toyotaCar2.model}`);
    console.log(`Year: ${toyotaCar2.year}`);

    toyotaCar2.start(); // Toyota is starting... (calls the overridden method in the Toyota class)
    toyotaCar2.displayInfo(); // Year: 2022 (calls the method in the Toyota class)      
    