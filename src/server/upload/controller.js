const controller = ({ logger }) => ({
  uploadController: async (req) => {
    try {
      return req.files && req.files[0] && req.files[0].path.slice(4);
    } catch (err) {
      logger.error(`Upload failed. ${err.message}`);
      throw err;
    }
  },
});

export default controller;
