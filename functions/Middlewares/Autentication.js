const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req, res, next) => {
    functions.logger.log("Check if request is authorized with Firebase ID token");
  
    let idToken;
    if ((!req.headers.authorization || !req.headers.authorization.startsWith("Bearer "))) {
      functions.logger.error(
          "No Firebase ID token was passed as a Bearer token in the Authorization header.",
          "Make sure you authorize your request by providing the following HTTP header:",
          "Authorization: Bearer <Firebase ID Token>",
      );
      res.status(403).send("Unauthorized");
      return;
    } else {
        functions.logger.log("Found \"Authorization\" header");
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split("Bearer ")[1];
    }
  
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      functions.logger.log("ID Token correctly decoded", decodedIdToken);
      req.user = decodedIdToken;
      next();
      return;
    } catch (error) {
      functions.logger.error("Error while verifying Firebase ID token:", error);
      res.status(403).send("Unauthorized");
      return;
    }
  };

  module.exports = validateFirebaseIdToken;