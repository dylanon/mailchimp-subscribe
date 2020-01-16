import { NowRequest } from '@now/node';

export enum MemberStatus {
  Subscribed = 'subscribed',
  Unsubscribed = 'unsubscribed',
  Pending = 'pending',
  Cleaned = 'cleaned'
}

export interface ListMember {
  status: MemberStatus;
}

export type SubscribeAttributes = {
  status?: MemberStatus;
  merge_fields?: { [prop: string]: string };
  tags?: string[];
};

export interface SubscribeRequest extends NowRequest {
  body: {
    email?: string;
    mergeFields?: {
      [key: string]: string;
    };
    tags?: string[];
  };
}

export type MailchimpMemberTagConfig = { name: string; status: string };
