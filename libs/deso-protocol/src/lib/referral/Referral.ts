import axios from 'axios';
import { Node } from '../node/Node';
import { Identity } from '../identity/Identity';
import {
  GetReferralInfoForReferralHashRequest,
  GetReferralInfoForReferralHashResponse,
  GetReferralInfoForUserRequest,
  GetReferralInfoForUserResponse,
} from 'deso-protocol-types';
export class Referral {
  node: Node;
  identity: Identity;
  constructor(node: Node, identity: Identity) {
    this.node = node;
    this.identity = identity;
  }

  public async getReferralInfoForUser(
    request: Partial<GetReferralInfoForUserRequest>
  ): Promise<GetReferralInfoForUserResponse> {
    const endpoint = 'get-referral-info-for-user';
    return await axios.post(`${this.node.getUri()}/${endpoint}`, request);
  }

  public async getReferralInfoForReferralHash(
    request: Partial<GetReferralInfoForReferralHashRequest>
  ): Promise<GetReferralInfoForReferralHashResponse> {
    const endpoint = 'get-referral-info-for-referral-hash';
    return await axios.post(`${this.node.getUri()}/${endpoint}`, request);
  }
}
