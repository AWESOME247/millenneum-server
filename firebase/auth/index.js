const jwt = require("jsonwebtoken");

const config = process.env;

const auth = async (req, res, next) => {
  const userToken = req.headers.authorization.split('Bearer ')[1];

  try {
    const allowedMethods = ["GET", "POST"];

    if (!allowedMethods.includes(req.method)) {
      res.status(405).send(`${req.method} not allowed.`);
    }

    if (userToken) { // Check if userToken and userCookie.token exist
      jwt.verify(userToken, config.TOKEN);
    } else {
      throw new Error('Token not found in cookies.'); // Throw an error if the token is not found
    }
  } catch (e) {
    console.log(e);
    if (e instanceof jwt.JsonWebTokenError) {
      console.log(e);
      return res.send({ error: 'Token has expired!'});
    }
    return res.send({ error: 'Token has expired!' });
  }
  return next();
};

module.exports = auth;
