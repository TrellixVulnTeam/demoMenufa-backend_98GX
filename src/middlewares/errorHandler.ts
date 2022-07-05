import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).send({
    error: "Internal Server Error",
  });
  console.error("* Error", err.stack, "* Request", req.body);
  next(err);
};
