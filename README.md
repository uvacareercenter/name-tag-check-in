# Name Tag Check In

An internal web app for the UVA Career Center to facilitate event registration for Career Center events.

Uses React, Node.js, Auth0 and the DYMO Label Framework.

<img width="959" alt="image" src="https://github.com/user-attachments/assets/48cb06b2-70ce-4e50-900a-034af6a4d2b6">

## Docs

- [Server setup for deployment](docs/server-setup.md)

## Requirements

Ensure you have the DYMO label software installed ([Windows](https://evetpractice.blob.core.windows.net/installs/DLS8Setup.8.7.3.exe) or [Mac](https://evetpractice.blob.core.windows.net/installs/DLS8Setup.8.7.3.dmg)). This is required to forward requests from your browser to the printer. The application is usable without it, but any printing functionality will be disabled.

You will also need Node.js 10 or newer.

Install dependencies:

```
npm install
```

In order for HTTPS to work in development, you'll need to create a local self-signed certificate. You can do this manually with tools like OpenSSL, but [mkcert](https://github.com/FiloSottile/mkcert) makes this super simple:

```bash
mkcert -install
mkcert -cert-file cert.pem -key-file privkey.pem localhost
```

Create a `.env` file with the same fields as `.env.example`. All necessary Auth0 info should be obtained from their Application Setttings and API Settings dashboards.

## Development Usage

Run the Node development server (uses Nodemon for restart on changes)

```
npm run dev:server
```

Run the React development server

```
npm run dev:client
```

Run both in parallel

```
npm run dev
```

## Production Usage

Create a production build

```
npm run build
```

Run the Node server:

```
npm start
```

## Functionality

As soon as a user visits the site, they are required to authenticate. Internally, we have a username and password configured with Auth0 for usage for events.

Afterward, they must pick an event to use for submissions. Any existing events will display on the dialog as well as a form section to create new events. The "Event Name" value will be public-facing and cleansed for later use internally in the file name for generating a CSV. The "available options" are the different types of fields that users will be able to select when completing the form.

Once an event is chosen, the dialog will be closed and the app is ready to be used. Users are required to select at least one type (employer, alumni or parent) with which they identify, after which the appropriate form fields will appear. After clicking submit, a label with their info should print and their data should be sent to our internal server and saved to a CSV file.

## Event Dialogs

### Display

<img width="959" alt="image" src="https://github.com/user-attachments/assets/cecc4028-b3e1-419f-9d57-093cb0c258e2">

Display CSV properties:

| Name              | Type     | Description                                                                                                       |
|-------------------|----------|-------------------------------------------------------------------------------------------------------------------|
| `Employers Name`  | Required | Name of employer, same header as in handshake report                                                              |
| `Industries Name` | Optional | Name of industry, same header as in handshake report                                                              |
| `Job Positions`   | Optional | Number of job postings available, same header as in handshake report                                              |
| `Room Name`       | Optional | Name of the room where employer is located                                                                        |
| `Table #`         | Optional | Table number assigned to employer                                                                                 |
| `Sponsor`         | Optional | Indicates whether the employer is a sponsor of the event. Enter TRUE if they are a sponsor; leave blank otherwise |
| `Checked-in`      | Empty    | Status of the employer’s check-in to the event, managed through code. Leave blank                                 |

### Admin

Displays checked-in employers at a quick glance

<img width="960" alt="image" src="https://github.com/user-attachments/assets/de084c7f-4c9c-4aac-890e-5a816f361aed">

## API Structure

All endpoints require an `Authorization` header with a valid Auth0 token. Any requests from React will be authenticated, but if you'd like to test manually you will need to [obtain your own access token](https://auth0.com/docs/quickstart/backend/nodejs/02-using#obtaining-an-access-token). The header should be set as `Authorization: Bearer YOUR_ACCESS_TOKEN`

### `GET` `/api/events`

Sample response:

```json
{
  "data": [
    {
      "name": "fall-job-and-internship-career-fair-2024",
      "label": "Fall Job and Internship Career Fair 2024",
      "startDate": 1722966436000,
      "endDate": 1722966436000,
      "fields": [
        "employer",
        "alumni",
        "nameTags",
        "display"
      ],
      "creationDate": 1722966493518,
      "filePath": "C:\\Users\\DevKit\\WebstormProjects\\nametag-check-in\\uploads\\2024-08-06_fall-job-and-internship-career-fair-2024.csv",
      "id": "9991ae6b-d9b7-4c89-b846-2eb82edeff3a"
    }
  ]
}
```

### `POST` `/api/events`

Save a new event to the database.

JSON body properties:

| Name           | Type     | Description                                                                 |
|----------------|----------|-----------------------------------------------------------------------------|
| `name`         | `string` | Internal name, used for CSV log file generation                             |
| `label`        | `string` | Public-facing name, cleansed and used for `"name"`                          |
| `fields`       | `array`  | Can include `"employer"`, `"alumni"`, `"parent"`, `"nameTags"`, `"display"` |
| `startDate`    | `number` | Date of event start, in UTC format                                          |
| `endDate`      | `number` | Date of event end, in UTC format                                            |
| `creationDate` | `number` | Date of event creation, in UTC format                                       |
| `filePath`     | `string` | File path of upload if `"display"` field is present                         |
| `id`           | `string` | Unique ID of event                                                          |

Sample request body:

```json
{
  "name": "some-event",
  "label": "Some Event",
  "fields": ["employer", "alumni", "parent"],
  "creationDate": 1722966493518
}
```

Sample response:

```json
{
  "data": {
    "name": "some-event",
    "label": "Some Event",
    "fields": ["employer", "alumni", "parent"],
    "creationDate": 1722966493518,
    "id": "99907b99-8472-44b3-8741-4128449d4f85"
  }
}
```

### `DELETE` `/api/events`

Removes an existing event from the database.

Query params:

| Name | Type     | Description |
|------|----------|-------------|
| `id` | `number` | Event ID    |

Sample request: `/api/events?id=99907b99-8472-44b3-8741-4128449d4f85`

Sample response:

```json
{
  "data": {
    "name": "some-event",
    "label": "Some Event",
    "fields": ["employer", "alumni", "parent"],
    "expirationDate": 1586491200000,
    "creationDate": 1583435935359,
    "id": "99907b99-8472-44b3-8741-4128449d4f85"
  }
}
```

If an existing event of that ID is not found, the server will return `{}`.

### `POST` `/api/submission`

Submits a form submission to be saved to an appropriate CSV file.

JSON body properties:

| Name         | Type     | Description                  |
|--------------|----------|------------------------------|
| `submission` | `object` | User-entered submission data |
| `event`      | `object` | Event data                   |

`submission` properties:

| Name       | Type      | Description                                                                     |
|------------|-----------|---------------------------------------------------------------------------------|
| `employer` | `boolean` |                                                                                 |
| `alumni`   | `boolean` |                                                                                 |
| `parent`   | `boolean` |                                                                                 |
| `school`   | `string`  | Full UVA school name such as `"College and Graduate School of Arts & Sciences"` |
| `name`     | `string`  |                                                                                 |
| `email`    | `string`  |                                                                                 |
| `company`  | `string`  | Name of company (generated select field if display event)                       |
| `title`    | `string`  | Job position                                                                    |
| `uvaEmail` | `string`  |                                                                                 |
| `gradYear` | `string`  | Example: `"2022"`                                                               |

The properties for `event` are the same as what is returned from `GET` `/api/events` - see above.

No response body is sent - only a `200 OK` status.
