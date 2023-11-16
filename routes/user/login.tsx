import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import bcrypt from "npm:bcryptjs";
import { LoginRequest, User, createUser, getUser } from "../../database/database.tsx";

export const handler: Handlers = {
    async POST(req, _ctx) {
        const result: LoginRequest = JSON.parse(await req.text());
        let user = await getUser(result) as User|null;
        if (user) {
            if (!await bcrypt.compare(result.password, user.password)) {
                console.log("Wrong PWd");
                return new Response(null, {
                    status: 401,
                    statusText: "Unauthorized"
                });
            }
        } else user = await createUser(result);
        const headers = new Headers();
        setCookie(headers, {
            name: "authToken",
            value: user.token,
            maxAge: 1209600,
            sameSite: 'Lax',
            path: "/"
        });
        return new Response(null, {headers});
    },
}