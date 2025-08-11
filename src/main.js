// main.js

window.signup = async function(email, password) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return user;
  } catch (error) {
    throw error;
  }
};

window.login = async function(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

window.logout = async function() {
  await auth.signOut();
};

window.loginWithGoogle = async function() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const userCredential = await auth.signInWithPopup(provider);
    const user = userCredential.user;
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      name: user.displayName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
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
  const snapshot = await db.collection('users').doc(userUid).collection('purchases').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

window.onAuthChange = function(callback) {
  return auth.onAuthStateChanged(callback);
};
