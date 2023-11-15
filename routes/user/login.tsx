import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import bcrypt from "npm:bcryptjs";
import { LoginRequest, User, createUser, getUser } from "../../database/database.tsx";

export const handler: Handlers = {
    async POST(req, _ctx) {
        console.log('a')
        // Mongo Collection to use
        console.log(req, _ctx);
        const result: LoginRequest = JSON.parse(await req.text());
        console.log(result)
        let user = await getUser(result) as User|null;
        if (user) {
            console.log('User Exists');
            if (!await bcrypt.compare(result.password, user.password)) {
                console.log("Wrong PWd");
                return new Response(null, {
                    status: 401,
                    statusText: "Unauthorized"
                });
            }
        } else user = await createUser(result);
        const headers = new Headers();
        headers.set("location", "/play");
        const url = new URL(req.url);
        setCookie(headers, {
            name: "authToken",
            value: user.token,
            secure: true,
            maxAge: 1209600,
            httpOnly: true,
            sameSite: 'Strict',
            domain: url.hostname,
        });
        console.log(user, headers);
        return new Response(null, {
          status: 303,
          headers,
        });
    },
}