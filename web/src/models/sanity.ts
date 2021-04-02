

const FULL_NAME_PATTERN = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

export function isValidName(value: string): boolean {
    return FULL_NAME_PATTERN.test(value);
}