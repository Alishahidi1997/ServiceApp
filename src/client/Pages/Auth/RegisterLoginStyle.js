import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: (marginTop) => ({
      backgroundColor: '#8eacbb',
      width: '15%',
      // padding: '2%',
      margin: 'auto',
      marginTop: theme.spacing(marginTop),
      overflow: 'auto',
      opacity: '90%',
    }),
    cover: {
      backgroundImage: 'url(sample_images/simple.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',  // Full viewport height
      width: '100vw',   // Full viewport width
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }));

export default useStyles;