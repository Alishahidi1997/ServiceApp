/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcryptjs';

const UserService = ({ dataRepository, logger }) => {
  const repo = dataRepository('users');

  const defaultProjection = { hashedPassword: false };

  const findUserById = async (userId, projection = defaultProjection) => {
    const filter = { _id: userId };
    const result = await repo.findOne(filter, projection);
    return result;
  };

  const findUserByEmail = async (email, projection = defaultProjection) => {
    const filter = { email };
    const result = await repo.findOne(filter, projection);
    return result;
  };

  const createUser = async (user) => {
    const {
      firstName, lastName, email, password, location,
      avatar,
    } = user;

    logger.info('Checking if the user exists.');
    const existing = await findUserByEmail(user.email);
    if (existing) {
      throw new Error('ERR_DUPLICATE_USER');
    }
    logger.info('User does not exist. Trying to create one...');

    if (!(email && password
      && firstName && lastName
      && location)) {
      throw new Error('ERR_USER_INPUT');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    // TODO: validate all user information
    const newUser = {
      firstName,
      lastName,
      location,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      hashedPassword: encryptedPassword,
      avatar: avatar || process.env.SAMPLE_AVATAR_URL,
      createDate: new Date().getTime(),
    };

    const { insertedId } = await repo.create(newUser);
    const result = {
      _id: insertedId,
      ...newUser,
      hashedPassword: undefined,
    };

    return result;
  };

  const authenticate = async (email, plainPassword) => {
    if (!(email && plainPassword)) {
      throw new Error('ERR_USER_INPUT');
    }
    const user = await findUserByEmail(email, {});
    if (!user) throw new Error('ERR_NO_USER');
    if (user.deleted === true) throw new Error('ERR_USER_DELETED');
    const match = await bcrypt.compare(plainPassword, user.hashedPassword);

    if (!match) throw new Error('ERR_AUTHENTICATION');

    return {
      ...user,
      hashedPassword: undefined,
    };
  };

  const deleteUser = async (userId) => {
    const user = await findUserById(userId);
    if (!user) throw new Error('ERR_USER_NOT_FOUND');
    if (user.deleted) throw new Error('ERR_USER_DELETED');
    const update = { deleted: true, deleteDate: new Date().getTime() };
    const filter = { _id: userId };
    const { modifiedCount } = await repo.update(filter, update);
    if (modifiedCount === 0) throw new Error('ERR_DELETE_FAILED');
  };

  return {
    findUserById,
    findUserByEmail,
    createUser,
    authenticate,
    deleteUser,
  };
};

export default UserService;
