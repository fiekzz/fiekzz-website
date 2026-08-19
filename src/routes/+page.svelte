<script lang="ts">
	import Title from '$lib/components/common/title/title.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CarouselContent from '$lib/components/ui/carousel/carousel-content.svelte';
	import CarouselItem from '$lib/components/ui/carousel/carousel-item.svelte';
	import CarouselNext from '$lib/components/ui/carousel/carousel-next.svelte';
	import CarouselPrevious from '$lib/components/ui/carousel/carousel-previous.svelte';
	import Carousel from '$lib/components/ui/carousel/carousel.svelte';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import ResponsiveContainer from '$lib/components/ui/responsive-container/responsive-container.svelte';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import H1 from '$lib/components/ui/typography/h1.svelte';
	import Muted from '$lib/components/ui/typography/muted.svelte';
	import Assets from '$lib/data/assets';
	import { href } from '$lib/utils';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import { onMount } from 'svelte';

	let api: CarouselAPI | undefined = $state(undefined);

	let { data } = $props()

	let heroName = $derived(
		data.siteSettings ? `${data.siteSettings.firstName} ${data.siteSettings.lastName},` : ''
	);
	let heroImage = $derived(data.siteSettings?.AppMedia?.mediaURL ?? Assets.Unknown.light);
	let heroLinks = $derived([
		...data.socialLinks.map((link) => ({
			label: link.title,
			href: link.link,
			icon: link.icon ? (link.icon as `i-carbon-${string}`) : undefined,
			image: link.AppMedia?.mediaURL
		})),
		...(data.siteSettings?.email
			? [
					{
						label: 'Email',
						href: `mailto:${data.siteSettings.email}`,
						icon: 'i-carbon-at' as const,
						image: undefined
					}
				]
			: [])
	]);

	onMount(() => {
		setInterval(() => {
			if (!api) return;

			api.scrollNext();
		}, 2000);
	});
</script>

<Title title={data.siteSettings?.brandName ?? 'Home'} suffix={data.siteSettings?.suffix} />
<ResponsiveContainer className="flex flex-col justify-center flex-1">
	<div
		class="flex flex-1 flex-col items-center justify-center gap-8 px-14 md:flex-row md:justify-between"
	>
		<div
			class="flex flex-col items-center justify-center gap-4 text-center md:items-start md:text-left"
		>
			<div class="h-40 w-40 overflow-hidden">
				<img src={heroImage} alt="profile" class="h-full w-full object-cover" />
			</div>
			<H1>{heroName}</H1>
			<Muted>{data.siteSettings?.heroDescription ?? ''}</Muted>
			<div class="flex flex-row gap-1">
				{#each heroLinks as item}
					<a href={item.href} target="_blank">
						<Tooltip>
							<TooltipTrigger>
								<Button variant="outline" size="icon">
									{#if item.image}
										<img src={item.image} alt={item.label} class="h-4 w-4 object-contain" />
									{:else if item.icon}
										<Icon icon={item.icon} className="text-lg" />
									{/if}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">{item.label}</TooltipContent>
						</Tooltip>
					</a>
				{/each}
			</div>
		</div>
		<div>
			<Carousel bind:api class="w-[200px] md:ml-14" opts={{ loop: true }}>
				<CarouselContent>
					{#each data.skills as skills}
						<CarouselItem class="flex flex-col items-center justify-center gap-4">
							<img
								src={skills.logo?.mediaURL}
								class="h-[150px] w-[150px]"
								alt={skills.name}
							/>
							<a href={href(`/skills/${skills.id}`)}>
								<Button variant="ghost">
									{skills.name}
								</Button>
							</a>
						</CarouselItem>
					{/each}
				</CarouselContent>
				<CarouselNext />
				<CarouselPrevious />
			</Carousel>
		</div>
	</div>
</ResponsiveContainer>
