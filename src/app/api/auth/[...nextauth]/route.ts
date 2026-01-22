import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth, {
  AuthValidity,
  BackendAccessJWT,
  BackendJWT,
  DecodedJWT,
  User,
  UserObject,
} from "next-auth";
import type { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import config from "@/config";
import { ENUM_PROVIDER } from "@/enums/ProviderEnum";
import { jwtDecypherAndUserInfoProvider } from "@/helpers/JWTDeccypherAndInfoProvider";

async function refreshAccessToken(
  nextAuthJWTCookie: JWT,
  trigger?: string,
): Promise<JWT> {
  try {
    // Get a new access token from backend using the refresh token

    const res = await axios
      .post(
        `${config.server_url}/auth/refresh-token`,
        {},

        {
          headers: {
            authorization: nextAuthJWTCookie.data.tokens.refreshToken,
          },
        },
      )
      .catch((err) => {
        if (err?.response?.data?.message)
          throw Error(err.response.data.message);
        else throw Error(err);
      });

    const accessToken: BackendAccessJWT = await res.data?.data?.accessToken;
    const { exp, ...rest }: DecodedJWT = jwtDecode(
      accessToken as unknown as string,
    );

    // Update the token and validity in the next-auth cookie

    if (trigger == "update") {
      nextAuthJWTCookie.data.user = rest;
    }
    nextAuthJWTCookie.data.validity.valid_until = exp;
    nextAuthJWTCookie.data.tokens.accessToken =
      accessToken as unknown as string;

    return nextAuthJWTCookie;
  } catch (error) {
    console.error(error);
    console.debug(error);
    return {
      ...nextAuthJWTCookie,
      error: "RefreshAccessTokenError",
    };
  }
}

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Login",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios
            .post(`${config.server_url}/auth/login`, {
              email: credentials?.email,
              password: credentials?.password,
              provider: ENUM_PROVIDER.LOCAL,
            })
            .catch((err) => {
              if (err?.response?.data?.message)
                throw Error(err.response.data.message);
              else throw Error(err);
            });

          const tokens: BackendJWT = await res?.data?.data;

          // Return the object that next-auth calls 'User'
          // (which we've defined in next-auth.d.ts)

          const { user, validity, decodedRefresh } =
            jwtDecypherAndUserInfoProvider(tokens);
          console.log(user);
          return {
            // User object needs to have a string id so use refresh token id
            id: decodedRefresh.jti,
            tokens: tokens,
            user: user,
            validity: validity,
          } as User;
        } catch (error) {
          throw Error("Authentication error" + error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl)
        ? Promise.resolve(url)
        : Promise.resolve(baseUrl);
    },
    async jwt({
      token,
      user,
      account,
      profile,
      session,
      trigger,
    }): Promise<JWT> {
      if (trigger == "update") {
        console.log("Updating user info");
        return await refreshAccessToken(token, trigger);
      }
      if (
        account?.provider == "google" &&
        (trigger == "signUp" || trigger == "signIn")
      ) {
        try {
          // Getging the token form server
          const result = await axios
            .post(`${config.server_url}/user/user-sign-up`, {
              provider: ENUM_PROVIDER.GOOGLE as string,
              idToken: account.id_token,
            })
            .catch((err) => {
              if (err?.response?.data?.message)
                throw Error(err.response.data.message);
              else throw Error(err);
            });

          const { user, validity, decodedRefresh } =
            jwtDecypherAndUserInfoProvider(result?.data?.data);

          return {
            ...token,
            id: decodedRefresh.jti,
            data: {
              tokens: result?.data?.data,
              user: user,
              validity: validity,
              id: decodedRefresh.jti as string,
            },
          };
        } catch (error) {
          throw Error(error as string);
        }
      }

      // // Initial signin contains a 'User' object from authorize method
      if (user && account && account.provider !== "google") {
        console.debug("Initial signin");
        console.log("token", token);
        console.log("user", user);
        return { ...token, data: user };
      }

      if (
        token?.data?.tokens?.refreshToken &&
        !token.data?.tokens?.accessToken &&
        Date.now() < token.data.validity?.refresh_until * 1000
      ) {
        console.debug("Access token is being refreshed");
        return await refreshAccessToken(token);
      }
      // The current access token is still valid
      if (Date.now() < token.data.validity?.valid_until * 1000) {
        console.debug("Access token is still valid");
        return token;
      }

      // The refresh token is still valid
      if (Date.now() < token.data.validity?.refresh_until * 1000) {
        console.debug("Access token is being refreshed");
        return await refreshAccessToken(token);
      }

      // The current access token and refresh token have both expired
      // This should not really happen unless you get really unlucky with
      // the timing of the token expiration because the middleware should
      // have caught this case before the callback is called
      console.debug("Both tokens have expired");
      return { ...token, error: "RefreshTokenExpired" } as JWT;
    },
    async session({ session, token, trigger }) {
      if (trigger == "update") {
        console.debug("from session");
      }
      session.user = token.data.user;
      session.validity = token.data.validity;
      session.error = token.error;
      session.token = token.data.tokens?.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
