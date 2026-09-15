/**
 * Everything specific to the AI Hub chat widget: where it is served from, which
 * chatbot it opens, and the overrides that let its toggle share the corner with
 * the help widget.
 *
 * The widget comes and goes with the route, because a chatbot can be
 * provisioned for a single workspace. `RootLayout` calls `syncAIHubChatbot`
 * with the workspace the router matched; everything below is how that decision
 * is made and carried out.
 */

import {appendLink, appendScript, applyNonce} from './external-script';

interface Chatbot {

	/**
	 * The AI Hub the chatbot is served from. Each environment's chatbot is
	 * provisioned on its own hub, so this travels with the chatbot rather than
	 * standing as one constant for the whole app.
	 */
	aiHubURL: string;

	externalReferenceCode: string;

	/**
	 * The workspace the chatbot was provisioned for, spelled the way the
	 * `:groupId` segment of `/workspace/:groupId/...` spells it: the project's
	 * friendly URL when it has one, and its group id otherwise. A chatbot that
	 * names a workspace stays off every other one; a chatbot that names none
	 * answers on all of them, including the pages outside any workspace.
	 */
	workspace?: string;
}

/**
 * A chatbot is provisioned per environment and answers to its own external
 * reference code, so the widget loads only where this map names one.
 *
 * Keyed on the portal's own `faroURL` rather than on `FARO_ENV`, because the
 * build-time environment name cannot be trusted to tell the deployments apart:
 * `FaroEnv` has no member for the internal environment, and nothing in this
 * repository pins which value `FARO_ENVIRONMENT_NAME` carries there. Were
 * internal to build as `stg`, keying on the environment would quietly serve it
 * staging's chatbot. Keying on the URL the portal reports for itself makes the
 * map fail closed instead: an environment it does not name renders nothing.
 */
const CHATBOTS: Record<string, Chatbot | undefined> = {
	'https://ldp-internal.liferay.com': {
		aiHubURL: 'https://ai-uat.liferay.net',
		externalReferenceCode: 'L_AIHUB_CHATBOT_LDP',
		workspace: 'liferay.com',
	},
	'https://ldp-stg.liferay.com': {
		aiHubURL: 'https://na1.hub.liferay.com',
		externalReferenceCode: 'chatbot-ldp-stg-liferay-com',
	},
};

// Development is deliberately not a case of its own: the dev server reports its
// own origin as `faroURL`, which this map does not name, so the widget stays off
// locally and the unit tests are what cover it.

const CHATBOT = CHATBOTS[window.faroConstants.faroURL.replace(/\/$/, '')];

const CHATBOT_HOST_ID = 'aihub-chatbot-host';

const CHATBOT_LINK_ID = 'aihub-chatbot-widget-style';

const CHATBOT_SCRIPT_ID = 'aihub-chatbot-widget-script';

// The widget only renders once its configuration request resolves, so its host
// is not on the page yet when it is mounted.

const CHATBOT_STYLE_TIMEOUT = 30000;

/**
 * The widget ships a 3.5rem toggle pinned to the bottom right corner, which is
 * where the help widget already sits, so out of the box it covers that button
 * behind a `z-index` of 2147483647. These rules size it to match the help
 * button and leave it in the corner, while `_help_widget.scss` shifts the help
 * button one slot to the left.
 *
 * They have to be injected into the widget's shadow root, because nothing on
 * the page can reach inside one: the widget exposes no `::part()`, and the only
 * custom properties it declares are colors. The icon keeps the toggle's own
 * half-of-the-button proportion rather than the help widget's 16px.
 *
 * The offsets go on the container rather than on the toggle, which is laid out
 * statically: the toggle carries `bottom` and `right` of its own, but they are
 * inert, and overriding them moves nothing.
 */
const CHATBOT_TOGGLE_STYLES = `
	#aihub-chatbot-widget {
		bottom: 16px;
		right: 16px;
	}

	.aihub-toggle {
		height: 40px;
		width: 40px;
	}

	.aihub-toggle .lexicon-icon {
		height: 20px;
		width: 20px;
	}
`;

let toggleStylesObserver: MutationObserver | undefined;

/**
 * Adds the overrides above to the chatbot's shadow root, if the widget has
 * built it. Returns whether it did, so the caller can stop waiting.
 */
function addToggleStyles() {
	const shadowRoot = document.getElementById(CHATBOT_HOST_ID)?.shadowRoot;

	if (!shadowRoot) {
		return false;
	}

	const style = document.createElement('style');

	style.textContent = CHATBOT_TOGGLE_STYLES;

	applyNonce(style);

	shadowRoot.appendChild(style);

	return true;
}

function stopStylingToggle() {
	toggleStylesObserver?.disconnect();

	toggleStylesObserver = undefined;
}

/**
 * Waits for the widget to put its host on the page, then restyles its toggle.
 */
function styleToggle() {
	if (addToggleStyles()) {
		return;
	}

	toggleStylesObserver = new MutationObserver(() => {
		if (addToggleStyles()) {
			stopStylingToggle();
		}
	});

	toggleStylesObserver.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// A failed configuration request leaves the widget unrendered, so give up
	// rather than watching the whole body for the life of the page.

	setTimeout(stopStylingToggle, CHATBOT_STYLE_TIMEOUT);
}

function mount(chatbot: Chatbot) {
	const {aiHubURL} = chatbot;

	appendLink({
		href: `${aiHubURL}/documents/d/global/index-css`,
		id: CHATBOT_LINK_ID,
		rel: 'stylesheet',
	});

	appendScript({
		attributes: {
			'ai-hub-url': aiHubURL,
			'chatbot-external-reference-code': chatbot.externalReferenceCode,
		},
		id: CHATBOT_SCRIPT_ID,
		src: `${aiHubURL}/documents/d/global/index-js`,
	});

	styleToggle();
}

/**
 * The widget builds its own host and offers no teardown, so removing that host
 * is both how it leaves the page and how the next mount is allowed to happen:
 * its script bootstraps behind `if (!document.getElementById(<host>))`, and
 * re-appending the script tag with the host still in place would do nothing.
 *
 * The React root the widget mounted inside the host is dropped rather than
 * unmounted, because nothing exposes it. That strands one root per visit to the
 * workspace, which a teardown API on the widget would fix at the source.
 */
function unmount() {
	stopStylingToggle();

	for (const id of [CHATBOT_HOST_ID, CHATBOT_LINK_ID, CHATBOT_SCRIPT_ID]) {
		document.getElementById(id)?.remove();
	}
}

/**
 * Puts the chatbot on the page, or takes it off, to match the workspace the
 * router is on — the `:groupId` segment of `/workspace/:groupId/...`, and
 * `undefined` anywhere outside a workspace.
 */
export function syncAIHubChatbot(workspace?: string) {
	const chatbot =
		CHATBOT && (!CHATBOT.workspace || CHATBOT.workspace === workspace)
			? CHATBOT
			: undefined;

	const mounted = Boolean(document.getElementById(CHATBOT_SCRIPT_ID));

	if (Boolean(chatbot) === mounted) {
		return;
	}

	if (chatbot) {
		mount(chatbot);
	}
	else {
		unmount();
	}
}
