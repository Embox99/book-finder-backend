const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  email: {
    type: String,
    required: [true, "the email field is required"],
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
    },
  },
  password: {
    type: String,
    required: [true, "the password is required"],
    select: false,
  },
  yearOfBirth: {
    type: Number,
    require: [true, "the year of birth is required"],
    min: 1900,
    max: 2024,
    select: false,
  },
  favoriteBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  readBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("wrong email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("wrong email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
