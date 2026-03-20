import mongoose from "mongoose";

const catererSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    pricePerPlate: {
      type: Number,
      required: true,
      min: 1
    },
    cuisines: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one cuisine is required."
      }
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

catererSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

const Caterer = mongoose.model("Caterer", catererSchema);

export default Caterer;
