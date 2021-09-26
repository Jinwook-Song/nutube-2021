import Video from "../models/Video";

// Home
export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.send(`Error: ${error}`);
  }
};

// Watch Video
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
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
  const file = req.file;
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      fileUrl: file.path,
      hashtags: Video.formatHashtags(hashtags),
    });
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
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit-video", {
    pageTitle: `Editing: ${video.title}`,
    video,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

// Delete Video
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findOneAndDelete(id);
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
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
