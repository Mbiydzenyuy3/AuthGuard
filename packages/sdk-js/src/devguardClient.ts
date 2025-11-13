export class AuthKeyClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    console.log('AuthKeyClient initialized.');
  }

  public async login(email: string, pass: string) {
    console.log(`Logging in user ${email}...`);
    return { success: true, token: 'mock-jwt-token' };
  }

  public async signup(email: string, pass: string) {
    console.log(`Signing up user ${email}...`);
    return { success: true, userId: 'mock-user-id' };
  }
}
