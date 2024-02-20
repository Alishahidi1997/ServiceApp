import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, Typography, Divider,
  Card, CardContent, CardMedia,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

import {
  getRequested, approveRequest,
} from './mapping';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    maxWidth: '40%',
    marginLeft: '25%',
    marginBottom: '4%',
    backgroundColor: '#8eacbb',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    padding: 5,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const Row = (props) => {
  const { requested, onApprove } = props;
  const classes = useStyles();

  let showList = requested;
  // showList = showList.map((i) => {
  //   if (i.thumbnail.startsWith('uploads')) {
  //     return { ...i, thumbnail: i.thumbnail.replace('uploads\\', 'uploads/') };
  //   }
  //   return i;
  // });

  return (
    <div>
      {showList.map((request) => (
        <Card className={classes.root} key={request._id}>
          <CardMedia
            className={classes.cover}
            image={request.resource.thumbnail}
            title="Live from space album cover"
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography>
                {`Service: ${`${request.resource.title}`}`}
              </Typography>
              <Typography>
                {`Name: ${`${request.consumer.firstName} ${request.consumer.lastName}`}`}
              </Typography>
              <Typography>
                {`Email: ${request.consumer.email}`}
              </Typography>
              <Typography>
                {`Address: ${request.consumer.location.address}`}
              </Typography>
              <Divider style={{ marginTop: '1%', marginBottom: '1%' }} />
              {request.status === 'pending' && (
                <Button variant="outlined" color="primary" onClick={() => onApprove(request)}>
                  Approve
                </Button>
              )}
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};

const RequestedServices = (props) => {
  const {
    setLoading, setAlert,
  } = props;

  const [requested, setRequested] = useState([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    getRequested({
      setLoading, setAlert, setRequested,
    });
  }, [setAlert, setLoading]);

  return (
    <div>
      <Button onClick={() => navigate(-1)}>Back</Button>
      <h3> Requested From You </h3>
      <Row
        requested={requested}
        onApprove={(request) => approveRequest(request, { setLoading, setAlert, setRequested })}
      />
    </div>
  );
};

export default RequestedServices;
