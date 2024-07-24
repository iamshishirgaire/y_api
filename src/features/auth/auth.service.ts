import axios from "axios";
import type { GoogleTokenResponse } from "./auth.types";
import { sendEmail } from "@email/index";

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
    const oauthGoogleUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
    const { data } = await axios.get<GoogleTokenResponse>(oauthGoogleUrl, {
      responseType: "json",
    });
    return data;
  }
}
