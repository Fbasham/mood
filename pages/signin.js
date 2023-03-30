import { getServerSession } from "next-auth";
import { getProviders, signIn, getCsrfToken } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";

export default function signin({ providers, csrfToken }) {
  return (
    <main className="flex flex-col items-center justify-center h-[100vh]">
      <div className="w-1/2 bg-blue-100 p-10">
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
        <form method="post" action="/api/auth/callback/credentials">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label>
            Username
            <input name="username" type="text" />
          </label>
          <label>
            Password
            <input name="password" type="password" />
          </label>
          <button type="submit">Sign in</button>
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
