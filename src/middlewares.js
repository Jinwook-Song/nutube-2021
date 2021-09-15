export const localsMiddleware = (req, res, next) => {
  // pug can access to locals object
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Nutube";
  res.locals.loggedInUser = req.session.user;
  next();
};
