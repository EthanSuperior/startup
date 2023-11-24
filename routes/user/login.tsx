import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import bcrypt from "npm:bcryptjs";
import {
  createUser,
  getUser,
  LoginRequest,
  User,
} from "../../database/database.tsx";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const data = await req.formData();
    const result: LoginRequest = {
      username: data.get("username")!.toString(),
      password: data.get("password")!.toString(),
    };
    let user = await getUser(result) as User | null;
    if (user) {
      if (!await bcrypt.compare(result.password, user.password)) {
        console.log("Wrong PWd");
        return new Response(null, {
          status: 401,
          statusText: "Unauthorized",
        });
      }
    } else user = await createUser(result);
    const headers = new Headers();
    headers.set("location", "/play");
    setCookie(headers, {
      name: "authToken",
      value: user.token,
      maxAge: 1209600,
      sameSite: "Lax",
      path: "/",
    });
    return new Response(null, { status: 303, headers });
  },
};
