<script lang="ts">
	import EmptyResult from '$lib/components/common/empty-result/empty-result.svelte';
	import SearchPage from '$lib/components/common/search-page/search-page.svelte';
	import ProjectCard from '$lib/components/projects/project-card.svelte';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import type { HexColor } from '$lib/data/colors.js';
	import type { Project, Skill, SkillCategory } from '$lib/data/types';

	interface SkillFilter extends Skill {
		isSelected?: boolean;
	}

	let { data } = $props()

	let newProjects: Array<Project> = data.projects.map((it) => {

		let skills: Array<Skill<string>> = it.skills.map((skill) => {
			let skillCategory: SkillCategory = {
				slug: skill.skillsCategory?.id ?? '',
				name: skill.skillsCategory?.name ?? ''
			}

			return {
				name: skill.name,
				logo: skill.logo?.mediaURL || '',
				slug: skill.id,
				color: `#${skill.color || '000000'}` as HexColor,
				category: skillCategory,
				description: skill.markdown?.mediaURL ?? ''
			}
		})

		let project: Project = {
			links: it.links.map((link) => {
				return {
					to: link.link,
					label: link.label
				}
			}),
			color: `#${it.color}` as HexColor,
			period: {
				from: it.periodFrom ? it.periodFrom : new Date(),
				to: it.periodTo ? it.periodTo : new Date()
			},
			skills: skills,
			type: it.type,
			slug: it.id,
			name: it.name ?? '',
			description: it.shortDescription ?? '',
			shortDescription: it.shortDescription ?? '',
			logo: it.logo?.mediaURL || ''
		}

		return project
	})

	let filters: Array<SkillFilter> = $state(
		data.skills
			.filter((it) => {
				return newProjects.some((project) => {
					return project.skills.some((skill) => skill.slug === it.id)
				})
			})
			.map((it) => ({
				name: it.name,
				logo: it.logo?.mediaURL ?? '',
				slug: it.id,
				color: `#${it.color || '000000'}` as HexColor,
				category: {
					slug: it.skillsCategoryId ?? '',
					name: data.skills?.find((cat) => cat.id === it.skillsCategoryId)?.name ?? ''
				},
				description: it.markdownId ? data.skills?.find((md) => md.id === it.markdownId)?.markdown?.mediaURL ?? '' : '',
				isSelected: false
			}))
	)

	let search = $state('');
	let result = $derived(
		newProjects.filter((project) => {
			const isFiltered =
				filters.every((item) => !item.isSelected) ||
				project.skills.some((tech) =>
					filters.some((filter) => filter.isSelected && filter.slug === tech.slug)
				);

			const isSearched =
				search.trim().length === 0 ||
				project.name.trim().toLowerCase().includes(search.trim().toLowerCase());

			return isFiltered && isSearched;
		})
	);

	const toggleSelected = (slug: string) => {
		filters = filters.map((it) => (it.slug === slug ? { ...it, isSelected: !it.isSelected } : it));
	};

	const onSearch = (query: string) => (search = query);
</script>

<SearchPage title="Projects" {onSearch}>
	<div class="flex flex-1 flex-col gap-8">
		<div class="flex flex-row flex-wrap gap-2">
			{#each filters as it (it.slug)}
				<Toggle
					pressed={it.isSelected}
					variant="outline"
					class="flex flex-row items-center gap-2 rounded-lg"
					on:click={() => toggleSelected(it.slug)}
				>
					{#if it.isSelected}
						<Icon icon="i-carbon-close" />
					{/if}
					{it.name}</Toggle
				>
			{/each}
		</div>
		{#if result.length === 0}
			<EmptyResult />
		{:else}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each result as it (it.slug)}
					<ProjectCard project={it} />
				{/each}
			</div>
		{/if}
	</div>
</SearchPage>
