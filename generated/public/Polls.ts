// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type UsersId } from './Users';
import { type default as Visibility } from './Visibility';

/** Identifier type for public.polls */
export type PollsId = string & { __brand: 'PollsId' };

/** Represents the table public.polls */
export default interface Polls {
  id: PollsId;

  user_id: UsersId | null;

  title: string;

  description: string | null;

  options: string[];

  visibility: Visibility;

  created_at: Date;

  updated_at: Date;
}

/** Represents the initializer for the table public.polls */
export interface PollsInitializer {
  id: PollsId;

  user_id?: UsersId | null;

  title: string;

  description?: string | null;

  options: string[];

  /** Default value: 'public'::visibility */
  visibility?: Visibility;

  /** Default value: CURRENT_TIMESTAMP */
  created_at?: Date;

  /** Default value: CURRENT_TIMESTAMP */
  updated_at?: Date;
}

/** Represents the mutator for the table public.polls */
export interface PollsMutator {
  id?: PollsId;

  user_id?: UsersId | null;

  title?: string;

  description?: string | null;

  options?: string[];

  visibility?: Visibility;

  created_at?: Date;

  updated_at?: Date;
}
