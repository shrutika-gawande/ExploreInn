const Review = require("./review")
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
            default: "https://picsum.photos/800/600",
            set: v => v === "" ? "https://picsum.photos/800/600" : v,
        }
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    //reference
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

// Mongoose middleware hook that runs after a listing is deleted using findOneAndDelete to delete reviews as the post deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

// Virtual for average rating
listingSchema.virtual("avgRating").get(function () {
  if (!this.reviews || this.reviews.length === 0) return 0;
  let sum = 0;
  this.reviews.forEach(r => {
    sum += r.rating;
  });
  return (sum / this.reviews.length).toFixed(1);
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;