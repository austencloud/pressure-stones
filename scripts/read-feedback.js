// Prints all feedback, newest first: node scripts/read-feedback.js
import { db } from './admin.js';

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
    process.exitCode = 1;
  }
}

readFeedback();
