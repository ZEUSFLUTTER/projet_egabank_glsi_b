export class Client {
    codeClient? : string ;
    lastName? : string ;
    firstName? : string ;
    dateOfbirth? : Date ;
    gender? : string ;
    address? : string ;
    phoneNumber? : string ;
    email? : string ;
    nationality? : string ;

    constructor(data?: Partial<Client> ) {
        if (data) {
            Object.assign(this, data)
        }
    }
}