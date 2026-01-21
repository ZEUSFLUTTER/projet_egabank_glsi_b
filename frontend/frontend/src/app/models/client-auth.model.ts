export interface ClientLoginRequest {
  courriel: string;
  password: string;
}

export interface ClientAuthResponse {
  token: string;
  type: string;
  username: string;
  role: string;
}
