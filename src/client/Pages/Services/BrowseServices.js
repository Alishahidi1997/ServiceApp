import React, { useState } from 'react';
import {
  Button, Grid, Select, MenuItem, Divider,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

import ServiceCard from './ServiceCard';
import Review from './Review';
import ShowReviews from './ShowReviews';

import {
  logout, getServices, putComment, requestService,
} from './mapping';

const BrowseServices = (props) => {
  const {
    setLoading, setUser, setAlert, user,
  } = props;

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState('');
  const [searchedServices, setsearchedServices] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    getServices({
      setLoading,
      setAlert,
      setServices,
      user,
      setServiceTypes,
    });
  }, []);

  let showList = searchedServices
    ? services.filter((i) => i.title === searchedServices)
    : services;

  if (sortBy === 'Rate') {
    showList = showList.sort((a, b) => (b.avgRate - a.avgRate));
  }

  if (sortBy === 'Distance') {
    showList = showList.sort((a, b) => (b.distance - a.distance));
  }

  // showList = showList.map((i) => {
  //   if (i.thumbnail.startsWith('uploads')) {
  //     return { ...i, thumbnail: i.thumbnail.replace('uploads\\', 'uploads/') };
  //   }
  //   return i;
  // });
  return (
    <div>
      <Button color="secondary" onClick={() => logout({ setLoading, setAlert, setUser })}>Logout</Button>
      <Button onClick={() => navigate('/my-services')}>My Services</Button>
      <Button onClick={() => navigate('/requested-services')}>Requested Services</Button>
      <Divider style={{ marginTop: '1%', marginBottom: '0%' }} />
      <div style={{
        maxWidth: '50%', marginLeft: '25%', marginTop: '2%',
      }}
      >
        <div>
          <Select
            style={{ width: '40%', marginRight: '5%' }}
            value={searchedServices}
            onChange={(e) => setsearchedServices(e.target.value)}
            variant="outlined"
            displayEmpty
          >
            <MenuItem value="">
              All Services
            </MenuItem>
            {serviceTypes.map((s) => (
              <MenuItem value={s} key={s}>{s}</MenuItem>
            ))}
          </Select>
          <Select
            style={{ width: '20%' }}
            value={sortBy}
            onChange={(e) => (setSortBy(e.target.value))}
            variant="outlined"
            displayEmpty
          >
            <MenuItem value="">
              Sort By
            </MenuItem>
            <MenuItem value="Date">Date</MenuItem>
            <MenuItem value="Rate">Rate</MenuItem>
            <MenuItem value="Distance">Distance</MenuItem>
          </Select>
        </div>
      </div>
      <Grid container>
        {showList.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            onReview={() => { setSelected(service); setModal('review'); }}
            onShowReviews={() => { setSelected(service); setModal('show-reviews'); }}
            onRequest={() => requestService(service._id, { setAlert, setLoading, setServices })}
          />
        ))}
      </Grid>
      <Review
        modal={modal}
        setModal={setModal}
        onSubmit={(data) => putComment(selected._id, data, { setAlert, setLoading, setServices })}
      />
      <ShowReviews
        modal={modal}
        setModal={setModal}
        selected={selected}
      />
    </div>
  );
};

export default BrowseServices;
