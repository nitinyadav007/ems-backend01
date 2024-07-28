export const sendUser = (user: any) => {
  return {
    sub: user.sub,
    type: user.type,
  };
};
