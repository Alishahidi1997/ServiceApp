import ajax from './ajax';

export default async (file, { setLoading, setAlert, setUrl }) => {
  try {
    setAlert(null);
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const url = await ajax('post', '/api/upload', { data: formData }, config);
    setUrl(url);
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};
