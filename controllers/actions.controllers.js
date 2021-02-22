const HttpError = require("../models/http-error");
const Place = require("../models/place.model");

const addComment = async (req, res, next) => {
  try {
    const { comment, userId, userName } = req.body;
    const place = await Place.findById({ _id: req.params.pid });
    if (!place) {
      return next(new HttpError("Place with this id does not exist.", 404));
    } else {
      place.comments.push({
        text: comment,
        created: 1,
        postedBy: userId,
        userName,
      });
      place.save();
      return res.status(200).json({ place: place.toObject({ getters: true }) });
    }
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

const delComment = async (req, res, next) => {
  try {
    let place = await Place.findById({ _id: req.params.pid });
    const commentId = req.body.cid;
    const uid = req.body.userId;
    if (!place) {
      return next(new HttpError("Place with this id does not exist.", 404));
    } else {
      const deleteComment = await place.comments.findIndex((comment) => {
        return (
          comment._id.toString() === commentId.toString() &&
          comment.postedBy.toString() === uid.toString()
        );
      });
      if (deleteComment !== -1) {
        await place.comments.splice(deleteComment, 1);
        place.comments = place.comments;
        await place.save();
        return res
          .status(200)
          .json({ place: place.toObject({ getters: true }) });
      }
      return next(
        new HttpError("Comment does not exist or it is not your comment.", 404)
      );
    }
  } catch (e) {
    return next(new HttpError("Server error.", 500));
  }
};

const likePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.pid,
      { $push: { likes: req.userData.userId } },
      { new: true }
    );
    return res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (e) {
    return next(new HttpError("Unable to like.", 500));
  }
};

const unlikePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.pid,
      { $pull: { likes: req.userData.userId } },
      { new: true }
    );
    return res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (e) {
    return next(new HttpError("Unable to unlike.", 500));
  }
};

module.exports = {
  likePlace,
  unlikePlace,
  addComment,
  delComment,
};
