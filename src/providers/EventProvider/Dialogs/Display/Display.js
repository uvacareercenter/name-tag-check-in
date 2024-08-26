import { Dialog, useMediaQuery } from '@mui/material';
import { useEvent } from '../../index';
import { useEffect, useState } from 'react';
import useStyles from './styles';
import { extractColors } from '../../../../components/display/utils';
import { Title, Header, EmployerScroller
} from '../../../../components/display/components';

export default function Display({ open, setOpen }) {
  const classes = useStyles();
  const { display } = useEvent();
  const [processedImages, setProcessedImages] = useState(new Set());
  const [colors, setColors] = useState({});

  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isSponsoredEvent = display.some(item => item['Sponsor'] === 'TRUE' && item['Checked-in'] === 'TRUE');


  const employerSponsorRows = 1;
  const employerCheckedInRows = isSponsoredEvent ? isPortrait ? 4 : 2 : isPortrait ? 5 : 3;
  const employerNotCheckedInRows = isSponsoredEvent ? isPortrait ? 2 : 1 : 2;
  const itemWidth = isPortrait ? 492 : 440;

  useEffect(() => {
    const imageFilter = display.filter(
      item => item['Checked-in'] === 'TRUE' &&
        item.imageUrl !== "/api/uploads/logos/default.png" &&
        !processedImages.has(item.imageUrl)
    );

    if (imageFilter.length > 0) {
      const fetchColors = async () => {
        const newColors = await extractColors(imageFilter);
        setColors(prevColors => ({
          ...prevColors,
          ...newColors
        }));
        setProcessedImages(prevProcessedImages => {
          const updatedSet = new Set(prevProcessedImages);
          imageFilter.forEach(item => updatedSet.add(item.imageUrl));
          return updatedSet;
        });
      };

      fetchColors().then();
    }
  }, [display, processedImages]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
      <Title name={"EMPLOYERS"} classes={classes}/>
      <div className={classes.sectionsWrapper}>
        {isSponsoredEvent && (
          <>
            <Header name={"Sponsors at Today's Event"} classes={classes}/>
            <EmployerScroller
              style={{ height: isPortrait ? '15.5%' : '24%', padding: '1em' }}
              data={display}
              colors={colors}
              isSponsor={true}
              classes={classes}
              isCheckedIn={true}
              itemWidth={itemWidth}
              isPortrait={isPortrait}
              rows={employerSponsorRows}
            />
          </>
        )}
        <Header name={"At Today's Event"} classes={classes}/>
        <EmployerScroller
          style={{
            height: isSponsoredEvent ? isPortrait ? '51.5%' : '44%' : isPortrait ? '70%' : '60%' ,
            padding: '1em'
          }}
          data={display}
          colors={colors}
          classes={classes}
          isCheckedIn={true}
          itemWidth={itemWidth}
          isPortrait={isPortrait}
          rows={employerCheckedInRows}
        />
        <Header name={"Not Here"} classes={classes}/>
        <EmployerScroller
          style={{
            height: isSponsoredEvent ? isPortrait ? '18%' : '17%' : isPortrait ? '20%' : '30%',
            padding: '1em'
          }}
          data={display}
          classes={classes}
          itemWidth={itemWidth}
          isPortrait={isPortrait}
          rows={employerNotCheckedInRows}
        />
      </div>
    </Dialog>
  );
}
