const styles = {
  title: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 'clamp(1rem, 6vh, 8rem)',
    padding: 'clamp(0rem, 6vh, 1rem)',
    fontFamily: 'Franklin Gothic',
  },
  list: {
    width: '50%',
    position: 'relative',
    overflow: 'hidden',
    padding: 0,
    '& ul': { padding: 0 },
    boxShadow:
      'rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, ' +
      'rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, ' +
      'rgba(0, 0, 0, 0.12) 0px 1px 3px 0px',
    borderRadius: '0.5em',
  },
  subheader: {
    color: 'white',
    textAlign: 'center',
    alignContent: 'center',
    backgroundColor: 'rgb(239, 114, 0)',
    fontSize: 'clamp(0em, 2vh, 1.5rem)',
    fontWeight: 'bold',
    height: '4vh',
    lineHeight: 'normal',
  },
  listWrapper: {
    overflowY: 'auto',
    border: '1em rgba(0, 0, 0, 0)',
    borderStyle: 'solid none',
    maxHeight: 'calc(100% - 4vh)',
    '&::-webkit-scrollbar': {
      width: '16px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'lightgray',
      border: '4px solid transparent',
      borderRadius: '8px',
      backgroundClip: 'padding-box',
      minHeight: '2em',
    },
  },
};

export default styles;
