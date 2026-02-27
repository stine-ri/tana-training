// In automation we need to create utility files that can be used across different projects. These utility files can contain functions, classes, or interfaces that can be reused in multiple projects. 
// To create a utility file in TypeScript, we can use modules.
//  A module is a file that contains code that can be imported and used in other files. 
// We can export functions, classes, or interfaces from a module and import them in other files to use them.
// To create a module, we can use the export keyword to export the code that we want to make available to other files. 
// We can then use the import keyword to import the code from the module in other files.

// this is a module the exportkeyword is used to export the code that we want to make available to other files.

export let appname = "Calculator";

export function add(a: number, b: number): number {
    return a + b;
}

export class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }   

}