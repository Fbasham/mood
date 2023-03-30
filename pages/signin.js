import { getServerSession } from "next-auth";
import {
  getProviders,
  signIn,
  getCsrfToken,
  useSession,
} from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";

export default function signin({ providers, csrfToken }) {
  let session = useSession();
  console.log(session);

  return (
    <main className="flex flex-col items-center justify-center h-[100vh]">
      <div className="w-[25%] bg-blue-100 p-10 space-y-10">
        <h1 className="text-2xl font-bold">Sign into Mood </h1>
        <div className="mt-5 space-y-5">
          {Object.values(providers).map(
            (p) =>
              p.name !== "Credentials" && (
                <button
                  className="py-2 px-4 bg-rose-700 text-white hover:bg-rose-900 rounded block"
                  onClick={() => signIn(p.id)}
                  key={p.id}
                >
                  Sign in with {p.name}
                </button>
              )
          )}
        </div>
        <form
          method="post"
          action="/api/auth/callback/credentials"
          className="flex flex-col gap-4"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label className="flex flex-col font-semibold">
            Username
            <input
              name="username"
              type="text"
              className="py-1 px-2 font-normal"
            />
          </label>
          <label className="flex flex-col font-semibold">
            Password
            <input
              name="password"
              type="password"
              className="py-1 px-2 font-normal"
            />
          </label>
          <button
            type="submit"
            className="w-1/2 bg-rose-700 text-white hover:bg-rose-900 rounded block mx-auto mt-2"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}

export async function getServerSideProps(ctx) {
  let session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  let providers = await getProviders();
  return {
    props: { providers, csrfToken: await getCsrfToken(ctx) },
  };
}
