import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Box, TextField, Select,
  MenuItem, Button,
  Typography, Card, CardContent, CardMedia, Modal,
  Divider, InputLabel, Input,
} from '@material-ui/core';
import { Settings, Add } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';

import uploadFile from 'Shared/upload';
import ServiceCard from './ServiceCard';

import {
  createService, getMyServices, activateService, deactivateService, getRecommended,
} from './mapping';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginLeft: '5%',
    marginRight: '5%',
    backgroundColor: '#ffe6e6',
    marginBottom: '5%',
    marginTop: '5%',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: '80%',
    height: 0,
    paddingTop: '75%',
    marginTop: '30',
    margin: 'auto',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  paper: {
    position: 'absolute',
    width: 700,
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    maxHeight: 600,
    display: 'auto',
    padding: theme.spacing(2, 4, 3),
    overflow: 'auto',
  },
}));

const Row = (props) => {
  const { mine, onDeactivate, onActivate } = props;

  let showList = mine;
  // showList = mine.map((i) => {
  //   if (i.thumbnail.startsWith('uploads')) {
  //     return { ...i, thumbnail: i.thumbnail.replace('uploads\\', 'uploads/') };
  //   }
  //   return i;
  // });

  return (
    <Grid container>
      {showList.map((service) => (
        <ServiceCard
          key={service._id}
          service={service}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
      ))}
    </Grid>
  );
};

/// recommendation
const RecomRow = (props) => {
  const { recoms } = props;

  const classes = useStyles();

  let showList = recoms;
  // showList = showList.map((i) => {
  //   if (i.thumbnail.startsWith('uploads')) {
  //     return { ...i, thumbnail: i.thumbnail.replace('uploads\\', 'uploads/') };
  //   }
  //   return i;
  // });

  return (
    <Grid container>
      {showList.map((recom) => (
        <Grid item md={4} key={recom._id}>
          <Card className={classes.root} key={recom._id}>
            <CardMedia
              className={classes.cover}
              image={recom.thumbnail}
              title="Live from space album cover"
            />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h6" variant="h6">
                  {`Location: ${recom.location.address}`}
                </Typography>
                <Typography component="h6" variant="h6">
                  {`Service: ${recom.title}`}
                </Typography>
                <Typography component="h6" variant="h6">
                  {`Description: ${recom.description}`}
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>

  );
};
/// finish recommendation

const NewService = (props) => {
  const {
    serviceTypes, onCreate, setLoading, setAlert, modal, setModal,
  } = props;
  const [data, setData] = useState({
    title: '',
    description: '',
    cost: '',
    location: {
      address: '',
      lat: 0,
      long: 0,
    },
    isProfessional: false,
    thumbnail: '',
    expertise: '',
  });
  const classes = useStyles();

  function getModalStyle() {
    const top = 25;
    const left = 35;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  const [modalStyle] = React.useState(getModalStyle);

  const handleChange = (prop, val) => {
    if (prop === 'location.address') {
      setData((prev) => ({ ...prev, location: { ...prev.location, address: val } }));
    } else {
      setData((prev) => ({ ...prev, [prop]: val }));
    }
  };
  const onUpload = (file) => {
    uploadFile(file, { setLoading, setAlert, setUrl: (url) => handleChange('thumbnail', url) });
  };
  const handleAddress = (value) => {
    const newLocation = data.location;
    newLocation.address = value;
    handleChange('location', newLocation);
  };
  const handleLocation = async () => {
    const geoLocation = navigator.geolocation;
    const cords = (position) => {
      const newLocation = data.location;
      newLocation.lat = position.coords.latitude;
      newLocation.long = position.coords.longitude;
      handleChange('location', newLocation);
    };
    const error = (e) => {
      setAlert(e.message);
    };
    geoLocation.getCurrentPosition(cords, error, { timeout: 60000 });
  };

  return (
    <Modal
      open={modal === 'ADD'}
      onClose={() => setModal('')}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box p={5} flexWrap="wrap" my="50px" style={modalStyle} className={classes.paper}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" component="h5">
              Create a New Service
            </Typography>
            <Divider style={{ marginTop: '1%', marginBottom: '1%' }} />
          </Grid>
          <Grid item xs={6} style={{ marginTop: '3%', paddingRight: '1%' }}>
            <InputLabel style={{ marginBottom: '1%' }}>
              Upload Image
            </InputLabel>
            <Input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={(e) => onUpload(e.target.files[0])}
            />
            {/* <label htmlFor="icon-button-file">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label> */}
          </Grid>
          <Grid item xs={6} style={{ marginTop: '3%', paddingRight: '1%' }}>
            <InputLabel style={{ marginBottom: '1%' }}>
              Service Types
            </InputLabel>
            <Select
              style={{ width: '100%' }}
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
              variant="outlined"
              placeholder="None"
            >
              {serviceTypes.map((s) => (
                <MenuItem value={s} key={s}>{s}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6} style={{ marginTop: '3%', paddingRight: '1%' }}>
            <InputLabel style={{ marginBottom: '1%' }}>
              Location
            </InputLabel>
            <TextField
              style={{ width: '100%' }}
              fullWidth
              multiline
              id="Lo"
              variant="outlined"
              onChange={(e) => handleAddress(e.target.value)}
            />
            <Button style={{ marginTop: '1%' }} variant="outlined" color="primary" onClick={() => handleLocation()}>Use Current Location</Button>
          </Grid>
          <Grid item xs={6} style={{ marginTop: '3%', paddingRight: '1%' }}>
            <InputLabel style={{ marginBottom: '1%' }}>
              Are you professional?
            </InputLabel>
            <Select
              value={data.isProfessional}
              onChange={(e) => handleChange('isProfessional', e.target.value)}
              variant="outlined"
              placeholder="None"
            >
              <MenuItem value>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </Grid>
          {!data.isProfessional && (
            <Grid item xs={6} style={{ marginTop: '3%', paddingRight: '1%' }}>
              <InputLabel style={{ marginBottom: '1%' }}>
                Please specify your level of expertise
              </InputLabel>
              <TextField
                variant="outlined"
                onChange={(e) => handleChange('expertise', e.target.value)}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={6} style={{ marginTop: '3%', paddingRight: '1%' }}>
            <InputLabel style={{ marginBottom: '1%' }}>
              Please enter the cost for your service
            </InputLabel>
            <TextField
              id="cost"
              variant="outlined"
              onChange={(e) => handleChange('cost', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '3%', paddingRight: '1%' }}>
            <InputLabel component="h5" variant="h6">
              Description
            </InputLabel>
            <TextField
              fullWidth
              multiline
              minRows={2}
              id="Desc"
              variant="outlined"
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>
          <Button style={{ marginTop: '1%' }} variant="outlined" color="primary" onClick={() => onCreate(data)}>
            Save
            <Add style={{ marginRight: '1%' }} />
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

const MyServices = (props) => {
  const {
    setLoading, setAlert, user,
  } = props;

  const [myServices, setMyServices] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [modal, setModal] = useState('');

  React.useEffect(() => {
    getRecommended({ setRecommended, setLoading, setAlert });
  }, [setAlert, setLoading]);

  const navigate = useNavigate();

  React.useEffect(() => {
    getMyServices({
      setLoading, setAlert, setMyServices, setServiceTypes,
    });
  }, [setAlert, setLoading]);

  return (
    <div>
      <Button onClick={() => navigate(-1)}>Back</Button>
      <Button variant="outlined" color="primary" onClick={() => { setModal('ADD'); }}>Create a Service</Button>
      <Divider style={{ marginTop: '1%', marginBottom: '1%' }} />
      <Typography variant="h4" component="h4">
        <Settings style={{ marginRight: '1%' }} />
        Service Management
      </Typography>
      <Divider style={{ marginTop: '1%', marginBottom: '1%' }} />
      <NewService
        onCreate={(data) => {
          setModal(null);
          createService(data, { setLoading, setAlert, setMyServices });
        }}
        serviceTypes={serviceTypes}
        setLoading={setLoading}
        setAlert={setAlert}
        modal={modal}
        setModal={setModal}
      />
      <Row
        mine={myServices}
        onActivate={(id) => activateService(id, { setLoading, setAlert, setMyServices })}
        onDeactivate={(id) => deactivateService(id, { setLoading, setAlert, setMyServices })}
      />
      {recommended && (recommended.length !== 0) && (
        <>
          <h1>You may also like the following services</h1>
          <RecomRow
            recoms={recommended}
          />
        </>
      )}
    </div>
  );
};

export default MyServices;
