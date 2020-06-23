const { db } = require("../util/admin");

exports.getAllScreamReports = async (req, res) => {
  let reports = [];
  await db
    .collection("reports")
    .where("type", "==", "scream")
    .get()
    .then((data) => {
      data.forEach(async (doc) => {
        reports.push({
          reportId: doc.id,
          screamId: doc.data().screamId,
          from: doc.data().avatarName,
          reportDetail: doc.data().body,
          createdAt: doc.data().createdAt,
          room: doc.data().room,
          image: doc.data().avatarImage,
        });
      });
      return res.json(reports);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getAllUserReports = async (req, res) => {
  let reports = [];
  await db
    .collection("reports")
    .where("type", "==", "user")
    .get()
    .then((data) => {
      data.forEach(async (doc) => {
        reports.push({
          reportId: doc.id,
          from: doc.data().avatarName,
          reportDetail: doc.data().body,
          createdAt: doc.data().createdAt,
          image: doc.data().avatarImage,
          accused: doc.data().accused,
        });
      });
      return res.json(reports);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getAllHost = (req, res) => {
  db.collection("hosts")
    .get()
    .then((data) => {
      hosts = [];
      data.forEach((doc) => {
        hosts.push({
          avatarName: doc.data().avatarName,
          createdAt: doc.data().createdAt,
          status: doc.data().status,
          hostId: doc.id,
        });
      });
      return res.json(hosts);
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

exports.setHost = (req, res) => {
  if (req.body.status.trim() === "") {
    return res.status(400).json({ status: "Must not be empty" });
  }

  db.doc(`/users/${req.params.avatarName}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      doc.ref.update({ status: req.body.status });
      return db
        .collection("hosts")
        .where("status", "==", req.body.status)
        .limit(1)
        .get();
    })
    .then((data) => {
      data.forEach((doc) => {
        if (doc.data().status === req.body.status) {
          db.collection("users").doc(doc.id).update({ status: "user" });
          return doc.ref.delete();
        }
        return null;
      });
    })
    .then(() => {
      const newHost = {
        avatarName: req.params.avatarName,
        status: req.body.status,
        createdAt: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Bangkok",
        }),
      };
      db.doc(`hosts/${req.params.avatarName}`).set(newHost);
      return db.collection("hosts").get();
    })
    .then((data) => {
      hosts = [];
      data.forEach((doc) => {
        hosts.push({
          avatarName: doc.data().avatarName,
          createdAt: doc.data().createdAt,
          status: doc.data().status,
        });
      });
      return res.json(hosts);
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

exports.deleteHost = (req, res) => {
  db.collection("hosts")
    .where("status", "==", req.params.status)
    .limit(1)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        doc.ref.delete();
        db.collection("users").doc(doc.id).update({ status: "user" });
      });
      return db.collection("hosts").get();
    })
    .then((data) => {
      hosts = [];
      data.forEach((doc) => {
        hosts.push({
          avatarName: doc.data().avatarName,
          createdAt: doc.data().createdAt,
          status: doc.data().status,
        });
      });
      return res.json(hosts);
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

exports.banUser = (req, res) => {
  db.doc(`/users/${req.params.avatarName}`)
    .get()
    .then(async (doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      doc.ref.update({ status: "ban" });
      doc.ref.update({
        releasDate: new Date(req.body.release).toLocaleString("en-US", {
          timeZone: "Asia/Bangkok",
        }),
      });

      userData = {
        avatarName: req.params.avatarName,
        cause: req.body.cause,
        createdAt: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Bangkok",
        }),
        release: new Date(req.body.release).toLocaleString("en-US", {
          timeZone: "Asia/Bangkok",
        }),
      };

      await db
        .collection("reports")
        .where("accused", "==", req.params.avatarName)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            db.doc(`/reports/${doc.id}`).delete();
          });
        })
        .catch((err) => {
          console.error(err);
        });

      await db.doc(`/ban/${req.params.avatarName}`).set(userData);
      db.collection("hosts").doc(req.params.avatarName).delete();

      return db.collection("ban").get();
    })
    .then((data) => {
      banData = [];
      data.forEach((doc) => {
        banData.push({
          avatarName: doc.data().avatarName,
          cause: doc.data().cause,
          createdAt: doc.data().createdAt,
          release: doc.data().release,
        });
      });
      return res.json(banData);
    })
    .catch((err) => {
      return res.json({ error: err.code });
    });
};

exports.releaseUser = async (req, res) => {
  await db
    .doc(`/ban/${req.params.avatarName}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "User not ban" });
      }
      return db.doc(`/users/${req.params.avatarName}`).get();
    })
    .then(async (doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      doc.ref.update({ status: "user" });
      doc.ref.update({ releasDate: "none" });
      await db.collection("ban").doc(req.params.avatarName).delete();

      return db.collection("ban").get();
    })
    .then((data) => {
      banData = [];
      data.forEach((doc) => {
        banData.push({
          avatarName: doc.data().avatarName,
          cause: doc.data().cause,
          createdAt: doc.data().createdAt,
          release: doc.data().release,
        });
      });
      return res.json(banData);
    })
    .catch((err) => {
      return res.json({ error: err.code });
    });
};

exports.getAllBanUser = (req, res) => {
  db.collection("ban")
    .get()
    .then((data) => {
      banData = [];
      data.forEach((doc) => {
        banData.push({
          avatarName: doc.data().avatarName,
          cause: doc.data().cause,
          createdAt: doc.data().createdAt,
          release: doc.data().release,
        });
      });
      return res.json(banData);
    })
    .catch((err) => {
      return res.json({ error: err.code });
    });
};

exports.getAllAdvertise = (req, res) => {
  db.collection("advertises")
    .get()
    .then((data) => {
      const advertiseData = [];
      data.forEach((doc) => {
        advertiseData.push({
          avatarImage: doc.data().avatarImage,
          avatarName: doc.data().avatarName,
          description: doc.data().description,
          advertiseImage: doc.data().advertiseImage,
          lineId: doc.data().lineId,
          contact: doc.data().contact,
          accept: doc.data().accept,
          createdAt: doc.data().createdAt,
          advertiseId: doc.id,
        });
      });
      return res.json(advertiseData);
    })
    .catch((err) => {
      return res.json({ error: err.code });
    });
};

exports.acceptAdvertise = (req, res) => {
  db.doc(`/advertises/${req.params.advertiseId}`)
    .get()
    .then(async (doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Advertise not found" });
      }
      await doc.ref.update({ accept: true });
      return db.collection("advertises").where("accept", "==", true).get();
    })
    .then((data) => {
      const advertiseData = [];
      data.forEach((doc) => {
        advertiseData.push({
          avatarImage: doc.data().avatarImage,
          avatarName: doc.data().avatarName,
          description: doc.data().description,
          advertiseImage: doc.data().advertiseImage,
          lineId: doc.data().lineId,
          contact: doc.data().contact,
          accept: doc.data().accept,
          createdAt: doc.data().createdAt,
          advertiseId: doc.id,
        });
      });
      return res.json(advertiseData);
    })
    .catch((err) => {
      return res.json({ error: err.code });
    });
};

exports.getAcceptAdvertise = (req, res) => {
  db.collection("advertises")
    .where("accept", "==", true)
    .get()
    .then((data) => {
      const advertiseData = [];
      data.forEach((doc) => {
        advertiseData.push({
          avatarImage: doc.data().avatarImage,
          avatarName: doc.data().avatarName,
          advertiseImage: doc.data().advertiseImage,
          description: doc.data().description,
          lineId: doc.data().lineId,
          contact: doc.data().contact,
          accept: doc.data().accept,
          createdAt: doc.data().createdAt,
          advertiseId: doc.id,
        });
      });
      return res.json(advertiseData);
    })
    .catch((err) => {
      return res.json({ error: err.code });
    });
};

exports.deleteAdvertise = (req, res) => {
  db.doc(`/advertises/${req.params.advertiseId}`)
    .get()
    .then(async (doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Advertise not found" });
      }
      await doc.ref.delete();
      return db.collection("advertises").get();
    })
    .then((data) => {
      const advertiseData = [];
      data.forEach((doc) => {
        advertiseData.push({
          avatarImage: doc.data().avatarImage,
          avatarName: doc.data().avatarName,
          description: doc.data().description,
          lineId: doc.data().lineId,
          contact: doc.data().contact,
          accept: doc.data().accept,
          advertiseImage: doc.data().advertiseImage,
          createdAt: doc.data().createdAt,
          advertiseId: doc.id,
        });
      });
      return res.json(advertiseData);
    })
    .catch((err) => {
      return res.json({ error: err.code });
    });
};
