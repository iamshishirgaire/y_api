
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { reportSchema } from "./report.schema";
import { onErrorMsg } from "../../utils/zodValidationMessage";
export const reportRoute = new Hono();

reportRoute
  .get("/",zValidator("param",reportSchema,onErrorMsg) ,(c) => {
    return c.json({
      message: "report GET ROUTE",
      
    });
  })
  .post("/", (c) => {
    return c.json({
      message: "report POST ROUTE",
    });
  })
  .patch("/", (c) => {
    return c.json({
      message: "report PATCH ROUTE",
    });
  });

