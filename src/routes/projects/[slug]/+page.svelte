<script lang="ts">
	import BasePage from '$lib/components/common/base-page/base-page.svelte';
	import EmptyResult from '$lib/components/common/empty-result/empty-result.svelte';
	import FancyBanner from '$lib/components/common/fancy-banner/fancy-banner.svelte';
	import EmptyMarkdown from '$lib/components/common/markdown/empty-markdown.svelte';
	import OutlineDocument from '$lib/components/OutlineDocument.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import H1 from '$lib/components/ui/typography/h1.svelte';
	import Muted from '$lib/components/ui/typography/muted.svelte';
	import Assets from '$lib/data/assets';
	import { computeExactDuration, getMonthAndYear, href } from '$lib/utils';


	let { data } = $props();

	let title = $derived(`${data?.project?.name ?? 'Not Found'} - Projects`);
	let banner = $derived(
		data.project?.logo?.mediaURL ?? Assets.Unknown.dark
	);

	let duration = $derived(
		`${getMonthAndYear(data.project?.periodFrom ?? new Date())} - ${getMonthAndYear(data.project?.periodTo ?? new Date())} · ${computeExactDuration(
			data.project?.periodFrom ?? new Date(),
			data.project?.periodTo ?? new Date()
		)}`
	);
</script>

<BasePage {title}>
	{#if !data.project}
		<EmptyResult />
	{:else}
		<FancyBanner img={banner}>
			<div class="flex w-full flex-col items-center justify-center gap-4">
				<H1>{data.project.name}</H1>
				<Muted>{data.project.type}</Muted>
				<Muted>{duration}</Muted>
				<Separator />
				<div class="flex flex-row flex-wrap justify-center gap-2">
					{#each data.project.links as link (link.id)}
						<a href={link.link} target="_blank"><Badge variant="outline">{link.label}</Badge></a>
					{/each}
				</div>
				<div class="flex flex-row flex-wrap justify-center gap-2">
					{#each data.project.skills as skill (skill.id)}
						<a href={href(`/skills/${skill.id}`)}>
							<Badge variant="outline" class="flex flex-row items-center justify-center gap-2">
								<img
									class="h-[20px] w-[20px]"
									src={skill.logo?.mediaURL}
									alt={skill.name}
								/>
								<Muted>{skill.name}</Muted>
							</Badge>
						</a>
					{/each}
				</div>
			</div>
		</FancyBanner>
		<Separator />
		{#if data.project.outlineDocUrl}
			<OutlineDocument title={data.project.name ?? 'Untitled Project'} html={data.outlineHtml ?? Promise.resolve('')} />
		{:else}
			<EmptyMarkdown />
		{/if}
		<!-- <Separator />
		<div class="flex flex-col gap-2 px-4 pt-4">
			{#if data.item.screenshots && data.item.screenshots.length > 0}
				<Muted>Screenshots</Muted>
				<div class="grid grid-cols-1 gap-2 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each data.item.screenshots as img, index (index)}
						<ScreenshotCard item={img} />
					{/each}
				</div>
			{/if}
		</div> -->
	{/if}
</BasePage>
