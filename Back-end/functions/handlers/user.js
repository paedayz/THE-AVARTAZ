const { admin, db } = require("../util/admin");
const config = require("../util/config");

// Connect to Firebase
const firebase = require("firebase");
firebase.initializeApp(config);

// Find error when edit data
const {
  validateLoginData,
  validateSignupData,
  reduceUserDetails,
} = require("../util/validators");

// Signup
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    avatarName: req.body.avatarName,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  const noImg = "no-img.png";

  let token, userId;

  db.doc(`users/${newUser.avatarName}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("avatar name same");
        return res.status(400).json({
          avatarName: "This avatar name is already taken",
        });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;

      const userCredentials = {
        avatarName: newUser.avatarName,
        email: newUser.email,
        createdAt: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Bangkok",
        }),
        avatarImage: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        userId,
        status: "user",
        reportcount: 0,
      };

      return db.doc(`/users/${newUser.avatarName}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      // auth/wrong-password
      // auth/user-not-user
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};

exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);

    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = {
      filepath,
      mimetype,
    };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        // Append token to url
        const avatarImage = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.avatarName}`).update({ avatarImage });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};

exports.getUserDetails = (req, res) => {
  let userData = {};

  db.doc(`/users/${req.params.avatarName}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData = doc.data();
        return db
          .collection("screams")
          .where("avatarName", "==", req.params.avatarName)
          .get();
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    })
    .then((data) => {
      userData.screams = [];
      data.forEach((doc) => {
        userData.screams.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          avatarName: doc.data().avatarName,
          avatarImage: doc.data().avatarImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          screamId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Data of user that login to this web
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.avatarName}`)
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        console.log("get authen user");
        console.log(doc.data().releasDate);
        if (doc.data().releasDate !== "none") {
          let today = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Bangkok",
          });

          console.log("doc releasDate : " + doc.data().releasDate);
          console.log("today          : " + today);

          if (doc.data().releasDate <= today) {
            console.log("ahhh it's done ");
            await doc.ref.update({ status: "user" });
            await doc.ref.update({ releasDate: "none" });
            await db.collection("ban").doc(doc.data().avatarName).delete();
            console.log("yes it's is");
          } else {
            console.log("no it's not done");
          }
        } else {
          console.log("not none");
        }

        return db.doc(`/users/${req.user.avatarName}`).get();
      }
    })
    .then((doc) => {
      userData.credentials = doc.data();
      return db.doc(`ban/${req.user.avatarName}`).get();
    })
    .then((doc) => {
      if (doc.exists) {
        userData.banDetail = doc.data();
      }

      return db
        .collection("likes")
        .where("avatarName", "==", req.user.avatarName)
        .get();
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.avatarName)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screamId: doc.data().screamId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
          room: doc.data().room,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.avatarName}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked read" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.reportUser = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ comment: "Must not be empty" });
  }

  const newReport = {
    body: req.body.body,
    createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    avatarName: req.user.avatarName,
    avatarImage: req.user.avatarImage,
    accused: req.params.avatarName,
    type: "user",
  };

  db.doc(`/users/${req.params.avatarName}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ err: "User not found" });
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

exports.addAvertiseImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);

    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = {
      filepath,
      mimetype,
    };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        // Append token to url
        const advertiseImage = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

        return db
          .doc(`/advertises/${req.params.adsId}`)
          .update({ advertiseImage: advertiseImage });
      })
      .then(() => {
        return res.json({ message: "Advertise uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};

exports.addAdvertiseDetail = (req, res) => {
  const advertiseData = {
    avatarName: req.user.avatarName,
    avatarImage: req.user.avatarImage,
    description: req.body.description,
    lineId: req.body.lineId,
    contact: req.body.contact,
    accept: false,
    createdAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
  };
  db.collection("advertises")
    .add(advertiseData)
    .then((doc) => {
      const adsId = doc.id;
      return res.json({ adsId: adsId });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "something went wrong" });
    });
};
