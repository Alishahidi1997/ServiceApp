import React from 'react';
import {
  Modal,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ShowReviews = (props) => {
  const classes = useStyles();
  const { modal, setModal, selected = {} } = props;

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

  const comments = selected && selected.comments;
  return (
    <Modal
      open={modal === 'show-reviews'}
      onClose={() => setModal('')}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div style={modalStyle} className={classes.paper}>
        {comments && comments.map((review) => (
          <div key={review.commentDate}>
            <p>{`Comment: ${review.comment}`}</p>
            <p>{`Rate: ${review.rate}`}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ShowReviews;
