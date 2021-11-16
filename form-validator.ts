const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class FormValidator{
    errors: string[] = [];

    isString(inputStr: any, niceName: string, minLength: number = 0, maxLength: number = 0, isEmail: boolean = false){
        if (typeof inputStr !== "string"){
            this.errors.push(`The field "${niceName}" contains a type error: Expected string, got ${typeof inputStr}`);
            return;
        }

        if (minLength > 0){
            if (inputStr.length < minLength){
                this.errors.push(`The field "${niceName}" must contain at least ${minLength} characters`);
                return;
            }
        }

        if (maxLength > 0){
            if (inputStr.length > maxLength){
                this.errors.push(`The field "${niceName}" must not contain more than ${minLength} characters`);
                return;
            }
        }

        if (isEmail === true){
            if (re.test(inputStr) === false){
                this.errors.push(`The field "${niceName}" must not contain more than ${minLength} characters`);
                return;
            }  
        }
    }

}