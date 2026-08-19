<script lang="ts">
	export let title = 'Title';
	export let suffix: string | undefined = undefined;
</script>

<svelte:head>
	<title>{suffix ? `${title} | ${suffix}` : title}</title>
</svelte:head>
