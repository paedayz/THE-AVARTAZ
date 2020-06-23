const { db } = require("../util/admin");

exports.getAllScreams = (req, res) => {
  db.collection("screams")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          avatarName: doc.data().avatarName,
          createdAt: doc.data().createdAt,
          avatarImage: doc.data().avatarImage,
          roomName: doc.data().roomName,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          reportCount: doc.data().reportCount,
        });
      });
      return res.json(screams);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.postOneScream = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not empty" });
  }

  const newScream = {
    body: req.body.body,
    userName: req.user.avatarName,
    avatarImage: req.user.avatarImage,
    createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    likeCount: 0,
    commentCount: 0,
    reportCount: 0,
  };

  db.collection("screams")
    .add(newScream)
    .then((doc) => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      res.json(resScream);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

exports.getScream = (req, res) => {
  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", screamData.screamId)
        .get();
    })
    .then((data) => {
      screamData.comments = [];
      data.forEach((doc) => {
        screamData.comments.push(doc.data());
      });
      return res.json(screamData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.reportScream = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ comment: "Must not be empty" });
  }

  const newReport = {
    body: req.body.body,
    createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    avatarName: req.user.avatarName,
    avatarImage: req.user.avatarImage,
    screamId: req.params.screamId,
    room: req.body.room,
    type: "scream",
  };

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ err: "Scream not found" });
      }

      return doc.ref.update({ reportCount: doc.data().reportCount + 1 });
    })
    .then(() => {
      return db.collection("reports").add(newReport);
    })
    .then(() => {
      return res.json(newReport);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

exports.commentOnScream = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ comment: "Must not be empty" });
  }

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    avatarName: req.user.avatarName,
    avatarImage: req.user.avatarImage,
    screamId: req.params.screamId,
  };

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ err: "Scream not found" });
      }
      return doc.ref.update({
        commentCount: doc.data().commentCount + 1,
      });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

exports.postRoomScream = (req, res) => {
  if (req.body.body.trim() == "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newScream = {
    body: req.body.body,
    avatarName: req.user.avatarName,
    avatarImage: req.user.avatarImage,
    createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    likeCount: 0,
    commentCount: 0,
    reportCount: 0,
    roomName: req.params.roomName,
  };

  db.doc(`/rooms/${req.params.roomName}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Room not found" });
      }

      return db.collection("screams").add(newScream);
    })
    .then((doc) => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      res.json(resScream);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

exports.getRoomScream = (req, res) => {
  db.collection("screams")
    .where("roomName", "==", req.params.roomName)
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          avatarName: doc.data().avatarName,
          createdAt: doc.data().createdAt,
          avatarImage: doc.data().avatarImage,
          roomName: doc.data().roomName,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          reportCount: doc.data().reportCount,
        });
      });
      return res.json(screams);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.likeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("avatarName", "==", req.user.avatarName)
    .where("screamId", "==", req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Scream not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            screamId: req.params.screamId,
            avatarName: req.user.avatarName,
          })
          .then(() => {
            screamData.likeCount++;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return res.json(screamData);
          });
      } else {
        return res.status(400).json({ error: "Scream already like" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("avatarName", "==", req.user.avatarName)
    .where("screamId", "==", req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(400).json({ error: "Scream not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Scream already liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            res.json(screamData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      return document.delete();
    })
    .then(() => {
      res.json({ message: "Scream deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
