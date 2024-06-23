class NotificationManager {
  followNotification(followerUsername: string): string {
    return `${followerUsername} started following you.`;
  }

  mentionNotification(
    mentioningUsername: string,
    tweetPreview: string
  ): string {
    return `${mentioningUsername} mentioned you in a tweet: ${tweetPreview}`;
  }

  retweetNotification(
    retweetingUsername: string,
    tweetPreview: string
  ): string {
    return `${retweetingUsername} retweeted your tweet: ${tweetPreview}`;
  }

  likeNotification(likingUsername: string, tweetPreview: string): string {
    return `${likingUsername} liked your tweet: ${tweetPreview}`;
  }

  replyNotification(replyingUsername: string, tweetPreview: string): string {
    return `${replyingUsername} replied to your tweet: ${tweetPreview}`;
  }

  directMessageNotification(
    senderUsername: string,
    messagePreview: string
  ): string {
    return `New direct message from ${senderUsername}: ${messagePreview}`;
  }
}
