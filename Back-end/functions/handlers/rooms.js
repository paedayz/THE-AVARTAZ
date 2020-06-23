const { db } = require("../util/admin");

exports.getAllrooms = (req, res) => {
  db.collection("rooms")
    .get()
    .then((data) => {
      let rooms = [];
      data.forEach((doc) => {
        rooms.push({
          roomId: doc.data().createdAt,
          roomName: doc.data().roomName,
        });
      });
      return res.json(rooms);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.addRoom = (req, res) => {
  if (req.body.roomName.trim() === "") {
    return res.status(400).json({ error: "Room name must not be empty" });
  }
  const newRoom = {
    roomName: req.body.roomName,
    description: req.body.description,
    createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
  };

  db.doc(`/rooms/${newRoom.roomName}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ error: "This room already created" });
      }

      return db.doc(`/rooms/${req.body.roomName}`).set(newRoom);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.deleteRoom = (req, res) => {
  db.doc(`/rooms/${req.params.room}`)
    .get()
    .then(async (doc) => {
      if (!doc.exists) {
        return res.status(400).json({ error: "Room not found" });
      }

      await doc.ref.delete();

      return db.collection("rooms").get();
    })
    .then((data) => {
      let rooms = [];
      data.forEach((doc) => {
        rooms.push({
          roomId: doc.data().createdAt,
          roomName: doc.data().roomName,
        });
      });
      return res.json(rooms);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.checkRoom = (req, res) => {
  db.doc(`/rooms/${req.params.room}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Not have this room" });
      }
      return res.json({ message: "Have this room" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
