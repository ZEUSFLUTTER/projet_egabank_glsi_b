export const API_ENDPOINT = 'http://localhost:8080/api/';

//users endpoints
export const LOGIN_ENDPOINT = API_ENDPOINT + 'users/login';
export const REGISTER_CAISSIER_ENDPOINT = API_ENDPOINT + "users/caissier";
export const REGISTER_GESTIONNAIRE_ENDPOINT = API_ENDPOINT + "users/gestionnaire";
export const ACTIVE_USERS_ENDPOINT = API_ENDPOINT + "users/userActif";
export const INACTIVE_USERS_ENDPOINT = API_ENDPOINT + "users/userInactif";
export const ACTIVATE_USERS_ENDPOINT = (matricule: string) => API_ENDPOINT + "users/active/" + matricule;
export const DESACTIVATE_USERS_ENDPOINT = (matricule: string) => API_ENDPOINT + "users/desactive/" + matricule;

//account endpoints
export const CREATE_ACCOUNT_NEW_ENDPOINT = API_ENDPOINT + "account/newAccountClient";
export const CREATE_ACCOUNT_EXISTING_CLIENT_ENDPOINT = API_ENDPOINT + "account/oldAccountClient";
export const ACCOUNT_CLIENT_DETAIL2_ENDPOINT = (accountNumber: string) => API_ENDPOINT + "account/detail2/" + accountNumber;
export const ACCOUNT_LIST_ACTIVE_ENDPOINT = API_ENDPOINT + "account/findAllActif";
export const ACCOUNT_LIST_INACTIVE_ENDPOINT = API_ENDPOINT + "account/findAllInActif";
export const DELETE_ACCOUNT_ENDPOINT = (accountNumber: string) => API_ENDPOINT + "account/delete/" + accountNumber;



//transaction endpoints
export const DEPOSIT_ENDPOINT = API_ENDPOINT + "transaction/depot";
export const WITHDRAWAL_ENDPOINT = API_ENDPOINT + "transaction/retrait";
export const TRANSFER_ENDPOINT = API_ENDPOINT + "transaction/transfert";
export const TRANSACTION_HISTORY_ENDPOINT = API_ENDPOINT + "transaction/historique";

export const TELECHARGE_RELEVEE_ENDPOINT = API_ENDPOINT + "doc/historique/pdf";

//client endpoints
export const DETAIL_CLIENT_ENDPOINT = (email: string) => API_ENDPOINT + 'client/details/' + email;
export const ACTIVE_CLIENTS_ENDPOINT = API_ENDPOINT + "client/clientActif";
export const INACTIVE_CLIENTS_ENDPOINT = API_ENDPOINT + "client/clientInactif";
export const DELETE_CLIENT_ENDPOINT = (codeClient: string) => API_ENDPOINT + "client/delete/" + codeClient;
export const MODIFIY_CLIENT_ENDPOINT = (codeClient : string) => API_ENDPOINT + "client/modifier/" + codeClient;