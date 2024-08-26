import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  appBar: {
    backgroundColor: 'rgb(0, 47, 108)',
    height: '10%',
    justifyContent: 'center'
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 'clamp(1rem, 6vh, 8rem)',
    padding: 'clamp(0rem, 6vh, 1rem)',
    fontFamily: 'Franklin Gothic',
  },
  sectionsWrapper:{
    height: '90%',
    backgroundColor: 'dimgray',
    overflow: 'hidden'
  },
  sectionHeader: {
    height: '5%',
    backgroundColor: 'rgb(229, 114, 0)',
    display: 'flex',
    justifyContent: 'center',
    boxShadow: '' +
      'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, ' +
      'rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, ' +
      'rgba(0, 0, 0, 0.12) 0px 1px 10px 0px'
  },
  sectionTitle: {
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'Franklin Gothic',
    fontSize: 'clamp(1rem, 3vh, 3rem)',
  },
  item: {
    margin: '1em',
    borderRadius: '1em',
    fontFamily: 'Franklin Gothic',
    overflow: 'hidden'
  },
  itemNotHere: {
    display: 'flex',
    backgroundColor: 'white',
    padding: '1em',
    margin: '1em',
    borderRadius: '1em',
    fontFamily: 'Franklin Gothic',
    overflow: 'hidden'
  },
  itemName: {
    height: '25%',
    color: 'white',
    backgroundColor: 'black',
    textAlign: 'center',
    alignContent: 'center',
    fontSize: '1.6rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '0 1em'
  },
  itemContent: {
    display: 'flex',
    height: '75%',
    backgroundColor: 'white',
    padding: '0.5em 1em 1em 1em'
  },
  itemContentNotHere: {
    width: '75%',
    alignSelf: 'center',
    border: '1rem solid #0000',
    fontSize: '1.6rem',
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    lineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  imageWrapper: {
    width: '30%',
    padding: '1em',
    alignContent: 'center',
    textAlign: 'center'
  },
  itemImage: {
    maxHeight: '100%',
    maxWidth: '100%',
    verticalAlign: 'middle'
  },
  itemInfo: {
    display: 'flex',
    width: '70%',
    justifyContent: 'space-evenly',
    padding: 'clamp(0rem, 1vh, 1rem)',
    flexDirection: 'column',
    fontSize: 'clamp(0rem, 1.6vh, 1.3rem)',
    textAlign: 'left'
  },
  itemInfoText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  scroll: {
    animation: '$scroll linear infinite',
  },
  '@keyframes scroll': {
    to: {
      transform: 'translate(-50%)'
    }
  }
});

export default useStyles;
