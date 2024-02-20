import ajax from 'Shared/ajax';

export const loginUser = async (data, { setAlert, setUser, setLoading }) => {
  try {
    setAlert(null);
    setLoading(true);
    const result = await ajax('post', '/api/users/login', { data });
    localStorage.setItem('user', JSON.stringify(result));
    setUser(result);
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};

export const registerUser = async (data, { setAlert, setUser, setLoading }) => {
  try {
    setAlert(null);
    setLoading(true);
    const result = await ajax('post', '/api/users/register', { data });
    localStorage.setItem('user', JSON.stringify(result));
    setUser(result);
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};
