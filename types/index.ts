export enum MemberStatus {
  Subscribed = 'subscribed',
  Unsubscribed = 'unsubscribed',
  Pending = 'pending',
  Cleaned = 'cleaned',
}

export interface ListMember {
  status: MemberStatus;
}
