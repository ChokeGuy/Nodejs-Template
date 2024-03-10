class AuthError extends Error {
  private accessToken: string;
  private refreshToken: string;

  constructor(message: string, accessToken: string, refreshToken: string) {
    super(message);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }
}

export default AuthError;
