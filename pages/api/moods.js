import dbConnect from "../../lib/dbConnect";
import Mood from "../../models/Mood";

export default async function handler(req, res) {
  await dbConnect();

  let from = new Date(req.query.from);
  let to = new Date(req.query.to);
  let moods = await Mood.find({ date: { $gte: from, $lte: to } }).sort({
    date: 1,
  });

  let r = [];
  for (let i = 0; i <= (to - from) / 86400000 + 1; i++) {
    let d = new Date(
      from.getUTCFullYear(),
      from.getUTCMonth(),
      from.getUTCDate()
    );
    d.setDate(d.getDate() + i);
    let mood = moods.find((m) => m.date.toISOString() === d.toISOString());
    if (mood) r.push(mood);
    else r.push({ date: d });
    if (i >= 365) break;
  }

  res.json(r);
}
