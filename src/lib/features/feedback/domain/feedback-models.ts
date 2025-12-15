export type FeedbackType = 'idea' | 'bug' | 'question';
export type FeedbackStatus = 'new' | 'reviewed' | 'planned' | 'done' | 'wont-do';

export interface IFeedback {
	readonly id: string;
	readonly type: FeedbackType;
	readonly title: string;
	readonly description: string;
	readonly submittedBy: string;
	readonly submittedAt: Date;
	readonly status: FeedbackStatus;
	readonly adminNotes?: string;
}

export interface IFeedbackSubmission {
	type: FeedbackType;
	title: string;
	description: string;
	submittedBy: string;
}

export const FEEDBACK_TYPE_CONFIG: Record<
	FeedbackType,
	{ label: string; icon: string; color: string; placeholder: string }
> = {
	idea: {
		label: 'Idea',
		icon: 'fa-solid fa-lightbulb',
		color: '#f1c40f',
		placeholder: 'I think it would be cool if...'
	},
	bug: {
		label: 'Bug',
		icon: 'fa-solid fa-bug',
		color: '#e74c3c',
		placeholder: 'Something went wrong when...'
	},
	question: {
		label: 'Question',
		icon: 'fa-solid fa-circle-question',
		color: '#3498db',
		placeholder: 'I was wondering about...'
	}
};

export const FEEDBACK_STATUS_CONFIG: Record<FeedbackStatus, { label: string; color: string }> = {
	new: { label: 'New', color: '#9b59b6' },
	reviewed: { label: 'Reviewed', color: '#3498db' },
	planned: { label: 'Planned', color: '#f1c40f' },
	done: { label: 'Done', color: '#2ecc71' },
	'wont-do': { label: "Won't Do", color: '#95a5a6' }
};
