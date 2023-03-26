import dbConnect from "../../lib/dbConnect";
import Mood from "../../models/Mood";

export default async function handler(req, res) {
  await dbConnect();

  let mood = await Mood.findOneAndUpdate(
    { date: { $eq: req.body.date } },
    req.body,
    { new: true, upsert: true }
  );
  res.json(mood);
}
