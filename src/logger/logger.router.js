import Router from "express";

const loggerRouter = Router();

loggerRouter.get("/", (req, res) => {
  try {
    req.logger.http("DATA HTTP");
    req.logger.debug("Este es un mensaje para debug");
    req.logger.info("Este mensaje es informativo");
    req.logger.warning("Advertencia!!!");
    req.logger.error("ERROR");
    req.logger.fatal("Exploto TODO!!!");
  } catch (error) {
    req.logger.error(error);
    res.status(500).send("ALGO SALIO MAL");
  }
});

export { loggerRouter };
