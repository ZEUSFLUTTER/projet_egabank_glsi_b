export class User {
    matricule? : string ;
    firstName? : string ;
    lastName? : string ;
    username? : string ;
    password? : string ;
    email? : string ;
    phoneNumber? : string ;
    isActive? : boolean ;

    
    constructor(data?: Partial<User> ) {
        if(data){
            Object.assign(this, data)
        }
    }
}