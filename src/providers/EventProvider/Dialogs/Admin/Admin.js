import { Dialog, DialogContent, List, ListItem, ListItemText, ListSubheader } from '@mui/material';
import { useEvent } from '../../index';
import { Title } from '../../../../components/display/components';
import useStyles from './styles';

export default function Admin({ open, setOpen }) {
  const { display } = useEvent();
  const classes = useStyles();

  const isSponsoredEvent = display.some(item => item['Sponsor'] === 'TRUE' && item['Checked-in'] === 'TRUE');
  const sponsorsCheckedIn = display.filter(display => display['Checked-in'] === 'TRUE' && display['Sponsor'] === 'TRUE')
  const sponsorsNotCheckedIn = display.filter(display => display['Checked-in'] !== 'TRUE' && display['Sponsor'] === 'TRUE')
  const employersCheckedIn = display.filter(display => display['Checked-in'] === 'TRUE' && display['Sponsor'] !== 'TRUE')
  const employersNotCheckedIn = display.filter(display => display['Checked-in'] !== 'TRUE' && display['Sponsor'] !== 'TRUE')

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
      <Title name={"ADMIN VIEW"} classes={classes}/>
      <DialogContent sx={{ padding: 0 }}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {isSponsoredEvent && (
            <div style={{ maxHeight: '25%', display: 'flex', justifyContent: 'space-between', padding: '1em 1em 0 1em', gap: '1em' }}>
              <List
                className={classes.list}
              >
                <ListSubheader className={classes.subheader}>
                  Sponsors Checked-in
                </ListSubheader>
                <div className={classes.listWrapper}>
                  {sponsorsCheckedIn.map((item, index) => (
                    <ListItem key={index} sx={{ padding: '1px 16px'}}>
                      <ListItemText sx={{ '& span': { lineHeight: '1' }}} primary={item['Employers Name']} />
                    </ListItem>
                  ))}
                </div>
              </List>
              <List
                className={classes.list}
              >
                <ListSubheader className={classes.subheader}>
                  Sponsors Not Checked-in
                </ListSubheader>
                <div className={classes.listWrapper}>
                  {sponsorsNotCheckedIn.map((item, index) => (
                    <ListItem key={index} sx={{ padding: '1px 16px'}}>
                      <ListItemText sx={{ '& span': { lineHeight: '1' }}} primary={item['Employers Name']} />
                    </ListItem>
                  ))}
                </div>
              </List>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1em', gap: '1em', overflow: 'auto' }}>
            <List
              className={classes.list}
            >
              <ListSubheader className={classes.subheader}>
                Employers Checked-in
              </ListSubheader>
              <div className={classes.listWrapper}>
                {employersCheckedIn.map((item, index) => (
                  <ListItem key={index} sx={{ padding: '0 16px'}}>
                    <ListItemText sx={{ '& span': { lineHeight: '1' }}} primary={item['Employers Name']} />
                  </ListItem>
                ))}
              </div>
            </List>
            <List
              className={classes.list}
            >
              <ListSubheader className={classes.subheader}>
                Employers Not Checked-in
              </ListSubheader>
              <div className={classes.listWrapper}>
                {employersNotCheckedIn.map((item, index) => (
                  <ListItem key={index} sx={{ padding: '1px 16px'}}>
                    <ListItemText sx={{ '& span': { lineHeight: '1' }}} primary={item['Employers Name']} />
                  </ListItem>
                ))}
              </div>
            </List>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}