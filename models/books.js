const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    kind: { type: String, default: "books#volume" },
    id: { type: String, required: true },
    etag: { type: String },
    volumeInfo: {
      title: { type: String, required: true },
      authors: [{ type: String }],
      description: { type: String },
      publishedDate: { type: String },
      imageLinks: {
        thumbnail: { type: String },
      },
      industryIdentifiers: [
        {
          type: { type: String },
          identifier: { type: String },
        },
        { _id: false },
      ],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
