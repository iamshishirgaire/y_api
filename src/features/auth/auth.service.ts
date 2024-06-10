import axios from "axios";
import { GoogleTokenResponse } from "./auth.types";

export class AuthService {
  public async login(): Promise<void> {
    // Your logic here
  }

  public async signup(): Promise<void> {
    // Your logic here
  }

  public async forgotPassword(): Promise<void> {
    // Your logic here
  }

  public async verifyGoogleToken(token: string) {
    try {
      const oauthGoogleUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
      const { data } = await axios.get<GoogleTokenResponse>(oauthGoogleUrl, {
        responseType: "json",
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
