import { OAuthClient } from 'simple-oauth2';
import * as FormData from 'form-data';
import { ISCOptions } from '../interfaces/SCConfigInterfaces';
import { getFilesizeInBytes, sendRequest } from '../utils/request';
import {
	ISCMediaConfig,
	ISCApiMediaResponse,
	ISCMediaUploadResponse
} from '../interfaces/SCMediaInterfaces';

export default class Media {
	private urls: { allMedia: string; specificMedia: string };

	private form: FormData;

	constructor(private options: ISCOptions, private oauth2: OAuthClient) {
		this.urls = {
			allMedia: 'https://adsapi.snapchat.com/v1/adaccounts',
			specificMedia: 'https://adsapi.snapchat.com/v1/media'
		};
		this.form = new FormData();
	}

	/**
	 * Creates a new Media
	 *
	 * @param {ISCMediaConfig} config
	 * @returns {Promise<ISCApiMediaResponse>}
	 */
	public async create(config: ISCMediaConfig): Promise<ISCApiMediaResponse> {
		if (!config.ad_account_id) throw new Error('Missing config!');

		const body = {
			media: [
				{
					name: config.name,
					type: config.type,
					ad_account_id: `{${config.ad_account_id}}`
				}
			]
		};

		return sendRequest(
			`${this.urls.allMedia}/${config.ad_account_id}/media`,
			{ method: 'POST', body },
			this.options,
			this.oauth2
		);
	}

	/**
	 * Max file size 30MB (max request size is 32MB)
	 *
	 * @param {string} mediaId
	 * @param {string} filename
	 * @param {Buffer} video
	 * @returns {Promise<ISCMediaUploadResponse>}
	 */
	public async uploadVideo(
		mediaId: string,
		filename: string,
		video: Buffer
	): Promise<ISCMediaUploadResponse> {
		if (!mediaId) throw new Error('Missing mediaId!');

		if (getFilesizeInBytes(video.toString('base64')) > 30000000) {
			throw new Error(`File ${filename} is to large for upload, max 30MB!`);
		}

		const body = {
			data: this.form.append('file', Buffer.from(video), {
				filename
			})
		};

		this.options.baseHttpOptions.headers['Content-Type'] = 'multipart/formdata';

		return sendRequest(
			`${this.urls.allMedia}/${mediaId}/upload`,
			{ method: 'POST', body },
			this.options,
			this.oauth2
		);
	}

	/**
	 * File type should be PNG, JPG or JPEG
	 * Minimum image size: 1080 x 1920 pixels
	 * Required Image Ratio: 9:16
	 * Max file size: 5MB
	 *
	 * @param {string} mediaId
	 * @param {string} filename
	 * @param {Buffer} file
	 * @returns {Promise<ISCMediaUploadResponse>}
	 */
	public async uploadImage(
		mediaId: string,
		filename: string,
		file: Buffer
	): Promise<ISCMediaUploadResponse> {
		if (!mediaId) throw new Error('Missing mediaId!');

		if (getFilesizeInBytes(file.toString('base64')) > 5000000) {
			throw new Error(`File ${filename} is to large for upload, max 5MB!`);
		}

		const body = {
			data: this.form.append('file', Buffer.from(file), {
				filename
			})
		};

		this.options.baseHttpOptions.headers['Content-Type'] = 'multipart/formdata';

		return sendRequest(
			`${this.urls.allMedia}/${mediaId}/upload`,
			{ method: 'POST', body },
			this.options,
			this.oauth2
		);
	}

	// TODO: implement
	public async uploadLargeInit() {}

	// TODO: implement
	public async uploadLargeAdd() {}

	// TODO: implement
	public async uploadLargeFinalize() {}

	/**
	 * This endpoint retrieves all media associated with an ad account.
	 *
	 * @param {string} adAccountId
	 * @returns {Promise<ISCApiMediaResponse>}
	 */
	public async getAll(adAccountId: string): Promise<ISCApiMediaResponse> {
		if (!adAccountId) throw new Error('Missing adAccountId!');

		return sendRequest(
			`${this.urls.allMedia}/${adAccountId}/media`,
			{ method: 'GET' },
			this.options,
			this.oauth2
		);
	}

	/**
	 * This endpoint retrieves a specific media.
	 *
	 * @param {string} mediaId
	 * @returns {Promise<ISCApiMediaResponse>}
	 */
	public async getById(mediaId: string): Promise<ISCApiMediaResponse> {
		if (!mediaId) throw new Error('Missing mediaId!');

		return sendRequest(
			`${this.urls.specificMedia}/${mediaId}`,
			{ method: 'GET' },
			this.options,
			this.oauth2
		);
	}

	// TODO: implement
	public async getPreview() {}

	// TODO: implement
	public async getThumbnail() {}
}
