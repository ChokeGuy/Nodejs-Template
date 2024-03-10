import jwt, { JwtPayload } from "jsonwebtoken";
import redisConnection from "./redisConnect";

const accessTokenSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET || "";
const refreshTokenSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET || "";
export const accessTokenExpiration = 60 * 60; // 1 hours in seconds
export const refreshTokenExpiration = 24 * 60 * 60; // 1 days in seconds

export async function createTokens(
  payload: any,
  onlyAccessToken: boolean = false
): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = jwt.sign(payload, accessTokenSecretKey, {
    expiresIn: accessTokenExpiration,
  });
  if (onlyAccessToken) {
    return { accessToken, refreshToken: "" };
  }
  const refreshToken = jwt.sign(payload, refreshTokenSecretKey, {
    expiresIn: refreshTokenExpiration,
  });
  return { accessToken, refreshToken };
}

export function isAccessTokenExpired(token: string): boolean {
  try {
    jwt.verify(token, accessTokenSecretKey);
    return false;
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      return true;
    }
  }
  return false; // Add a default return value
}

export async function resetTokenIfExpired(
  accessToken: string,
  refreshToken: string
): Promise<string | { accessToken: string; refreshToken: string }> {
  if (isAccessTokenExpired(accessToken)) {
    const decoded = jwt.decode(refreshToken);
    if (decoded) {
      const newAccessToken = await createTokens(decoded);
      return newAccessToken;
    }
  }
  return accessToken;
}

export function isAccessTokenValid(token: string): boolean {
  try {
    jwt.verify(token, accessTokenSecretKey);
    return true;
  } catch (error: unknown) {
    return false;
  }
}

export function isRefreshTokenValid(token: string): boolean {
  try {
    jwt.verify(token, refreshTokenSecretKey);
    return true;
  } catch (error: unknown) {
    return false;
  }
}

export function getCredentialsFromAccessToken(
  accessToken: string
): JwtPayload & { userId: string; username: string; role: string } {
  try {
    const credentials = jwt.verify(
      accessToken,
      accessTokenSecretKey
    ) as JwtPayload & {
      userId: string;
      username: string;
      role: string;
    }; // Cast credentials as JwtPayload
    return credentials;
  } catch (error: unknown) {
    throw new Error("Invalid access token");
  }
}

export function getCredentialsFromRefreshToken(
  refreshToken: string
): JwtPayload & { userId: string; username: string; role: string } {
  try {
    const credentials = jwt.verify(
      refreshToken,
      refreshTokenSecretKey
    ) as JwtPayload & {
      userId: string;
      username: string;
      role: string;
    }; // Cast credentials as JwtPayload
    return credentials;
  } catch (error: unknown) {
    throw new Error("Invalid refresh token");
  }
}

export async function addTokenToBlacklist(
  token: string,
  userId: string,
  expirationTime: number | undefined
): Promise<void> {
  const result = await redisConnection();
  // Kiểm tra nếu expirationTime không được đưa ra, sử dụng giá trị mặc định
  const expiry = expirationTime || accessTokenExpiration;

  // Tạo một số ngẫu nhiên để tránh trường hợp key bị trùng lặp
  const randomNumber = Math.floor(Math.random() * 999999999) + 1;

  await result.set("blacklisted:" + randomNumber, token, { EX: expiry }); // Set thời gian tồn tại cho key dựa trên expirationTime
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  try {
    const result = await redisConnection();
    const keys = await result.keys("blacklisted:*"); // Lấy tất cả các key bắt đầu bằng "blacklisted:"
    for (let key of keys) {
      const blacklistedToken = await result.get(key); // Lấy token từ key
      if (blacklistedToken === token) {
        return true; // Nếu token tồn tại trong blacklist, trả về true
      }
    }
  } catch (error) {
    // Xử lý lỗi
    console.log(error);
  }
  return false; // Nếu không tìm thấy token trong blacklist, trả về false
}
