export interface IAuthService {
  register(email: string, password: string, name: string): Promise<any>;
  login(email: string, password: string): Promise<any>;
}
