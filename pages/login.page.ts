import { ai } from '../helper/openAIHelper';

export class LoginPage {

  constructor(private page: any) {}

  async doLogin() {
    await ai(`User fill "username" field with "standard_user"`, this.page);
    await ai(`User fill "password" field with "secret_sauce"`, this.page);
    await ai(`User click "login" button`, this.page);
  }
}