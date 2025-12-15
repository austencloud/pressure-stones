// Quick script to read feedback from Firestore
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize with default credentials (uses gcloud auth)
initializeApp({
  projectId: 'pressurestones-2c455'
});

const db = getFirestore();

async function readFeedback() {
  try {
    const snapshot = await db.collection('feedback').orderBy('submittedAt', 'desc').get();

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
}

readFeedback();
