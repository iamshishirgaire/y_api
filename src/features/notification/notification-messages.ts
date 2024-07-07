export class NotificationMessagesCreator {
  followNotification(followerUsername: string): string {
    return `${followerUsername} started following you.`;
  }

  mentionNotification(mentioningUsername: string): string {
    return `${mentioningUsername} mentioned you in a tweet.`;
  }

  retweetNotification(retweetingUsername: string): string {
    return `${retweetingUsername} retweeted your tweet.`;
  }

  likeNotification(likingUsername: string): string {
    return `${likingUsername} liked your tweet.}`;
  }

  replyNotification(replyingUsername: string): string {
    return `${replyingUsername} replied to your tweet.`;
  }

  replyMessageNotification(replyingUsername: string): string {
    return `${replyingUsername} replied to your comment.`;
  }
  directMessageNotification(senderUsername: string): string {
    return `New direct message from ${senderUsername}.`;
  }
}
