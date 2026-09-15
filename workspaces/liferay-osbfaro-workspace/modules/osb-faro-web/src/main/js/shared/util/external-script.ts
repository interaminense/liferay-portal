/**
 * The machinery that puts a third party script or stylesheet on the page, and
 * the Content Security Policy nonce every one of them needs.
 *
 * Kept apart from `external-scripts.js`, which decides what to append at load,
 * because the AI Hub chatbot appends and removes itself as the route changes
 * and needs the same machinery long after load.
 */

interface LinkOptions {
	href: string;
	id?: string;
	rel: string;
}

interface ScriptOptions {
	attributes?: Record<string, string>;
	id?: string;
	innerHTML?: string;
	src?: string;
}

/**
 * Marks an element as one the page's own Content Security Policy allows.
 */
export function applyNonce(element: HTMLElement) {
	const nonce = (Liferay as unknown as {CSP?: {nonce?: string}}).CSP?.nonce;

	if (nonce) {
		element.setAttribute('nonce', nonce);
	}
}

export function appendLink(options: LinkOptions) {
	const link = Object.assign(document.createElement('link'), options);

	applyNonce(link);

	document.head.appendChild(link);

	return link;
}

export function appendScript({attributes = {}, ...options}: ScriptOptions) {
	const script = Object.assign(document.createElement('script'), options);

	if (options.src) {
		script.async = true;
	}

	// Loaders that read their configuration back with `getAttribute` need real
	// HTML attributes, which a plain property assignment does not create for
	// non-standard names such as `ai-hub-url`.

	for (const [name, value] of Object.entries(attributes)) {
		script.setAttribute(name, value);
	}

	applyNonce(script);

	document.body.appendChild(script);

	return script;
}
