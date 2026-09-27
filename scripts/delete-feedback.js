// Deletes one feedback item: node scripts/delete-feedback.js <feedback-id>
import { db } from './admin.js';

const feedbackId = process.argv[2];

if (!feedbackId) {
  console.log('Usage: node scripts/delete-feedback.js <feedback-id>');
  process.exit(1);
}

async function deleteFeedback() {
  try {
    const ref = db.collection('feedback').doc(feedbackId);
    if (!(await ref.get()).exists) {
      console.error(`No feedback found with ID ${feedbackId}`);
      process.exitCode = 1;
      return;
    }
    await ref.delete();
    console.log(`Deleted feedback: ${feedbackId}`);
  } catch (error) {
    console.error('Error deleting feedback:', error.message);
    process.exitCode = 1;
  }
}

deleteFeedback();
