import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthValidity, DecodedJWT, UserObject } from "next-auth";

export const jwtDecypherAndUserInfoProvider = (tokens: {
  refreshToken: string;
  accessToken: string;
}): {
  user: UserObject;
  validity: AuthValidity;
  decodedRefresh: JwtPayload;
  decodedAccess: JwtPayload;
} => {
  const access: DecodedJWT = jwtDecode(tokens.accessToken);
  const refresh: DecodedJWT = jwtDecode(tokens.refreshToken);
  const user: UserObject = {
    username: access?.username,
    email: access?.email,
    _id: access?._id,
    role: access?.role,
    uuid: access?.uuid,
    status: access?.status,
    emailVerifiedAt: access?.emailVerifiedAt,
  };

  if (Object.hasOwn(access, "branch")) {
    user.branch = access?.branch;
  }
  const validity: AuthValidity = {
    valid_until: access.exp,
    refresh_until: refresh.exp,
  };

  return {
    user,
    validity,
    decodedRefresh: refresh,
    decodedAccess: access,
  };
};
