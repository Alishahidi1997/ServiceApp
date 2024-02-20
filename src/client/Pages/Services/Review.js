import React, { useState } from 'react';
import {
  Grid, MenuItem, TextField,
  Typography, Select, Button,
  Modal,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: 'auto',
  },
}));

const Review = (props) => {
  const classes = useStyles();
  const { modal, setModal, onSubmit } = props;

  const [review, setReview] = useState({ rate: 5, comment: '' });

  const handleChange = (prop, val) => {
    setReview((prev) => ({ ...prev, [prop]: val }));
  };

  function getModalStyle() {
    const top = 30;
    const left = 30;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <Modal
      open={modal === 'review'}
      onClose={() => { setModal(''); setReview({ rate: 5, comment: '' }); }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Grid container style={modalStyle} className={classes.paper}>
        <Grid item xs={6} style={{ marginTop: '3%', marginBottom: '3%' }}>
          <Typography>
            Rate:
          </Typography>
        </Grid>
        <Grid item xs={6} style={{ marginTop: '3%', marginBottom: '3%' }}>
          <Select
            value={review.rate}
            onChange={(e) => handleChange('rate', e.target.value)}
            variant="outlined"
            placeholder="None"
            style={{ marginBottom: '2%' }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            Feedback
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            multiline
            id="Co"
            variant="outlined"
            placeholder="Feedback"
            onChange={(e) => handleChange('comment', e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" color="primary" onClick={() => { onSubmit(review); setModal(false); }}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Review;
