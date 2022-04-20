const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Favorite = require("../models/Favorite");

router.get("/favorites", authorizeUser, (req, res) => {
  Favorite.find({ user_id: req.user_id }).then((data) => {
    res.status(200).json(data);
  });
});

router.post("/favorites", authorizeUser, (req, res) => {
  const favorite = { ...req.body, user_id: req.user_id };
  Favorite.create(favorite)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(console.error);
});

router.put("/favorites/:id", authorizeUser, (req, res) => {
  Favorite.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, favorite) => {
      if (err) return res.status(500).send(err);
      return res.send(favorite);
    }
  );
});

router.delete("/favorites/:id", authorizeUser, (req, res) => {
  Favorite.findByIdAndDelete(req.params.id).then(
    res.status(204).json({ message: "Favorite deleted" })
  );
});

function authorizeUser(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ errors: ["Authorization error"] });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_id = decoded.user_id;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ errors: ["Invalid token"] });
  }
}

module.exports = router;
