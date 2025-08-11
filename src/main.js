// Make sure firebase-config.js defines firebase.initializeApp(config)
const auth = firebase.auth();
const db = firebase.firestore();

window.signup = async function(email, password) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Save email in Firestore
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Redirect to home
    window.location.href = "home.html";
    return user;
  } catch (error) {
    throw error;
  }
};

window.login = async function(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Save email in Firestore (merge so it doesn’t overwrite existing data)
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Redirect to home
    window.location.href = "home.html";
    return user;
  } catch (error) {
    throw error;
  }
};

window.logout = async function() {
  await auth.signOut();
  window.location.href = "index.html"; // Optional: redirect after logout
};

window.loginWithGoogle = async function() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const userCredential = await auth.signInWithPopup(provider);
    const user = userCredential.user;

    // Save user in Firestore
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      name: user.displayName,
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Redirect to home
    window.location.href = "home.html";
    return user;
  } catch (error) {
    throw error;
  }
};

window.savePurchase = async function(userUid, purchaseData) {
  return await db.collection('users').doc(userUid).collection('purchases').add({
    ...purchaseData,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
};

window.getPurchases = async function(userUid) {
  const snapshot = await db.collection('users')
    .doc(userUid)
    .collection('purchases')
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

window.onAuthChange = function(callback) {
  return auth.onAuthStateChanged(callback);
};
