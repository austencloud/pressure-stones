// Quick script to delete feedback from Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, deleteDoc } = require('firebase/firestore');

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

const feedbackId = process.argv[2];

if (!feedbackId) {
  console.log('Usage: node delete-feedback.cjs <feedback-id>');
  process.exit(1);
}

async function deleteFeedback() {
  try {
    await deleteDoc(doc(db, 'feedback', feedbackId));
    console.log(`Deleted feedback: ${feedbackId}`);
  } catch (error) {
    console.error('Error deleting feedback:', error.message);
  }
  process.exit(0);
}

deleteFeedback();
