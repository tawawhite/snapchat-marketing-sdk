import { OAuthClient } from 'simple-oauth2';
import { ISCOptions } from '../interfaces/SCConfigInterfaces';
import { sendRequest } from '../utils/request';
import {
  ISCCampaignConfig,
  ISCApiCampaignResponse,
  ISCDeleteCampaignResponses,
  IUpdateCampaignOptions,
} from '../interfaces/SCCampaignInterface';

export default class Campaigns {
  private urls: { allCampaigns: string; specificCampaign: string };

  constructor(private options: ISCOptions, private oauth2: OAuthClient) {
    this.urls = {
      allCampaigns: 'https://adsapi.snapchat.com/v1/adaccounts',
      specificCampaign: 'https://adsapi.snapchat.com/v1/campaigns',
    };
  }

  /**
   * @param {ISCCampaignConfig} config
   * @returns {Promise<ISCApiCampaignResponse>}
   */
  public async create(config: ISCCampaignConfig): Promise<ISCApiCampaignResponse> {
    if (!config.ad_account_id) throw new Error('Missing config!');

    const body = {
      campaigns: [config],
    };

    return sendRequest(
      `${this.urls.allCampaigns}/${config.ad_account_id}/campaigns`,
      { method: 'POST', body },
      this.options,
      this.oauth2,
    );
  }

  /**
   * @param {string} adAccountId
   * @returns {Promise<ISCApiCampaignResponse>}
   */
  public async getAll(adAccountId: string): Promise<ISCApiCampaignResponse> {
    if (!adAccountId) throw new Error('Missing adAccountId!');

    return sendRequest(
      `${this.urls.allCampaigns}/${adAccountId}/campaigns`,
      { method: 'GET' },
      this.options,
      this.oauth2,
    );
  }

  /**
   * @param {string} adAccountId
   * @param {IUpdateCampaignOptions} campaigns
   * @returns {Promise<ISCApiCampaignResponse>}
   */
  public async updateCampaign(
    adAccountId: string,
    campaigns: IUpdateCampaignOptions,
  ): Promise<ISCApiCampaignResponse> {
    if (!adAccountId) throw new Error('Missing adAccountId!');

    const body = {
      campaigns,
    };

    return sendRequest(
      `${this.urls.allCampaigns}/${adAccountId}/campaigns`,
      { method: 'PUT', body },
      this.options,
      this.oauth2,
    );
  }

  /**
   * @param {string} campaignId
   * @returns {Promise<ISCApiCampaignResponse>}
   */
  public async getById(campaignId: string): Promise<ISCApiCampaignResponse> {
    if (!campaignId) throw new Error('Missing campaignId!');

    return sendRequest(
      `${this.urls.specificCampaign}/${campaignId}`,
      { method: 'GET' },
      this.options,
      this.oauth2,
    );
  }

  /**
   * @param {string} campaignId
   * @returns {Promise<ISCDeleteCampaignResponses>}
   */
  public async delete(campaignId: string): Promise<ISCDeleteCampaignResponses> {
    if (!campaignId) throw new Error('Missing campaignId!');

    return sendRequest(
      `${this.urls.specificCampaign}/${campaignId}`,
      { method: 'DELETE' },
      this.options,
      this.oauth2,
    );
  }
}
