<script lang="ts">
	import EmptyResult from '$lib/components/common/empty-result/empty-result.svelte';
	import SearchPage from '$lib/components/common/search-page/search-page.svelte';
	import ExperienceCard from '$lib/components/experience/experience-card.svelte';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import type { HexColor } from '$lib/data/colors.js';
	import ExperienceData from '$lib/data/experience';
	import {
		contractTypes,
		type ContractType,
		type Experience,
		type Skill,
		type SkillCategory
	} from '$lib/data/types.js';

	let search = $state('');

	let { data } = $props();

	let newExperienceData: typeof ExperienceData = {
		title: 'Experience',
		items: data.experience.map((it) => {
			let skills: Array<Skill<string>> = it.skills.map((skill) => {
				let skillCategory: SkillCategory = {
					slug: skill.skillsCategory?.id ?? '',
					name: skill.skillsCategory?.name ?? ''
				};

				return {
					name: skill.name,
					logo: skill.logo?.mediaURL || '',
					slug: skill.id,
					color: `#${skill.color || '000000'}` as HexColor,
					category: skillCategory,
					description: skill.markdown?.mediaURL ?? ''
				};
			});

			let contract = contractTypes.find(
				(type) => type.value.toLowerCase() === it.type.toLowerCase()
			)?.label as ContractType;

			let experience: Experience = {
				slug: it.id,
				skills: skills,
				company: it.company,
				location: it.location,
				links: it.links.map((link) => {
					return {
						to: link.link,
						label: link.label
					};
				}),
				color: `#${it.color}` as HexColor,
				period: {
					from: it.periodFrom ? it.periodFrom : new Date(),
					to: it.periodTo ? it.periodTo : new Date()
				},
				type: it.type,
				logo: it.logo?.mediaURL || '',
				name: it.name ?? '',
				description: it.shortDescription ?? '',
				shortDescription: it.shortDescription ?? '',
				contract: contract
			};

			return experience;
		})
	};

	let result = $derived(
		newExperienceData.items.filter(
			(it) =>
				it.name.toLowerCase().includes(search.toLowerCase()) ||
				it.company.toLowerCase().includes(search.toLowerCase()) ||
				it.description.toLowerCase().includes(search)
		)
	);

	const onSearch = (query: string) => (search = query);
</script>

<SearchPage title="Experience" {onSearch}>
	{#if result.length === 0}
		<EmptyResult />
	{:else}
		<div class="flex flex-col gap-6 lg:gap-0">
			{#each result as it, index (it.slug)}
				<div class={`flex ${index % 2 !== 0 ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
					<div class="flex flex-1 flex-col justify-center lg:py-[50px]">
						<ExperienceCard {it} />
					</div>
					<div
						class="hidden h-[full] min-w-0 flex-shrink-0 flex-col items-center lg:flex"
						style="--color: hsl(var(--border) / var(--tw-border-opacity, 1)); --icon: hsl(var(--foreground) / var(--tw-border-opacity, 1))"
					>
						<div class="w-[1px] flex-1 bg-[--color]"></div>
						<div class="my-2 text-[--icon]">
							<Icon icon="i-carbon-radio-button-checked" />
						</div>
						<div class="w-[1px] flex-1 bg-[--color]"></div>
					</div>
					<div class="hidden min-w-0 flex-1 flex-shrink-0 flex-row lg:flex"></div>
				</div>
			{/each}
		</div>
	{/if}
</SearchPage>
