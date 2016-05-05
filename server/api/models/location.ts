import mongoose = require("mongoose");

export interface LocationDocument extends mongoose.Document {
  name: string;
  image: string;
  count: number;
}

let locationSchema = new mongoose.Schema({
  name: String,
  image: String,
  count: Number,
});

export const Location = mongoose.model<LocationDocument>("Location", locationSchema);
