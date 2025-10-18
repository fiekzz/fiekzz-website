<script lang="ts">
	import BasePage from '$lib/components/common/base-page/base-page.svelte';
	import EmptyResult from '$lib/components/common/empty-result/empty-result.svelte';
	import FancyBanner from '$lib/components/common/fancy-banner/fancy-banner.svelte';
	import EmptyMarkdown from '$lib/components/common/markdown/empty-markdown.svelte';
	import Markdown from '$lib/components/common/markdown/markdown.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import H1 from '$lib/components/ui/typography/h1.svelte';
	import Muted from '$lib/components/ui/typography/muted.svelte';
	import Assets from '$lib/data/assets';
	// import ExperienceData from '$lib/data/experience';
	// import ProjectsData from '$lib/data/projects';
	import type { Skill } from '$lib/data/types';
	import { href } from '$lib/utils';
	import { mode } from 'mode-watcher';

	// let { data }: { data: { item?: Skill } } = $props();

	let { data } = $props();

	let title = $derived(`${data?.skill?.name ?? 'Not Found'} - Skills`);
	let banner = $derived(
		// ($mode == 'dark' ? data?.item?.logo.dark : data.item?.logo.light) ?? Assets.Unknown.light
		data.skill?.logo?.mediaURL ?? Assets.Unknown.light
	);

	let related = $derived(
		(() => {
			const current = data.skill;

			if (!current) return [];

			const items: Array<{ name: string; logo: string; link: string }> = [];

			data.projects.forEach((it) => {
				if (it.skills.find((skill) => skill.id === current.id)) {
					items.push({
						link: `/projects/${it.id}`,
						logo: it.logo?.mediaURL ?? Assets.Unknown.dark,
						name: it.name || 'Untitled Project'
					})
				}
			})

			data.experiences.forEach((it) => {
				if (it.skills.find((skill) => skill.id === current.id)) {
					items.push({
						link: `/experience/${it.id}`,
						logo: it.logo?.mediaURL ?? Assets.Unknown.dark,
						name: it.name || 'Untitled Experience'
					})
				}
			})

			// ProjectsData.items.forEach((it) => {
			// 	if (it.skills.find((skill) => skill.slug === current.slug)) {
			// 		items.push({
			// 			link: `/projects/${it.slug}`,
			// 			logo: $mode === 'dark' ? it.logo.dark : it.logo.light,
			// 			name: it.name
			// 		});
			// 	}
			// });

			// ExperienceData.items.forEach((it) => {
			// 	if (it.skills.find((skill) => skill.slug === current.slug)) {
			// 		items.push({
			// 			link: `/experience/${it.slug}`,
			// 			logo: $mode === 'dark' ? it.logo.dark : it.logo.light,
			// 			name: it.name
			// 		});
			// 	}
			// });

			return items;
		})()
	);
</script>

<BasePage {title}>
	{#if !data.skill}
		<EmptyResult />
	{:else}
		<FancyBanner img={banner}>
			<H1>{data.skill.name}</H1>
		</FancyBanner>
		<Separator />
		{#if data.markdownContent}
			<Markdown content={data.markdownContent} />
		{:else}
			<EmptyMarkdown />
		{/if}
		<Separator />
		{#if related.length !== 0}
			<div class="flex flex-row flex-wrap items-center gap-2 px-4 py-4">
				<Muted>Related items</Muted>
				{#each related as item}
					<a href={href(item.link)}>
						<Badge>{item.name}</Badge>
					</a>
				{/each}
			</div>
		{/if}
	{/if}
</BasePage>
