import { AbstractControl, ValidationErrors } from "@angular/forms";

export function convertToUppercase(control: AbstractControl): ValidationErrors | null{
    const userName: string = control.value as string;

    if(userName !== userName.toUpperCase()){
        control.setValue(userName.toUpperCase());
    }

    return null;
}

export function urlValidator(control: AbstractControl): ValidationErrors | null{
    const domainExt = ['.com', '.in', '.me', '.org'];

    if(!control.value.startWith('https://')){
        return {urlValid: true}
    }

    const checkExtension = domainExt.some((ext) =>{
        control.value.includes(ext)
    })

    if(!checkExtension){
        return {urlValid: true}
    }

    return null;
}


//Use
//name : ['', [Validators.required, convertToUppercase]]