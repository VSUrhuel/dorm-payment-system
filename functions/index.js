/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { onCall } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, serverTimestamp } = require("firebase-admin/firestore");

initializeApp();

exports.createAdminDormer = onCall(async (request) => {
  // Check if the person calling this function is an admin.
  // This is a crucial security step. You'll need to set custom claims
  // for your main admin accounts for this to work.
  if (request.auth?.token?.admin !== true) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be an admin to perform this action."
    );
  }

  const { email, firstName, ...otherDormerData } = request.data;
  const tempPassword = "defaultAdminPassword123";

  try {
    // 1. Create user in Firebase Auth using the Admin SDK
    const userRecord = await getAuth().createUser({
      email: email,
      password: tempPassword,
      displayName: `${firstName} ${otherDormerData.lastName}`,
    });

    const newAdminUid = userRecord.uid;

    // 2. Set custom claim to identify this user as an admin
    await getAuth().setCustomUserClaims(newAdminUid, { admin: true });

    // 3. Create the corresponding dormer document in Firestore
    const db = getFirestore();
    await db
      .collection("dormers")
      .doc(newAdminUid)
      .set({
        ...otherDormerData,
        firstName,
        email,
        role: "Admin", // Explicitly set role
        createdBy: request.auth.uid, // The admin who made the request
        createdAt: serverTimestamp(),
      });

    return {
      status: "success",
      message: `Admin user ${email} created successfully.`,
      uid: newAdminUid,
    };
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "An unknown error occurred."
    );
  }
});
