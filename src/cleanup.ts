import { finder } from '@medv/finder';
import { JSDOM } from "jsdom";
import prettier from "prettier";

// List of window properties which should not be included on globalThis
const blacklist: Array<string | symbol> = [
	"AbortController", "AbortSignal", "AggregateError", "Array",
	"ArrayBuffer", "Atomics", "BigInt", "BigInt64Array",
	"BigUint64Array", "Blob", "Boolean", "Crypto", "CustomEvent",
	"DOMException", "DataView", "Date", "Error", "EvalError", "Event",
	"EventTarget", "FinalizationRegistry", "Float32Array", "Float64Array",
	"FormData", "Function", "Headers", "Infinity", "Int16Array",
	"Int32Array", "Int8Array", "Intl", "JSON", "Map", "Math", "MessageEvent",
	"NaN", "Number", "Object", "Performance", "Promise", "Proxy", "RangeError",
	"ReferenceError", "Reflect", "RegExp", "Set", "SharedArrayBuffer",
	"String", "Symbol", "SyntaxError", "TypeError", "URIError", "URL",
	"URLSearchParams", "Uint16Array", "Uint32Array", "Uint8Array",
	"Uint8ClampedArray", "WeakMap", "WeakRef", "WeakSet", "WebAssembly",
	"atob", "btoa", "clearInterval", "clearTimeout", "console", "crypto",
	"decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent",
	"escape", "eval", "globalThis", "isFinite", "isNaN", "localStorage",
	"parseFloat", "parseInt", "performance", "queueMicrotask", "sessionStorage",
	"setInterval", "setTimeout", "undefined", "unescape"
];

export const cleanup = (sourceHTML: string, options: Record<string, any>) => {
	const root = new JSDOM(sourceHTML);
	const { document } = root.window;

	for (const key of Reflect.ownKeys(root.window)) {
		if (blacklist.includes(key)) continue;
		// @ts-ignore
		globalThis[key] = root.window[key];
	}

	const extractedCSS = [];
	const extractedJS = [];

	for (const e of document.querySelectorAll("[style]")) {
		const selector = finder(e);

		const rule = new CSSStyleRule();
		rule.selectorText = selector;
		rule.style.cssText = e.getAttribute("style")!;
		extractedCSS.push(rule.cssText);
		e.removeAttribute("style");

		const eventListeners = [...e.attributes].filter(a => a.name.startsWith("on"));
		for (const listener of eventListeners) {
			const event = listener.name.slice(2);
			const callback = options.shortListeners ? listener.value.replace(/\(\)$/, "") : `function() {
				${listener.value}
			}`;

			extractedJS.push(`document.querySelector('${selector}').addEventListener('${event}', ${callback});`);
			e.removeAttribute(listener.name);
		}
	}

	const style = document.createElement("style");
	style.textContent = extractedCSS.join('\n');
	if (style.textContent.trim().length > 0)
		document.head.append(style);

	const script = document.createElement("script");
	script.textContent = extractedJS.join('\n');
	if (script.textContent.trim().length > 0)
		document.body.append(script);

	return prettier.format(document.documentElement.outerHTML, {
		parser: "html",
		useTabs: true,
		printWidth: Infinity
	});
};