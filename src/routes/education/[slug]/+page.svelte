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
	import { computeExactDuration, getMonthAndYear } from '$lib/utils';

	let { data } = $props();

	let title = $derived(`${data?.education?.organization ?? 'Not Found'} - Educations`);
	let banner = $derived(
		// ($mode == 'dark' ? data?.item?.logo.dark : data.item?.logo.light) ?? Assets.Unknown.light
		data.education?.logo?.mediaURL ?? Assets.Unknown.light
	);

	let duration = $derived(
		`${getMonthAndYear(data.education?.periodFrom)} - ${getMonthAndYear(data.education?.periodTo ?? new Date())} · ${computeExactDuration(
			data.education?.periodFrom ?? new Date(),
			data.education?.periodTo ?? new Date()
		)}`
	);
</script>

<BasePage {title}>
	{#if !data.education}
		<EmptyResult />
	{:else}
		<FancyBanner img={banner}>
			<div class="flex w-full flex-col items-center justify-center gap-4">
				<H1>{data.education.degree}</H1>
				<Muted>{data.education.organization} · {data.education.location}</Muted>
				<Muted><Muted>{duration}</Muted></Muted>
				<Separator />
				<div class="flex flex-row flex-wrap justify-center gap-2">
					{#each data.education.subjects as subject (subject)}
						<Badge variant="outline" class="flex flex-row items-center justify-center gap-2">
							<Muted>{subject}</Muted>
						</Badge>
					{/each}
				</div>
			</div>
		</FancyBanner>
		<Separator />
		{#if data.education.outlineDocUrl}
			<OutlineDocument title={data.education.degree} html={data.outlineHtml ?? Promise.resolve('')} />
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
