/* eslint-disable no-underscore-dangle */
const controller = ({ logger, userService, createToken }) => ({
  login: async (req) => {
    try {
      const {
        email, password,
      } = req.body;

      logger.info('Authenticating user.');
      const user = await userService.authenticate(email, password);

      const token = createToken({ userId: user._id });
      user.token = token;

      return user;
    } catch (err) {
      logger.error(`Login failed. ${err.message}`);
      throw err;
    }
  },

  register: async (req) => {
    try {
      const user = await userService.createUser(req.body);

      const token = createToken({ userId: user._id });
      user.token = token;

      return user;
    } catch (err) {
      logger.error(`Register failed. ${err.message}`);
      throw err;
    }
  },

  deleteUser: async (req) => {
    try {
      const { userId } = req;

      logger.info('Deleting user..');
      await userService.deleteUser(userId);
    } catch (err) {
      logger.error(`Delete failed. ${err.message}`);
      throw err;
    }
  },
});

export default controller;
