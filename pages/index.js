import { signIn, signOut, getSession } from "next-auth/react";
import { useState } from "react";
import MoodForm from "../components/MoodForm";
import dbConnect from "../lib/dbConnect";
import Mood from "../models/Mood";

let colours = ["bg-white", "bg-green-500", "bg-yellow-500", "bg-red-500"];

export default function Home({ target, moods: moodz, first }) {
  let [date, setDate] = useState(new Date(target));
  let [mood, setMood] = useState(target);
  let [moods, setMoods] = useState(moodz);
  let [editing, setEditing] = useState(false);

  let currentYear = new Date().getUTCFullYear();
  let years = Array.from(
    { length: currentYear - first + 1 },
    (_, i) => currentYear - i
  );

  function handleMoodClick(mood) {
    setEditing(false);
    setDate(new Date(mood.date));
    setMood(mood);
  }

  async function handleChangeYear(year) {
    // let res = await fetch(`/api/moods?from=${year}-01-01&to=${year}-12-31`);
    // let moods = await res.json();
    // setMoods(moods);
    window.location = `/?from=${year}-01-01&to=${year}-12-31`;
  }

  return (
    <div className="mx-10">
      <button onClick={() => signIn()}>Sign In</button>
      <button onClick={() => signOut({ callbackUrl: "/signin" })}>
        Sign Out
      </button>
      <h1 className="text-2xl font-bold">Mood</h1>
      <div className="grid grid-rows-7 grid-flow-col gap-[2.5px] overflow-x-auto p-1 max-w-fit">
        {moods.map((mood, i) => (
          <div className="relative group flex" key={i}>
            <button
              onClick={() => handleMoodClick(mood)}
              className={`w-[12px] h-[12px] border border-black rounded-[2px] ${
                colours[mood.feeling ?? 0]
              }`}
            ></button>
            <p className="w-20 group-hover:block hidden absolute left-5 z-10 bg-slate-900 text-white text-xs p-1 rounded">
              {mood.date.slice(0, 10)}
            </p>
          </div>
        ))}
      </div>
      <div className="mb-5">
        {years.map((year) => (
          <div key={year}>
            <button
              className="bg-[#d1d1d1] rounded px-1 text-xs"
              onClick={() => handleChangeYear(year)}
            >
              {year}
            </button>
          </div>
        ))}
      </div>
      <div className="w-1/2 space-y-2">
        <button
          onClick={() => setEditing(true)}
          className="px-1 bg-gray-300 rounded text-sm"
        >
          edit
        </button>
        {editing ? (
          <MoodForm
            mood={mood}
            moods={moods}
            date={date}
            setEditing={setEditing}
            setMoods={setMoods}
          />
        ) : (
          <>
            <div>
              <h2 className="font-bold">Date</h2>
              <div>{mood?.date}</div>
            </div>
            <div>
              <h2 className="font-bold">Feeling</h2>
              <div>{mood?.feeling}</div>
            </div>
            <div>
              <h2 className="font-bold">Notes</h2>
              <div>{mood?.notes}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  let session = await getSession({ req: ctx.req });

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  await dbConnect();

  // await Mood.deleteMany();
  // for (let i = 0; i < 250; i++) {
  //   let d = new Date(2023, 2, 26);
  //   d.setDate(d.getDate() - 3 * i);
  //   await Mood.create({
  //     date: d,
  //     feeling: (Math.random() * 4) | 0,
  //     notes: d,
  //   });
  // }

  let from = ctx.query.from;
  let to = ctx.query.to;
  let target = ctx.query.target;

  target = new Date(target || new Date());
  target = new Date(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate()
  );

  to = new Date(to || new Date());
  to = new Date(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());

  if (!from) {
    from = new Date(to);
    from.setDate(from.getDate() - 365);
  } else {
    from = new Date(from);
    from = new Date(
      from.getUTCFullYear(),
      from.getUTCMonth(),
      from.getUTCDate()
    );
  }

  let res = await fetch(
    `http://localhost:3000/api/moods?from=${from.toISOString()}&to=${to.toISOString()}`
  );
  let moods = await res.json();

  return {
    props: {
      moods,
      target: JSON.parse(
        JSON.stringify(
          (await Mood.findOne({ date: { $eq: target.toISOString() } })) || {
            date: target,
          }
        )
      ),
      first: (
        await Mood.findOne().sort({ date: 1 }).limit(1)
      ).date.getUTCFullYear(),
    },
  };
}
