// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type UsersId } from './Users';
import { type default as Visibility } from './Visibility';

/** Identifier type for public.polls */
export type PollsId = string & { __brand: 'PollsId' };

/** Represents the table public.polls */
export default interface Polls {
  id: PollsId;

  user_id: UsersId;

  description: string | null;

  options: string[];

  visibility: Visibility;

  comment_count: string;

  view_count: string;

  like_count: string;

  vote_count: string;

  created_at: Date;

  updated_at: Date;
}

/** Represents the initializer for the table public.polls */
export interface PollsInitializer {
  id: PollsId;

  user_id: UsersId;

  description?: string | null;

  options: string[];

  /** Default value: 'public'::visibility */
  visibility?: Visibility;

  /** Default value: 0 */
  comment_count?: string;

  /** Default value: 0 */
  view_count?: string;

  /** Default value: 0 */
  like_count?: string;

  /** Default value: 0 */
  vote_count?: string;

  /** Default value: CURRENT_TIMESTAMP */
  created_at?: Date;

  /** Default value: CURRENT_TIMESTAMP */
  updated_at?: Date;
}

/** Represents the mutator for the table public.polls */
export interface PollsMutator {
  id?: PollsId;

  user_id?: UsersId;

  description?: string | null;

  options?: string[];

  visibility?: Visibility;

  comment_count?: string;

  view_count?: string;

  like_count?: string;

  vote_count?: string;

  created_at?: Date;

  updated_at?: Date;
}
