const router = require('express').Router();
const ash = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const { format } = require('date-fns');
const { parse } = require("csv-parse");
const { parseAsync: parseCSV } = require('json2csv');

const csvFields = [
  { label: 'Date', value: 'date' },
  { label: 'Employer', value: 'employer' },
  { label: 'Alumni', value: 'alumni' },
  { label: 'Parent', value: 'parent' },
  { label: 'Other', value: 'other' },
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Company', value: 'company' },
  { label: 'Title', value: 'title' },
  { label: 'School', value: 'school' },
  { label: 'UVA Email Address', value: 'uvaEmail' },
  { label: 'Graduation Year', value: 'gradYear' },
];

const getFilename = (name, label, start, end) => {
  let filename

  const startDate = format(new Date(start), 'yyyy-MM-dd');
  const endDateShort = format(new Date(end), 'MM-dd');

  if (start === end) {
    filename = `${startDate}_${name}`;
  } else {
    filename = `${startDate}_${endDateShort}_${name}`;
  }

  filename += '.csv';

  return path.join(process.cwd(), 'logs', filename);
};

getAlumniFilename = () => {
  const name = format(new Date(), 'yyyy-MM')
  return path.join(process.cwd(), 'logs/Alumni Reports', name);
}

const writeCSV = async ({ filename, submission }) => {
  let fileExists = true;
  await fs.promises.stat(filename).catch(() => {
    fileExists = false;
  });

  const csv = await parseCSV(
    { ...submission, date: format(new Date(), 'yyyy-LL-dd HH:mm:ss') },
    {
      fields: csvFields,
      header: !fileExists,
    }
  );

  if (!fileExists) {
    await fs.promises.writeFile(filename, csv);
  } else {
    await fs.promises.appendFile(filename, `\n${csv}`);
  }
};

const updateDisplayCSV = async (filePath, company) => {
  const rows = [];
  const parser = fs.createReadStream(filePath)
    .pipe(parse({ columns: true, delimiter: ",", skip_empty_lines: true }));

  parser.on("data", function (row) {
    if (row["Employers Name"] === company) {
      row["Checked-in"] = 'TRUE';
    }
    rows.push(row);
  });

  parser.on("end", async function () {
    try{
      const csvOutput = await parseCSV(rows, { delimiter: "," });
      await fs.promises.writeFile(filePath, csvOutput)
    } catch (err) {
      console.error("Error processing file: ", err)
    }
  });

  parser.on("error", function (error) {
    console.error("Error reading file:", error.message);
  });
}

router.post(
  '',
  ash(async (req, res) => {
    const { event, submission } = req.body;
    const filename = getFilename(event.name, event.label, event.startDate, event.endDate);

    await writeCSV({ filename, event, submission, alumni: !!submission.alumni });
    if (submission.alumni) {
      const filename = getAlumniFilename()
      await writeCSV({ filename, event, submission });
    }

    if (event.fields.includes('display') && event.filePath) {
      await updateDisplayCSV(event.filePath, submission.company);
    }

    res.end();
  })
);

module.exports = router;
