var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX ROUTE
router.get("/campgrounds", function (req, res) {
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

//CREATE ROUTE
router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var creator = {
    id: req.user._id,
    username: req.user.username
  };

  var newCampground = {
    name: name,
    image: image,
    description: desc,
    creator: creator
  };

  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      req.flash("success", "Campground Successfully Created!");
      res.redirect("/campgrounds");
    }
  });
});

//NEW ROUTE
router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//SHOW ROUTE - shows more info about one campground
router.get("/campgrounds/:id", function (req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        //render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//EDIT ROUTE - Shows form for editing campground
router.get(
  "/campgrounds/:id/edit",
  middleware.checkCampgroundOwnership,
  function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      res.render("campgrounds/edit", { campground: foundCampground });
    });
  }
);

//UPDATE ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function (
  req,
  res
) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground Updated Successfully!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DELETE ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function (
  req,
  res
) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds/" + req.params.id);
    } else {
      req.flash("success", "Campground Deleted Successfully!");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
