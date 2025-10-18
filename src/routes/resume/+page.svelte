<script>
	import TitledPage from '$lib/components/common/titled-page/titled-page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import ResumeData from '$lib/data/resume';

	let { data } = $props();

	let resume = data.resume

</script>

<TitledPage title={ResumeData.title}>
	<a href={resume?.AppMedia.mediaURL} class="mx-auto">
		<Button>Download</Button>
	</a>
	<iframe src={resume?.AppMedia.mediaURL} class="h-[700px] w-full" title={resume?.AppMedia.mediaName}></iframe>
</TitledPage>
