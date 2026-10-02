/**
 * Field validation for the site's forms, from the contact form's rules, so every form announces and
 * clears errors the same way.
 *
 * - An error shows as `aria-invalid="true"` on the control, its message in `<id>-error`, and
 *   `aria-describedby` pointing there only while it shows (after the hint, `<id>-hint`, if any).
 * - Reward early, punish late: an error clears the moment the field is fixed, but a new one only
 *   appears once the reader leaves a field they typed in, or on submit.
 * - On submit, focus moves to the first invalid field, which then reads its own error.
 *
 * Each form keeps its own `check`: what is required, what a valid value is, and the words.
 */
export type FieldControl = HTMLInputElement | HTMLTextAreaElement;
export type Problem = { kind: 'required' | 'format'; message: string } | null;
export type Check = (el: FieldControl) => Problem;

const errorOf = (el: FieldControl) => document.getElementById(`${el.id}-error`);

// The hint, when the field has one, and the error while it shows.
function describe(el: FieldControl, withError: boolean): void {
	const ids = [`${el.id}-hint`, withError ? `${el.id}-error` : ''].filter((id) => id && document.getElementById(id));
	if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
	else el.removeAttribute('aria-describedby');
}

export function clearFieldError(el: FieldControl): void {
	el.setAttribute('aria-invalid', 'false');
	delete el.dataset.error;
	const message = errorOf(el);
	if (message) {
		message.hidden = true;
		message.textContent = '';
	}
	describe(el, false);
}

export function setFieldError(el: FieldControl, problem: NonNullable<Problem>): void {
	el.setAttribute('aria-invalid', 'true');
	el.dataset.error = problem.kind;
	const message = errorOf(el);
	if (message) {
		message.textContent = problem.message;
		message.hidden = false;
	}
	describe(el, Boolean(message));
}

export function validateField(el: FieldControl, check: Check): boolean {
	const problem = check(el);
	if (problem) setFieldError(el, problem);
	else clearFieldError(el);
	return !problem;
}

/** Checks every field, focuses the first that fails, and says whether the form may go. */
export function validateAll(fields: FieldControl[], check: Check): boolean {
	const invalid = fields.filter((el) => !validateField(el, check));
	invalid[0]?.focus();
	return invalid.length === 0;
}

/**
 * Wires the clear-on-fix and check-on-leave behaviour. Returns a function the submit handler calls
 * once, after which a field is checked on leave even if it was left empty.
 */
export function wireValidation(fields: FieldControl[], check: Check): () => void {
	let attempted = false;
	fields.forEach((el) => {
		el.addEventListener('input', () => {
			if (!el.dataset.error) return;
			if (!check(el) || (el.dataset.error === 'required' && el.value.trim() !== '')) clearFieldError(el);
		});
		el.addEventListener('blur', () => {
			if (attempted || el.value.trim() !== '') validateField(el, check);
		});
	});
	return () => {
		attempted = true;
	};
}

const counters = new WeakMap<FieldControl, () => void>();

/**
 * The quiet counter: hidden until the text is within 20% of the cap, red at the cap. `Field` wires
 * every counter it renders; calling this again for the same field recounts (after a form restores
 * a draft into it, say) instead of adding a second listener.
 */
export function wireCounter(el: FieldControl): void {
	const known = counters.get(el);
	if (known) return known();
	const count = document.getElementById(`${el.id}-count`);
	if (!count || !el.maxLength || el.maxLength < 0) return;
	const update = () => {
		const max = el.maxLength;
		const len = el.value.length;
		count.hidden = len < max * 0.8;
		count.textContent = `${len.toLocaleString('en-US')} / ${max.toLocaleString('en-US')}`;
		count.classList.toggle('is-full', len >= max);
	};
	counters.set(el, update);
	update();
	el.addEventListener('input', update);
}
