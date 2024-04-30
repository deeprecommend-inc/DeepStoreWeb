export function isBlank(arg: string): boolean {
	const blankRegex = /^(?=\s*$)/;
	return blankRegex.test(arg);
}

export function isValidEmail(arg: string): boolean {
	const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	return emailRegex.test(arg);
}

export function isGoodPassword(arg: string): boolean {
	return 8 <= arg.length;
}

export function isValidTelephoneNum(arg: string): boolean {
	const telRegex = /^\d{10,11}$/;
	return telRegex.test(arg);
}