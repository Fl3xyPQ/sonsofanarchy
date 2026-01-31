(() => {
  const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: "",
    storageBucket: "",
    messagingSenderId: "",
  };

  const hasConfig = Object.values(firebaseConfig).some(
    (value) => typeof value === "string" && value.trim() !== ""
  );

  let db = null;
  if (hasConfig && window.firebase) {
    try {
      window.firebase.initializeApp(firebaseConfig);
      db = window.firebase.firestore();
    } catch (error) {
      console.warn("Firebase init failed", error);
    }
  }

  const getDocValue = async (key) => {
    if (!db) return null;
    const snapshot = await db.collection("soa_store").doc(key).get();
    if (!snapshot.exists) return null;
    const data = snapshot.data();
    return data?.value ?? null;
  };

  const setDocValue = async (key, value) => {
    if (!db) return;
    await db
      .collection("soa_store")
      .doc(key)
      .set({
        value,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
  };

  window.firebaseStore = {
    enabled: Boolean(db),
    getDocValue,
    setDocValue,
  };
})();
