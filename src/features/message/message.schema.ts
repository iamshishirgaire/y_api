import { z } from "zod";

export const GetMessagesSchema = z.object({
  page: z.number(),
  page_size: z.number(),
  channel_id: z.string(),
});
export const GetMessageChannelsSchema = z.object({
  page: z.number(),
  page_size: z.number(),
  user_id: z.string().uuid(),
});
export const CreateMessageChannelSchema = z.object({
  sender_id: z.string().uuid(),
  receiver_id: z.string().uuid(),
});
export const CreateMessageSchema = z.object({
  content: z.string(),
  media_url: z.array(z.string()).optional(),
  user_id: z.string(),
  channel_id: z.string(),
});

export const UpdateMessageSchema = z.object({
  id: z.string(),
  content: z.string().optional(),
});

export const DeleteMessageSchema = z.object({
  id: z.string(),
});

export type GetMessages = z.infer<typeof GetMessagesSchema>;
export type GetMessageChannels = z.infer<typeof GetMessageChannelsSchema>;
export type CreateMessage = z.infer<typeof CreateMessageSchema>;
export type UpdateMessage = z.infer<typeof UpdateMessageSchema>;
export type DeleteMessage = z.infer<typeof DeleteMessageSchema>;
export type CreateMessageChannel = z.infer<typeof CreateMessageChannelSchema>;
