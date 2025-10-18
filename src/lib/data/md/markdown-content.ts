

class MarkdownContent {

    markdownUrl: string;

    constructor(markdownUrl: string) {
        this.markdownUrl = markdownUrl;
    }

    async getContent(): Promise<string> {
        try {
            const response = await fetch(this.markdownUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch markdown content from ${this.markdownUrl}`);
            }
            const content = await response.text();
            return content;
        } catch (error) {
            console.error(error);
            return '';
        }
    }
}

export { MarkdownContent };