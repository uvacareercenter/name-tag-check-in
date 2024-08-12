import ColorThief from 'colorthief/dist/color-thief';

export const generateGridData = (items, rows) => {
  const gridData = [];
  const itemsPerRow = Math.floor(items.length / rows);
  const remainder = items.length % rows;
  let currentIndex = 0;

  for (let i = 0; i < rows; i++) {
    const extraItem = i < remainder ? 1 : 0;
    const rowSize = itemsPerRow + extraItem;
    gridData.push(items.slice(currentIndex, currentIndex + rowSize));
    currentIndex += rowSize;
  }

  return gridData;
};

export const calculateAnimation = (row, containerRef, itemWidth) => {
  const containerWidth = containerRef.current ? containerRef.current.offsetWidth : 0;
  const rowWidth = row.length * itemWidth
  const distance = rowWidth - containerWidth;
  const speed = 41; // pixels per second
  return distance / speed;
};

export const generateRowStyle = (row, index, containerRef, rows, isSponsor, itemWidth) => {
  const duration = calculateAnimation(row, containerRef, itemWidth)
  const offset = (index % 2 === 0 ? 0 : 6);

  return {
    height: `${100/rows}%`,
    display: 'flex',
    flexWrap: 'nowrap',
    minWidth: '100%',
    width: 'max-content',
    animationDelay: `${offset}s`,
    animationDuration: `${duration}s`,
    justifyContent: isSponsor ? 'center' : 'flex-start'
  };
};

export const extractColors = async (data) => {
  const colorThief = new ColorThief();
  const newColors = {};

  for (const item of data) {
    if (item.imageUrl !== "/uploads/logos/default.png") {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = item.imageUrl;
      await new Promise((resolve) => {
        img.onload = () => {
          const color = colorThief.getColor(img);
          newColors[item['Employers Name']] = `rgb(${color.join(',')})`;
          resolve();
        };
      });
    }
  }

  return newColors;
};