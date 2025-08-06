import { Dialog, DialogContent, List, ListItem, ListItemText, ListSubheader, Box } from '@mui/material';
import { useEvent } from '../../index';
import { Title } from '../../../../components/display/components';
import styles from './styles';

export default function Admin({ open, setOpen }) {
  const { display } = useEvent();

  const isSponsoredEvent = display.some(item => item['Sponsor'] === 'TRUE' && item['Checked-in'] === 'TRUE');
  const sponsorsCheckedIn = display.filter(display => display['Checked-in'] === 'TRUE' && display['Sponsor'] === 'TRUE')
  const sponsorsNotCheckedIn = display.filter(display => display['Checked-in'] !== 'TRUE' && display['Sponsor'] === 'TRUE')
  const employersCheckedIn = display.filter(display => display['Checked-in'] === 'TRUE' && display['Sponsor'] !== 'TRUE')
  const employersNotCheckedIn = display.filter(display => display['Checked-in'] !== 'TRUE' && display['Sponsor'] !== 'TRUE')

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
      <Title name={"ADMIN VIEW"} classes={styles.title}/>
      <DialogContent sx={{ padding: 0 }}>
        <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {isSponsoredEvent && (
            <Box style={{ maxHeight: '25%', display: 'flex', justifyContent: 'space-between', padding: '1em 1em 0 1em', gap: '1em' }}>
              <List
                sx={styles.list}
              >
                <ListSubheader sx={styles.subheader}>
                  Sponsors Checked-in
                </ListSubheader>
                <Box sx={styles.listWrapper}>
                  {sponsorsCheckedIn.map((item, index) => (
                    <ListItem key={index} sx={{ padding: '1px 16px'}}>
                      <ListItemText sx={{ '& span': { lineHeight: '1' }}} primary={item['Employers Name']} />
                    </ListItem>
                  ))}
                </Box>
              </List>
              <List
                sx={styles.list}
              >
                <ListSubheader sx={styles.subheader}>
                  Sponsors Not Checked-in
                </ListSubheader>
                <Box sx={styles.listWrapper}>
                  {sponsorsNotCheckedIn.map((item, index) => (
                    <ListItem key={index} sx={{ padding: '1px 16px'}}>
                      <ListItemText sx={{ '& span': { lineHeight: '1' }}} primary={item['Employers Name']} />
                    </ListItem>
                  ))}
                </Box>
              </List>
            </Box>
          )}
          <Box style={{ display: 'flex', justifyContent: 'space-between', padding: '1em', gap: '1em', overflow: 'auto' }}>
            <List
              sx={styles.list}
            >
              <ListSubheader sx={styles.subheader}>
                Employers Checked-in
              </ListSubheader>
              <Box sx={styles.listWrapper}>
                {employersCheckedIn.map((item, index) => (
                  <ListItem key={index} sx={{ padding: '0 16px'}}>
                    <ListItemText sx={{ '& span': { lineHeight: '1' }}} primary={item['Employers Name']} />
                  </ListItem>
                ))}
              </Box>
            </List>
            <List
              sx={styles.list}
            >
              <ListSubheader sx={styles.subheader}>
                Employers Not Checked-in
              </ListSubheader>
              <Box sx={styles.listWrapper}>
                {employersNotCheckedIn.map((item, index) => (
                  <ListItem key={index} sx={{ padding: '1px 16px'}}>
                    <ListItemText sx={{ '& span': { lineHeight: '1' }}} primary={item['Employers Name']} />
                  </ListItem>
                ))}
              </Box>
            </List>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}