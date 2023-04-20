import express from "express";
import http from "http";
const app = express();
import ArticleRouter from "./routes/ArticleRoute.js";
import UserRouter from "./routes/UserRoute.js";

app.use(express.json());
app.use("/api/v1/article", ArticleRouter);
app.use("/api/v1/user", UserRouter);

const PORT = 8000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("server started");
});
