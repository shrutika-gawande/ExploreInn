const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middleware");
const multer = require("multer");
const{storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listings");

router
.route("/") 
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image.url]"),
    wrapAsync(listingController.createListing)
);

router.get("/trending", listingController.trending); 

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id") 
.get( wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image.url]"),
    wrapAsync(listingController.updateListing)
)
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;