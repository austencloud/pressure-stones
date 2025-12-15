export interface IColor {
	readonly id: string;
	readonly name: string;
	readonly hex: string;
}

export function createColor(id: string, name: string, hex: string): IColor {
	return Object.freeze({ id, name, hex });
}

export const DEFAULT_COLORS: IColor[] = [
	createColor('red', 'Red', '#e74c3c'),
	createColor('yellow', 'Yellow', '#f1c40f'),
	createColor('blue', 'Blue', '#3498db'),
	createColor('green', 'Green', '#2ecc71'),
	createColor('purple', 'Purple', '#9b59b6'),
	createColor('orange', 'Orange', '#e67e22')
];

export function getColorById(id: string): IColor | undefined {
	return DEFAULT_COLORS.find((c) => c.id === id);
}

export function colorsEqual(a: IColor, b: IColor): boolean {
	return a.id === b.id;
}
