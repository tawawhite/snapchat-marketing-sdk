export interface ISCCampaignConfig {
	name: string;
	ad_account_id: string;
	status: string;
	start_time: string;
}

export interface ISCApiCampaignResponse {
	request_status: string;
	request_id: string;
	campaigns: {
		sub_request_status: string;
		campaign: {
			id: string;
			updated_at: Date;
			created_at: Date;
			name: string;
			ad_account_id: string;
			status: string;
			start_time: string;
		};
	}[];
}

export interface ISCDeleteCampaignResponses {
	request_status: string;
	request_id: string;
	campaigns: [];
}
