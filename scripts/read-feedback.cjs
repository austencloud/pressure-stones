// Quick script to read feedback from Firestore using web SDK
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, orderBy, query } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyCGBVP9GGaog8iHPuOsp_fHLN2aPpGTFzA',
  authDomain: 'pressurestones-2c455.firebaseapp.com',
  projectId: 'pressurestones-2c455',
  storageBucket: 'pressurestones-2c455.firebasestorage.app',
  messagingSenderId: '449447731566',
  appId: '1:449447731566:web:a7d5f97b17fe5a39a1a17f'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function readFeedback() {
  try {
    const feedbackRef = collection(db, 'feedback');
    const q = query(feedbackRef, orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('No feedback found.');
      return;
    }

    console.log(`\n=== ${snapshot.size} Feedback Item(s) ===\n`);

    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Type: ${data.type}`);
      console.log(`Title: ${data.title}`);
      console.log(`Description: ${data.description}`);
      console.log(`From: ${data.submittedBy}`);
      console.log(`Status: ${data.status}`);
      console.log(`Submitted: ${data.submittedAt?.toDate?.() || data.submittedAt}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error reading feedback:', error.message);
  }
  process.exit(0);
}

readFeedback();
