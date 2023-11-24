import { Head } from "$fresh/runtime.ts";

// import { HandlerContext } from "$fresh/server.ts";

// // Jokes courtesy of https://punsandoneliners.com/randomness/programmer-jokes/
// const JOKES = [];

// export const handler = (_req: Request, _ctx: HandlerContext): Response => {
//   const randomIndex = Math.floor(Math.random() * JOKES.length);
//   const body = JOKES[randomIndex];
//   return new Response(body);
// };
// import { PageProps } from "$fresh/server.ts";

// export default function Greet(props: PageProps) {
//   return <div>Hello {props.params.name}</div>;
// }

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="px-4 py-8 mx-auto bg-[#86efac]">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            class="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
          <h1 class="text-4xl font-bold">404 - Page not found</h1>
          <p class="my-4">
            The page you were looking for doesn't exist.
          </p>
          <a href="/" class="underline">Go back home</a>
        </div>
      </div>
    </>
  );
}
