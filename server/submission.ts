import { Router } from 'express';

const router = Router();
import ash from 'express-async-handler';
import path from 'path';
import fs from 'fs';
import { format } from 'date-fns';
import { parse } from 'csv-parse';
import { parseAsync as parseCSV } from 'json2csv';

const csvFields = [
  { label: 'Date', value: 'date' },
  { label: 'Employer', value: 'employer' },
  { label: 'UVA Alumni', value: 'alumni_uva' },
  { label: 'Other Alumni', value: 'alumni_other' },
  { label: 'Student', value: 'student' },
  { label: 'Parent', value: 'parent' },
  { label: 'Other', value: 'other' },
  { label: 'Name', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Company', value: 'company' },
  { label: 'Job Title', value: 'title' },
  { label: 'University', value: 'university' },
  { label: 'Graduation Year', value: 'gradYear' },
  { label: 'UVA Email Address', value: 'uvaEmail' },
  { label: 'School', value: 'school' },
  { label: 'Reason For Attending', value: 'reason' },
  { label: 'Registered', value: 'registered' },
];

const ensureDirExists = async (filePath: string) => {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
};

const getFilename = (name: string, start: string | Date, end: string | Date) => {
  let filename: string

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

const getAlumniFilename = () => {
  const name = format(new Date(), 'yyyy-MM') + '.csv';
  return path.join(process.cwd(), 'logs/Alumni Reports', name);
}

const writeCSV = async ({ filename, submission }) => {
  await ensureDirExists(filename);

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

const updateDisplayCSV = async (filePath: string, company: string) => {
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
    const filename = getFilename(event.name, event.startDate, event.endDate);

    await writeCSV({ filename, submission});

    if (submission.alumni_uva || submission.alumni_other) {
      const filename = getAlumniFilename();
      await writeCSV({ filename, submission });
    }

    if (event.fields.includes('display') && event.filePath) {
      await updateDisplayCSV(event.filePath, submission.company);
    }

    res.end();
  })
);

export default router;
