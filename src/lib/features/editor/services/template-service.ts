import {
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
	query,
	orderBy,
	Timestamp
} from 'firebase/firestore';
import { getFirestoreDb } from '$lib/shared/firebase/config';
import { type IRoomTemplate, createTemplate, type BorderType } from '$lib/shared/domain';
import { BUILT_IN_TEMPLATES } from '../data/built-in-templates';

const TEMPLATES_COLLECTION = 'templates';

interface FirestoreTemplate {
	name: string;
	description?: string;
	roomTiles: Array<{ x: number; y: number }>;
	defaultBorderType: BorderType;
	walls: Array<{ x: number; y: number }>;
	lava: Array<{ x: number; y: number }>;
	width: number;
	height: number;
	createdAt: Timestamp;
}

function firestoreToTemplate(id: string, data: FirestoreTemplate): IRoomTemplate {
	return createTemplate({
		id,
		name: data.name,
		description: data.description,
		roomTiles: data.roomTiles,
		defaultBorderType: data.defaultBorderType,
		walls: data.walls,
		lava: data.lava,
		width: data.width,
		height: data.height,
		isBuiltIn: false
	});
}

export function getBuiltInTemplates(): IRoomTemplate[] {
	return BUILT_IN_TEMPLATES;
}

export async function getUserTemplates(): Promise<IRoomTemplate[]> {
	try {
		const db = getFirestoreDb();
		const templatesRef = collection(db, TEMPLATES_COLLECTION);
		const q = query(templatesRef, orderBy('createdAt', 'desc'));
		const snapshot = await getDocs(q);

		return snapshot.docs.map((doc) => firestoreToTemplate(doc.id, doc.data() as FirestoreTemplate));
	} catch (error) {
		console.error('Failed to fetch user templates:', error);
		return [];
	}
}

export async function saveUserTemplate(template: {
	name: string;
	description?: string;
	roomTiles: Array<{ x: number; y: number }>;
	defaultBorderType: BorderType;
	walls: Array<{ x: number; y: number }>;
	lava: Array<{ x: number; y: number }>;
	width: number;
	height: number;
}): Promise<IRoomTemplate> {
	const db = getFirestoreDb();
	const templatesRef = collection(db, TEMPLATES_COLLECTION);

	const firestoreData: FirestoreTemplate = {
		name: template.name,
		description: template.description,
		roomTiles: template.roomTiles,
		defaultBorderType: template.defaultBorderType,
		walls: template.walls,
		lava: template.lava,
		width: template.width,
		height: template.height,
		createdAt: Timestamp.now()
	};

	const docRef = await addDoc(templatesRef, firestoreData);

	return createTemplate({
		id: docRef.id,
		...template,
		isBuiltIn: false
	});
}

export async function deleteUserTemplate(id: string): Promise<void> {
	const db = getFirestoreDb();
	const templateRef = doc(db, TEMPLATES_COLLECTION, id);
	await deleteDoc(templateRef);
}
