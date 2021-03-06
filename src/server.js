import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views/pages");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // parse text
// app.use((req, res, next) => {
//   res.header("Cross-Origin-Embedder-Policy", "require-corp");
//   res.header("Cross-Origin-Opener-Policy", "same-origin");
//   next();
// });
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Send cookie to browser from backend(Server)
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    // 세션 만료날짜 설정하도록
    resave: false,
    // session이 변경된 경우에만 생성하고, 쿠키를 전달하도록
    // 로그인한 경우에만 가능하도록
    saveUninitialized: false,
    // cookie: {
    //   maxAge: 5000,
    // },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
// app.use("/convert", express.static("node_modules/@ffmpeg/core/dist"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;
