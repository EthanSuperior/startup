import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import bcrypt from "npm:bcryptjs";
import { LoginRequest, User, createUser, getUser } from "../../database/database.tsx";

export const handler: Handlers = {
    async POST(req, _ctx) {
        // Mongo Collection to use
        const res = new Response(null);
        console.log(req);
        const result: LoginRequest = await req.json();
        let user = await getUser(result) as User|null;
        if (user) {
            if (!await bcrypt.compare(result.password, user.password)) {
                return new Response(null, {
                    status: 401,
                    statusText: "Unauthorized"
                });
            }
        } else user = await createUser(result);
        setCookie(res.headers, {
            name: "authToken",
            value: user.token,
            secure: true,
            httpOnly: true,
            sameSite: 'Strict',
        });
        return res;
    },
}