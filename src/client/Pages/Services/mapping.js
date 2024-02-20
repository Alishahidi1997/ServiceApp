import ajax from 'Shared/ajax';

export const createService = async (data, { setLoading, setAlert, setMyServices }) => {
  try {
    setAlert(null);
    setLoading(true);
    const result = await ajax('post', '/api/resources', { data });
    setMyServices((prev) => [...prev, result]);
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};

export const activateService = async (serviceId, { setLoading, setAlert, setMyServices }) => {
  try {
    if (!window.confirm('Are you sure?')) return;
    setAlert(null);
    setLoading(true);
    await ajax('put', `/api/resources/${serviceId}/activate`);
    setMyServices((prev) => prev.map((i) => (i._id !== serviceId ? i : { ...i, isActive: true })));
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};

export const deactivateService = async (serviceId, { setLoading, setAlert, setMyServices }) => {
  try {
    if (!window.confirm('Are you sure?')) return;
    setAlert(null);
    setLoading(true);
    await ajax('put', `/api/resources/${serviceId}/deactivate`);
    setMyServices((prev) => prev.map((i) => (i._id !== serviceId ? i : { ...i, isActive: false })));
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};

const deg2rad = (deg) => (deg * (Math.PI / 180));

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

export const getMyServices = async ({
  setLoading, setAlert, setMyServices, setServiceTypes,
}) => {
  try {
    setAlert(null);
    setLoading(true);
    const result = await ajax('get', '/api/resources/mine');
    setMyServices(result);
    const types = await ajax('get', '/api/resources/types');
    setServiceTypes(types);
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};

export const getServices = async ({
  setLoading, setAlert, setServices, setServiceTypes, user,
}) => {
  try {
    setAlert(null);
    setLoading(true);
    let result = await ajax('get', '/api/resources');
    result = result.map((i) => ({
      ...i,
      distance: getDistance(i.location.lat, i.location.long, user.location.lat, user.location.long),
    }));
    setServices(result);
    const types = await ajax('get', '/api/resources/types');
    setServiceTypes(types);
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};

export const getRequested = async ({ setLoading, setAlert, setRequested }) => {
  try {
    setAlert(null);
    setLoading(true);
    const result = await ajax('get', '/api/resources/requested');
    setRequested(result);
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};

export const putComment = async (serviceId, data, { setLoading, setAlert, setServices }) => {
  try {
    setAlert(null);
    setLoading(true);
    await ajax('put', `/api/resources/${serviceId}/comment`, { data });
    const result = await ajax('get', '/api/resources');
    setServices(result);
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};

export const approveRequest = async (
  service,
  { setLoading, setAlert, setRequested },
) => {
  try {
    if (!window.confirm('Are you sure?')) return;
    setAlert(null);
    setLoading(true);
    const { resourceId, consumerId, _id: requestId } = service;
    await ajax('put', `/api/resources/${resourceId}/${consumerId}/approve`);
    await ajax('get', '/api/resources');
    setRequested((prev) => prev.map((i) => (i._id === requestId ? { ...i, status: 'approved' } : i)));
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};

export const requestService = async (serviceId, { setLoading, setAlert, setServices }) => {
  try {
    setAlert(null);
    setLoading(true);
    await ajax('post', `/api/resources/${serviceId}/request`);
    setServices((prev) => prev.map((i) => (i._id === serviceId ? { ...i, requested: true } : i)));
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};

export const logout = ({ setLoading, setAlert, setUser }) => {
  try {
    if (!window.confirm('Are you sure?')) return;
    setAlert(null);
    setLoading(true);
    localStorage.removeItem('user');
    setUser(null);
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setTimeout(() => setLoading(false), 1000);
  }
};

export const getRecommended = async ({ setLoading, setRecommended, setAlert }) => {
  try {
    setAlert(null);
    setLoading(true);
    const recommended = await ajax('get', '/api/resources/recommendations');
    setRecommended(recommended);
  } catch (error) {
    setAlert(error && error.message);
  } finally {
    setLoading(false);
  }
};
