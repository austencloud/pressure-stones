import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	query,
	orderBy,
	where,
	Timestamp
} from 'firebase/firestore';
import { getFirestoreDb } from '$lib/shared/firebase/config';
import type {
	IFeedback,
	IFeedbackSubmission,
	FeedbackType,
	FeedbackStatus
} from '../domain/feedback-models';

const FEEDBACK_COLLECTION = 'feedback';

interface FirestoreFeedback {
	type: FeedbackType;
	title: string;
	description: string;
	submittedBy: string;
	submittedAt: Timestamp;
	status: FeedbackStatus;
	adminNotes?: string;
}

function firestoreToFeedback(id: string, data: FirestoreFeedback): IFeedback {
	return {
		id,
		type: data.type,
		title: data.title,
		description: data.description,
		submittedBy: data.submittedBy,
		submittedAt: data.submittedAt.toDate(),
		status: data.status,
		adminNotes: data.adminNotes
	};
}

export async function submitFeedback(submission: IFeedbackSubmission): Promise<IFeedback> {
	const db = getFirestoreDb();
	const feedbackRef = collection(db, FEEDBACK_COLLECTION);

	const firestoreData: FirestoreFeedback = {
		type: submission.type,
		title: submission.title,
		description: submission.description,
		submittedBy: submission.submittedBy,
		submittedAt: Timestamp.now(),
		status: 'new'
	};

	const docRef = await addDoc(feedbackRef, firestoreData);

	return {
		id: docRef.id,
		...submission,
		submittedAt: new Date(),
		status: 'new'
	};
}

export async function getAllFeedback(): Promise<IFeedback[]> {
	try {
		const db = getFirestoreDb();
		const feedbackRef = collection(db, FEEDBACK_COLLECTION);
		const q = query(feedbackRef, orderBy('submittedAt', 'desc'));
		const snapshot = await getDocs(q);

		return snapshot.docs.map((doc) => firestoreToFeedback(doc.id, doc.data() as FirestoreFeedback));
	} catch (error) {
		console.error('Failed to fetch feedback:', error);
		return [];
	}
}

export async function getFeedbackByStatus(status: FeedbackStatus): Promise<IFeedback[]> {
	try {
		const db = getFirestoreDb();
		const feedbackRef = collection(db, FEEDBACK_COLLECTION);
		const q = query(
			feedbackRef,
			where('status', '==', status),
			orderBy('submittedAt', 'desc')
		);
		const snapshot = await getDocs(q);

		return snapshot.docs.map((doc) => firestoreToFeedback(doc.id, doc.data() as FirestoreFeedback));
	} catch (error) {
		console.error('Failed to fetch feedback by status:', error);
		return [];
	}
}

export async function updateFeedbackStatus(
	id: string,
	status: FeedbackStatus,
	adminNotes?: string
): Promise<void> {
	const db = getFirestoreDb();
	const feedbackRef = doc(db, FEEDBACK_COLLECTION, id);

	const updates: Partial<FirestoreFeedback> = { status };
	if (adminNotes !== undefined) {
		updates.adminNotes = adminNotes;
	}

	await updateDoc(feedbackRef, updates);
}

export async function deleteFeedback(id: string): Promise<void> {
	const db = getFirestoreDb();
	const feedbackRef = doc(db, FEEDBACK_COLLECTION, id);
	await deleteDoc(feedbackRef);
}
