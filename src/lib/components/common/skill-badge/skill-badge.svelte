<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	// import type { Skill } from '$lib/data/types';
	import { href } from '$lib/utils';
	// import { mode } from 'mode-watcher';

	interface ISkillBadge {
		id: string
		imageUrl: string
		name: string
	}

	// const { skill }: { skill: Skill } = $props();
	let { id, imageUrl, name }: ISkillBadge = $props()
</script>

<Tooltip openDelay={100}>
	<TooltipTrigger class="group">
		<a href={href(`/skills/${id}`)}>
			<Button size="icon" variant="outline">
				<img
					class="size-[18px] grayscale-[0.75] group-hover:grayscale-0"
					src={imageUrl}
					alt={name}
				/>
			</Button>
		</a>
	</TooltipTrigger>
	<TooltipContent>{name}</TooltipContent>
</Tooltip>
