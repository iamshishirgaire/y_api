export const getChannelId = (userA: string, userB: string): string => {
  return userA > userB ? userA + userB : userB + userA;
};
