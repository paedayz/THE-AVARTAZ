const functions = require("firebase-functions");
const express = require("express");
const app = express();
const FBAuth = require("./util/fbAuth");
const { db } = require("./util/admin");

const cors = require("cors");

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  postRoomScream,
  getRoomScream,
  likeScream,
  unlikeScream,
  deleteScream,
  reportScream,
} = require("./handlers/screams");

const {
  getAllrooms,
  addRoom,
  deleteRoom,
  checkRoom,
} = require("./handlers/rooms");

const {
  signup,
  login,
  uploadImage,
  getUserDetails,
  getAuthenticatedUser,
  addUserDetails,
  markNotificationsRead,
  reportUser,
  addAdvertiseDetail,
  addAvertiseImage,
} = require("./handlers/user");

const {
  getAllScreamReports,
  getAllUserReports,
  setHost,
  getAllHost,
  deleteHost,
  banUser,
  releaseUser,
  getAllBanUser,
  getAllAdvertise,
  acceptAdvertise,
  getAcceptAdvertise,
  deleteAdvertise,
} = require("./handlers/admin");

app.use(cors());

// Admin route
app.get("/reports/scream", getAllScreamReports);
app.get("/reports/user", getAllUserReports);
app.post("/admin/setHost/:avatarName", setHost);
app.get("/admin/hosts", getAllHost);
app.get("/admin/delete/:status", deleteHost);
app.post("/admin/ban/:avatarName", banUser);
app.get("/admin/release/:avatarName", releaseUser);
app.get("/admin/ban", getAllBanUser);
app.get("/admin/advertise", getAllAdvertise);
app.get("/admin/advertise/:advertiseId", acceptAdvertise);
app.get("/admin/accept", getAcceptAdvertise);
app.get("/admin/delete/advertise/:advertiseId", deleteAdvertise);

// Screams route
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);
app.get("/scream/:screamId", getScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);
app.post("/scream/room/:roomName", FBAuth, postRoomScream);
app.get("/screams/:roomName", getRoomScream);
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
app.delete("/scream/:screamId", FBAuth, deleteScream);
app.post("/scream/:screamId/report", FBAuth, reportScream);

// Room route
app.get("/room", getAllrooms);
app.post("/room", addRoom);
app.delete("/room/delete/:room", deleteRoom);
app.get("/room/:room", checkRoom);

// User route
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.get("/user/:avatarName", getUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.post("/user", FBAuth, addUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);
app.post("/user/report/:avatarName", FBAuth, reportUser);
app.post("/user/advertise/detail", FBAuth, addAdvertiseDetail);
app.post("/user/advertise/image/:adsId", addAvertiseImage);

exports.api = functions.region("asia-northeast1").https.onRequest(app);

// Notification part

exports.createNotificationOnLike = functions
  .region("asia-northeast1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().avatarName !== snapshot.data().avatarName
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toLocaleString("en-US", {
              timeZone: "Asia/Bangkok",
            }),
            recipient: doc.data().avatarName,
            sender: snapshot.data().avatarName,
            type: "like",
            read: false,
            screamId: doc.id,
            room: doc.data().roomName,
          });
        }
      })
      .catch((err) => console.error(err));
  });

exports.deleteNotificationOnUnLike = functions
  .region("asia-northeast1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("asia-northeast1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().avatarName !== snapshot.data().avatarName
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toLocaleString("en-US", {
              timeZone: "Asia/Bangkok",
            }),
            recipient: doc.data().avatarName,
            sender: snapshot.data().avatarName,
            type: "comment",
            read: false,
            screamId: doc.id,
            room: doc.data().roomName,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions
  .region("asia-northeast1")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    if (change.before.data().avatarImage !== change.after.data().avatarImage) {
      const batch = db.batch();
      return db
        .collection("screams")
        .where("avatarName", "==", change.before.data().avatarName)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, {
              avatarImage: change.after.data().avatarImage,
            });
          });

          return batch.commit();
        });
    } else {
      return true;
    }
  });

exports.onScreamDelete = functions
  .region("asia-northeast1")
  .firestore.document("/screams/{screamId}")
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });

        return db.collection("likes").where("screamId", "==", screamId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });

        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });

        return db.collection("reports").where("screamId", "==", screamId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/reports/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
