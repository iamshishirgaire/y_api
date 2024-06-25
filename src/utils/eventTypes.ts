export type MessagePayload = {
  senderId: string;
  receiverId: string;
  content: string;
};

export type NotificationPayload = {
  recipientId: string;
  message: string;
};

export type EventPayloads = {
  "message:send": MessagePayload;
  "notification:send": NotificationPayload;
};
