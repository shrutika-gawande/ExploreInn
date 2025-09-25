const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const { location } = req.query;
  let allListings;

  if (location && location.trim() !== "") {
    allListings = await Listing.find({
      $or: [
        { location: { $regex: location, $options: "i" } },
        { country: { $regex: location, $options: "i" } }
      ]
    }).populate("reviews");

    if (allListings.length === 0) {
      req.flash("error", "No results found!");
      allListings = await Listing.find({}).populate("reviews");
    }
  } else {
    allListings = await Listing.find({}).populate("reviews");
  }

  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  // let listing = req.body.listing;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await newListing.save();
  req.flash("success", "New Listing Created Successfully!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //You want to update multiple fields dynamically based on user input

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};

module.exports.trending = async (req, res) => {
  try {
    // Fetch listings with reviews populated
    let trendingListings = await Listing.find({})
      .populate("reviews")
      .limit(100); // fetch more to filter later

    // Keep only listings with at least 1 review
    trendingListings = trendingListings
      .filter(listing => listing.reviews.length > 0) // ✅ filter out no ratings
      .sort((a, b) => b.avgRating - a.avgRating) // sort by avgRating
      .slice(0, 6); // top 6

    res.render("listings/index", { allListings: trendingListings });
  } catch (err) {
    req.flash("error", "Something went wrong while fetching trending listings.");
    res.redirect("/listings");
  }
};
