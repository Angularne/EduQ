import mongoose = require("mongoose");

export interface LocationDocument extends mongoose.Document {
  name: string;
  imagePath: string;
  count: number;
}

let locationSchema = new mongoose.Schema({
  name: String,
  imagePath: String,
  count: Number,
});

export const Location = mongoose.model<LocationDocument>('Location', locationSchema);
