import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

// Home
export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.send(`Error: ${error}`);
  }
};

// Watch Video
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  } else {
    return res.render("watch", { pageTitle: video.title, video });
  }
};

// Upload Video
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id: id },
    },
    files: { video, thumb },
    body: { title, description, hashtags },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(id);
    user.videos.unshift(newVideo._id);
    user.save();
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
  return res.redirect("/");
};

// Edit Video
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id: loggedInUser },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(loggedInUser)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  return res.render("edit-video", {
    pageTitle: `Editing: ${video.title}`,
    video,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id: loggedInUser },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(loggedInUser)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

// Delete Video
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id: loggedInUser },
  } = req.session;
  const video = await Video.findById(id);
  const user = await User.findById(loggedInUser);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(loggedInUser)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  // clean user DB
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

// Search Video
export const search = async (req, res) => {
  let videos = [];
  const { keyword } = req.query;
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

// Count View
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

// Comments
export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: video._id,
  });
  return res.sendStatus(201);
};
