// Security rules tests for Cloud Firestore. They run against the local emulator
// under a demo project id, so they never touch the live database.
//
//   npm run test:rules
//
// Needs the Firebase CLI (npm i -g firebase-tools) and Java 21 or newer.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, before, beforeEach, describe, test } from 'node:test';
import {
	assertFails,
	assertSucceeds,
	initializeTestEnvironment
} from '@firebase/rules-unit-testing';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	setDoc,
	setLogLevel,
	Timestamp,
	updateDoc
} from 'firebase/firestore';

/** @type {import('@firebase/rules-unit-testing').RulesTestEnvironment} */
let testEnv;

/**
 * What FeedbackForm sends through submitFeedback().
 * @param {Record<string, unknown>} [overrides]
 */
function validFeedback(overrides = {}) {
	return {
		type: 'bug',
		title: 'Stone gets stuck',
		description: 'Pushing a stone into a corner freezes the level.',
		submittedBy: 'Robert',
		submittedAt: Timestamp.now(),
		status: 'new',
		...overrides
	};
}

/**
 * What SaveTemplateModal sends through saveUserTemplate().
 * @param {Record<string, unknown>} [overrides]
 */
function validTemplate(overrides = {}) {
	return {
		name: 'L-shaped room',
		description: 'Two corridors',
		roomTiles: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 }
		],
		defaultBorderType: 'none',
		walls: [{ x: 1, y: 0 }],
		lava: [],
		width: 2,
		height: 2,
		createdAt: Timestamp.now(),
		...overrides
	};
}

/**
 * @param {Record<string, unknown>} data
 * @param {string} field
 */
function without(data, field) {
	const copy = { ...data };
	delete copy[field];
	return copy;
}

/** A visitor to the site. The app has no sign-in, so every request is unauthenticated. */
function visitor() {
	return testEnv.unauthenticatedContext().firestore();
}

/**
 * @param {string} path
 * @param {Record<string, unknown>} data
 */
async function seed(path, data) {
	await testEnv.withSecurityRulesDisabled(async (context) => {
		await setDoc(doc(context.firestore(), path), data);
	});
}

before(async () => {
	// Refused writes are expected here; keep the SDK from logging a warning for each one.
	setLogLevel('error');
	testEnv = await initializeTestEnvironment({
		projectId: 'demo-pressure-stones',
		firestore: { rules: readFileSync('firestore.rules', 'utf8') }
	});
});

beforeEach(async () => {
	await testEnv.clearFirestore();
});

after(async () => {
	await testEnv?.cleanup();
});

describe('feedback', () => {
	test('a visitor can submit feedback', async () => {
		await assertSucceeds(addDoc(collection(visitor(), 'feedback'), validFeedback()));
	});

	test('a visitor cannot read a feedback item', async () => {
		await seed('feedback/f1', validFeedback());
		await assertFails(getDoc(doc(visitor(), 'feedback/f1')));
	});

	test('a visitor cannot list feedback', async () => {
		await seed('feedback/f1', validFeedback());
		await assertFails(getDocs(collection(visitor(), 'feedback')));
	});

	test('a visitor cannot edit feedback', async () => {
		await seed('feedback/f1', validFeedback());
		await assertFails(updateDoc(doc(visitor(), 'feedback/f1'), { status: 'done' }));
	});

	test('a visitor cannot overwrite feedback', async () => {
		await seed('feedback/f1', validFeedback());
		await assertFails(setDoc(doc(visitor(), 'feedback/f1'), validFeedback({ title: 'Replaced' })));
	});

	test('a visitor cannot delete feedback', async () => {
		await seed('feedback/f1', validFeedback());
		await assertFails(deleteDoc(doc(visitor(), 'feedback/f1')));
	});

	/** @type {Record<string, Record<string, unknown>>} */
	const badSubmissions = {
		'an unknown type': validFeedback({ type: 'spam' }),
		'a status other than new': validFeedback({ status: 'done' }),
		'admin notes': validFeedback({ adminNotes: 'Looks fine' }),
		'an extra field': validFeedback({ isAdmin: true }),
		'a missing name': without(validFeedback(), 'submittedBy'),
		'an empty title': validFeedback({ title: '' }),
		'a title over 300 characters': validFeedback({ title: 'x'.repeat(301) }),
		'a description over 10000 characters': validFeedback({ description: 'x'.repeat(10001) }),
		'a name over 100 characters': validFeedback({ submittedBy: 'x'.repeat(101) }),
		'a date that is not a timestamp': validFeedback({ submittedAt: '2026-09-27' })
	};
	for (const [label, data] of Object.entries(badSubmissions)) {
		test(`a visitor cannot submit feedback with ${label}`, async () => {
			await assertFails(addDoc(collection(visitor(), 'feedback'), data));
		});
	}
});

describe('templates', () => {
	test('a visitor can browse saved templates, newest first', async () => {
		await seed('templates/t1', validTemplate());
		const snapshot = await assertSucceeds(
			getDocs(query(collection(visitor(), 'templates'), orderBy('createdAt', 'desc')))
		);
		assert.equal(snapshot.size, 1);
	});

	test('a visitor can save a template', async () => {
		await assertSucceeds(addDoc(collection(visitor(), 'templates'), validTemplate()));
	});

	test('a visitor can save a template without a description', async () => {
		await assertSucceeds(
			addDoc(collection(visitor(), 'templates'), without(validTemplate(), 'description'))
		);
	});

	test('a visitor cannot edit a template', async () => {
		await seed('templates/t1', validTemplate());
		await assertFails(updateDoc(doc(visitor(), 'templates/t1'), { name: 'Renamed' }));
	});

	test('a visitor cannot delete a template', async () => {
		await seed('templates/t1', validTemplate());
		await assertFails(deleteDoc(doc(visitor(), 'templates/t1')));
	});

	const tooManyTiles = Array.from({ length: 10001 }, (_, i) => ({ x: i % 101, y: Math.floor(i / 101) }));
	/** @type {Record<string, Record<string, unknown>>} */
	const badTemplates = {
		'an unknown border type': validTemplate({ defaultBorderType: 'spikes' }),
		'an extra field': validTemplate({ ownerId: 'someone' }),
		'a missing size': without(validTemplate(), 'width'),
		'an empty name': validTemplate({ name: '' }),
		'a name over 100 characters': validTemplate({ name: 'x'.repeat(101) }),
		'a description over 500 characters': validTemplate({ description: 'x'.repeat(501) }),
		'room tiles that are not a list': validTemplate({ roomTiles: 'everywhere' }),
		'walls that are not a list': validTemplate({ walls: 'everywhere' }),
		'lava that is not a list': validTemplate({ lava: 'everywhere' }),
		'more than 10000 room tiles': validTemplate({ roomTiles: tooManyTiles }),
		'a width over 100': validTemplate({ width: 101 }),
		'a fractional height': validTemplate({ height: 2.5 }),
		'a date that is not a timestamp': validTemplate({ createdAt: '2026-09-27' })
	};
	for (const [label, data] of Object.entries(badTemplates)) {
		test(`a visitor cannot save a template with ${label}`, async () => {
			await assertFails(addDoc(collection(visitor(), 'templates'), data));
		});
	}
});

describe('everything else', () => {
	test('a visitor cannot read or write other collections', async () => {
		await assertFails(getDoc(doc(visitor(), 'users/u1')));
		await assertFails(setDoc(doc(visitor(), 'users/u1'), { name: 'x' }));
	});

	test('a visitor cannot write below feedback or templates', async () => {
		await assertFails(setDoc(doc(visitor(), 'feedback/f1/replies/r1'), { text: 'x' }));
		await assertFails(setDoc(doc(visitor(), 'templates/t1/versions/v1'), { text: 'x' }));
	});
});
