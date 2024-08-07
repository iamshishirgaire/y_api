// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type MessageChannelsId } from './MessageChannels';
import { type UsersId } from './Users';

/** Identifier type for public.messages */
export type MessagesId = string & { __brand: 'MessagesId' };

/** Represents the table public.messages */
export default interface Messages {
  id: MessagesId;

  content: string | null;

  media_url: string[] | null;

  channel_id: MessageChannelsId;

  sender_id: UsersId;

  receiver_id: UsersId;

  created_at: Date;

  updated_at: Date;
}

/** Represents the initializer for the table public.messages */
export interface MessagesInitializer {
  id: MessagesId;

  content?: string | null;

  media_url?: string[] | null;

  channel_id: MessageChannelsId;

  sender_id: UsersId;

  receiver_id: UsersId;

  /** Default value: CURRENT_TIMESTAMP */
  created_at?: Date;

  /** Default value: CURRENT_TIMESTAMP */
  updated_at?: Date;
}

/** Represents the mutator for the table public.messages */
export interface MessagesMutator {
  id?: MessagesId;

  content?: string | null;

  media_url?: string[] | null;

  channel_id?: MessageChannelsId;

  sender_id?: UsersId;

  receiver_id?: UsersId;

  created_at?: Date;

  updated_at?: Date;
}
