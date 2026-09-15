/**
 * Appends the external scripts and stylesheets the app pulls from third parties
 * at load.
 *
 * One module per third party owns its own descriptors, so this file holds only
 * the decision to put them on the page. Those modules decide whether they
 * contribute anything at all, which is how an entry stays out of an environment
 * it does not belong in. `shared/util/external-script` holds the machinery.
 *
 * The AI Hub chatbot is the exception, and is absent here: it is provisioned
 * per workspace, so it has to follow the route rather than the page load, and
 * `RootLayout` drives it through `syncAIHubChatbot`.
 */

import {appendScript} from 'shared/util/external-script';
import {PENDO_SCRIPTS} from 'shared/util/pendo-script';

PENDO_SCRIPTS.forEach((script) => appendScript(script));
