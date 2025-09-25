const express = require("express");
const router = express.Router();
//const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAuthor } = require("../middleware");

const reviewController = require("../controllers/reviews")

//CREATE reviews
router.post("/:id/reviews",
    isLoggedIn,
    wrapAsync(reviewController.createReview)
);

//DELETE review 
router.delete("/:id/reviews/:reviewId",
    isLoggedIn,
    isAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;