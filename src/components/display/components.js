import React, { useRef } from 'react';
import { generateGridData, generateRowStyle } from './utils';
import { AppBar, Toolbar, Typography } from '@mui/material';

const useContainerRef = () => {
  return useRef(null);
};

export const Title = ({ name, classes }) => {
  return (
    <AppBar position="relative" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h1" className={classes.title}>
          {name}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export const Header = ({ name, classes }) => {
  return (
    <div className={classes.sectionHeader}>
      <Typography variant="h2" className={classes.sectionTitle}>
        {name}
      </Typography>
    </div>
  );
};

export const EmployerScroller = ({ isCheckedIn, isSponsor, style, data, colors, classes, rows, itemWidth }) => {
  const containerRef = useContainerRef();

  const employerData = data.filter(item => {
    if (isSponsor) {
      return item['Checked-in'] === 'TRUE' && item['Sponsor'] === 'TRUE';
    } else if (isCheckedIn) {
      return item['Checked-in'] === 'TRUE' && item['Sponsor'] !== 'TRUE';
    } else {
      return item['Checked-in'] !== 'TRUE';
    }
  });

  const gridData = generateGridData(employerData, rows);

  return (
    <div style={style}>
      {gridData.map((row, rowIndex) => {
        const rowStyle = generateRowStyle(row, rowIndex, containerRef, rows, isSponsor, itemWidth);
        return (
          <div
            key={rowIndex}
            className={row.length > 2 ? classes.scroll : ''}
            style={rowStyle}
          >
            {isCheckedIn
              ? (row.length > 2 ? [...row, ...row] : row).map((item, itemIndex) => (
                <div key={itemIndex} className={classes.item}>
                  <div
                    className={classes.itemName}
                    style={{ backgroundColor: colors[item['Employers Name'] ] }}
                  >
                    <span>{item['Employers Name']}</span>
                  </div>
                  <div className={classes.itemContent}>
                    <div className={classes.imageWrapper}>
                      <img
                        src={item.imageUrl}
                        alt={`${item['Employers Name']}`}
                        className={classes.itemImage}
                      />
                    </div>
                    <div className={classes.itemInfo}>
                      {item['Industries Name'] && item['Industries Name'].trim() !== '' && (
                        <span className={classes.itemInfoText}>
                          {item['Industries Name']}
                        </span>
                      )}
                      {item['Job Postings Count'] && item['Job Postings Count'].trim() !== '#N/A' && (
                        <span className={classes.itemInfoText}>
                          {item['Job Postings Count']} Job Postings on Handshake
                        </span>
                      )}
                      {item['Room Name'] && item['Room Name'].trim() !== '' && item['Table #'] && item['Table #'].trim() !== '' ? (
                        <span className={classes.itemInfoText}>
                          Table {item['Table #']} - {item['Room Name']}
                        </span>
                      ) : item['Room Name'] && item['Room Name'].trim() !== '' ? (
                        <span className={classes.itemInfoText}>
                          {item['Room Name']}
                        </span>
                      ) : item['Table #'] && item['Table #'].trim() !== '' ? (
                        <span className={classes.itemInfoText}>
                          Table {item['Table #']}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              )) : (row.length > 2 ? [...row, ...row] : row).map((item, itemIndex) => (
                <div key={itemIndex} className={classes.itemNotHere}>
                  <div className={classes.imageWrapper}>
                    <img
                      src={item.imageUrl}
                      alt={`${item['Employers Name']}`}
                      className={classes.itemImage}
                    />
                  </div>
                  <div className={classes.itemContentNotHere}>
                    <span>{item['Employers Name']}</span>
                  </div>
                </div>
              ))
            }
          </div>
        );
      })}
    </div>
  );
};
