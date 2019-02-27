var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function (
  req,
  res
) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

//Comments Create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function (
  req,
  res
) {
  var comment = req.body.comment;

  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(comment, function (err, newComment) {
        if (err) {
          console.log(err);
        } else {
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          newComment.save();
          campground.comments.push(newComment);
          campground.save();
          req.flash("success", "Comment Successfully Added!");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//COMMENT EDIT ROUTE
router.get(
  "/campgrounds/:id/comments/:comment_id/edit",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      res.render("comments/edit", {
        campground_id: req.params.id,
        comment: foundComment
      });
    });
  }
);

//COMMENT UPDATE
router.put(
  "/campgrounds/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
      err,
      updatedComment
    ) {
      if (err) {
        res.redirect("back");
      } else {
        req.flash("success", "Successfully Updated Comment!");
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  }
);

//DESTROY COMMENT
router.delete(
  "/campgrounds/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
      if (err) {
        res.redirect("/campgrounds/" + req.params.id);
      } else {
        req.flash("success", "Comment Deleted!");
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  }
);

module.exports = router;
