import React from 'react';
import {
  Grid, Button, Typography, Card,
  CardContent, CardMedia, Divider,
} from '@material-ui/core';

const truncateString = (str, num) => {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str;
  }
  // Return str truncated with '...' concatenated to the end of str.
  return `${str.slice(0, num)}...`;
};

export default (props) => {
  const {
    service,
    onActivate,
    onDeactivate,
    onReview,
    onShowReviews,
    onRequest,
  } = props;
  const cardStyles = {
    display: 'flex',
    marginLeft: '1%',
    marginRight: '2%',
    backgroundColor: '#8eacbb',
    marginBottom: '5%',
    marginTop: '5%',
  };
  const mediaStyles = {
    width: '50%',
  };
  const detailsStyles = {
    display: 'flex',
    flexDirection: 'column',
  };
  const contentStyles = {
    flex: '1 0 auto',
  };
  return (
    <Grid item xs={4}>
      <Card style={cardStyles} key={service._id}>
        <CardMedia
          style={mediaStyles}
          image={service.thumbnail}
          title="Live from space album cover"
        />
        <div style={detailsStyles}>
          <CardContent style={contentStyles}>
            <Typography>
              {`Service: ${service.title}`}
            </Typography>
            <Typography>
              {`Location: ${service.location.address}`}
            </Typography>
            <Typography>
              {`Description: ${truncateString(service.description, 40)}`}
            </Typography>
            {service.distance && (
              <Typography>
                {`Distance: ${service.distance} km`}
              </Typography>
            )}
            <Divider style={{ marginTop: '1%', marginBottom: '1%' }} />
            {onActivate && onDeactivate && (service.isActive
              ? (
                <Button variant="outlined" color="secondary" onClick={() => onDeactivate(service._id)}>
                  Deactivate
                </Button>
              )
              : (
                <Button variant="outlined" color="primary" onClick={() => onActivate(service._id)}>
                  Activate
                </Button>
              ))}
            {onReview && onShowReviews && onRequest && (
              <>
                <Button style={{ marginRight: '2%', marginBottom: '2%' }} variant="outlined" color="primary" onClick={() => onReview()}>Review</Button>
                <Button style={{ marginRight: '2%', marginBottom: '2%' }} variant="outlined" color="primary" onClick={() => onShowReviews()} disabled={!service.comments || !service.comments.length}>Show Review</Button>
                <Button style={{ marginRight: '2%', marginBottom: '2%' }} variant="outlined" color="primary" onClick={() => onRequest()} disabled={service.requested === true}>{service.requested ? 'Requested' : 'Request'}</Button>
              </>
            )}
          </CardContent>
        </div>
      </Card>
    </Grid>
  );
};
