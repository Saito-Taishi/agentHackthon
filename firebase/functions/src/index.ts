import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v1";

// Firebase Adminの初期化
admin.initializeApp();

// ユーザー作成時のトリガー関数
export const createUserDocument = functions.auth
  .user()
  .onCreate(async (user: admin.auth.UserRecord) => {
    try {
      const { email, displayName } = user;

      const userData = {
        name: displayName || "",
        email: email || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Firestoreにユーザー情報を保存
      await admin.firestore().collection("users").doc(user.uid).set(userData);

      console.log(`新規ユーザーのデータを保存しました: ${user.uid}`);
    } catch (error) {
      console.error("ユーザーデータの保存中にエラーが発生しました:", error);
      throw error;
    }
  });
