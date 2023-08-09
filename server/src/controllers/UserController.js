const jwt = require("jsonwebtoken");
const config = require("../config/config");

const { serializeUser } = require("../schemas/user");

const { createUser, fetchUser } = require("../services/UserService");

function jwtSignUser(user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK,
  });
}

module.exports = {
  async register(req, res) {
    try {
      const { email, password, name, surname, gender } = req.body;

      const existingUser = await fetchUser({ where: { email: email } });

      if (existingUser) {
        return res.status(409).send({
          error: `User with email ${email} already exists.`,
        });
      }

      const newUser = await createUser({
        email,
        password,
        name,
        surname,
        gender,
      });

      return res.send(serializeUser(newUser));
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ error: `An error occured while saving the user ${email}` });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await fetchUser({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(404).send({
          error: "User does not exist",
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(403).send({
          error: "The login information is incorrect",
        });
      }

      const userJson = user.toJSON();
      res.send({
        user: userJson,
        token: jwtSignUser(userJson),
      });
    } catch (err) {
      res.status(500).send({
        error: "Invalid login information!",
      });
    }
  },
};
