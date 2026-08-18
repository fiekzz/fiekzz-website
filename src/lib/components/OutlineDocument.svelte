<script lang="ts">
	let { title, html }: { title: string; html: Promise<string> } = $props();

	async function copyText(text: string): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			// Fallback for non-secure contexts or older browsers.
			try {
				const textarea = document.createElement('textarea');
				textarea.value = text;
				textarea.style.position = 'fixed';
				textarea.style.opacity = '0';
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
				return true;
			} catch {
				return false;
			}
		}
	}

	// Runs once the raw {@html} content is mounted — Svelte doesn't template
	// inside it, so buttons have to be injected imperatively via the DOM.
	function addCopyButtons(node: HTMLElement) {
		node.querySelectorAll('pre').forEach((pre) => {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'copy-btn';
			btn.textContent = 'Copy';
			btn.addEventListener('click', async () => {
				const code = pre.querySelector('code') ?? pre;
				const ok = await copyText(code.textContent ?? '');
				btn.textContent = ok ? 'Copied!' : 'Failed to copy';
				setTimeout(() => (btn.textContent = 'Copy'), 1500);
			});
			pre.appendChild(btn);
		});
	}
</script>

<article class="outline-content">
	<h1>{title}</h1>
	{#await html}
		<p class="loading">Loading document…</p>
	{:then resolvedHtml}
		<div use:addCopyButtons>
			{@html resolvedHtml}
		</div>
	{:catch e}
		<p class="loading">Failed to load document content.</p>
	{/await}
</article>

<style>
    .outline-content {
        /*max-width: 760px;*/
        margin: 0 auto;
        padding: 3rem 1.5rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #1a1a1a;
        background: #fff;
    }
    .outline-content :global(h1) { font-size: 2rem; font-weight: 700; margin: 0 0 1.5rem; line-height: 1.25; }
    .outline-content :global(article > h1:first-child) { display: none; }
    .outline-content :global(h2) { margin-top: 2rem; margin-bottom: 0.75rem; font-size: 1.4rem; font-weight: 600; line-height: 1.3; }
    .outline-content :global(h3) { margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1.15rem; font-weight: 600; line-height: 1.3; }
    .outline-content :global(p) { line-height: 1.7; margin: 1rem 0; }
    .outline-content :global(a) { color: #2563eb; text-decoration: underline; text-underline-offset: 2px; }
    .outline-content :global(ul),
    .outline-content :global(ol) { line-height: 1.7; margin: 1rem 0; padding-left: 1.5rem; }
    .outline-content :global(li) { margin: 0.35rem 0; }
    .outline-content :global(code) {
        background: #f4f4f5; padding: 0.15em 0.4em; border-radius: 4px;
        font-size: 0.9em; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .outline-content :global(pre) {
        position: relative;
        background: #1e1e1e; color: #eee; padding: 1rem; border-radius: 8px; overflow-x: auto;
        margin: 1.25rem 0; line-height: 1.5;
    }
    .outline-content :global(pre code) {
        background: transparent; color: inherit; padding: 0; font-size: 0.875em;
    }
    .outline-content :global(.copy-btn) {
        position: absolute; top: 0.5rem; right: 0.5rem;
        padding: 0.25rem 0.6rem; font-size: 0.75rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #ccc; background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 4px;
        cursor: pointer; opacity: 0.7; transition: opacity 0.15s, background 0.15s;
    }
    .outline-content :global(.copy-btn:hover),
    .outline-content :global(.copy-btn:focus-visible) {
        opacity: 1; background: rgba(255, 255, 255, 0.15);
    }
    .outline-content :global(blockquote) {
        border-left: 3px solid #ccc; padding-left: 1rem; margin: 1rem 0; color: #555;
    }
    .outline-content :global(hr) { border: none; border-top: 1px solid #e5e5e5; margin: 2rem 0; }
    .outline-content :global(img) { max-width: 100%; height: auto; display: block; margin: 1rem 0; border-radius: 6px; }
    .outline-content .loading { color: #777; font-style: italic; }
    .outline-content :global(table) { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    .outline-content :global(th), .outline-content :global(td) {
        border: 1px solid #ddd; padding: 0.5rem;
    }
</style>
