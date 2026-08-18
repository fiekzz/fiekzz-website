import { env } from '$env/dynamic/private';
import type { OutlineConfig } from './outline';

export const outlineConfig: OutlineConfig = {
	apiUrl: env.OUTLINE_API_URL,
	apiKey: env.OUTLINE_API_TOKEN
};

export const APP_USER_ID = env.USERID;
