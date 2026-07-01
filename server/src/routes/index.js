import express from "express";
import authRouter from "./auth.js";
import insertRouter from "./insert.js";
import categoryRouter from "./category.js";
import postRouter from "./post.js";
import priceRouter from "./price.js";
import areaRouter from "./area.js";
import provinceRouter from "./province.js";
import userRouter from "./user.js";
import comment from "./comment.js";
import { notFound, errorHandler } from "../middlewares/errHandler.js";

const initRoutes = (app) => {
  const apiRouter = express.Router();

  apiRouter.use("/auth", authRouter);
  apiRouter.use("/insert", insertRouter);
  apiRouter.use("/category", categoryRouter);
  apiRouter.use("/post", postRouter);
  apiRouter.use("/price", priceRouter);
  apiRouter.use("/area", areaRouter);
  apiRouter.use("/province", provinceRouter);
  apiRouter.use("/comment", comment);
  apiRouter.use("/user", userRouter);

  // notFound và errorHandler giờ chỉ áp dụng cho các request bên trong /api/v1
  apiRouter.use(notFound);
  apiRouter.use(errorHandler);

  app.use("/api/v1", apiRouter);
};

export default initRoutes;
