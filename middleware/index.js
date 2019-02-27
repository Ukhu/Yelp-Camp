var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleWareObject = {};

middleWareObject.checkCampgroundOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        req.flash("error", "Campground Not Found!");
        res.redirect("back");
      } else {
        if (foundCampground.creator.id.equals(req.user.id)) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that!");
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    });
  } else {
    req.flash("error", "Please Login First!");
    res.redirect("/login");
  }
};

middleWareObject.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        req.flash("error", "Comment Not Found!");
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user.id)) {
          next();
        } else {
          req.flash("error", "You do not have permission to do that!");
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    });
  } else {
    req.flash("error", "Please Login First!");
    res.redirect("/login");
  }
};

middleWareObject.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login First!");
  res.redirect("/login");
};

module.exports = middleWareObject;
