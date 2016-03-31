import mongoose = require("mongoose");

export interface ILocation extends mongoose.Document {
  name: string;
  rooms: {
    name: string;

    imagePath: string;
  }[];
}

let locationSchema = new mongoose.Schema({
  name: String,
  rooms: [{
    name: String,
    imagePath: String
  }]
});

export const Location = mongoose.model<ILocation>('Location', locationSchema);
