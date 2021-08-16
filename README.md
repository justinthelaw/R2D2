# R2/D2 - Rapid Routing & Decision-making Dashboard

<img src="./ui/public/favicon.png" alt="R2D2" width="40%"/> [![forthebadge](https://forthebadge.com/images/badges/contains-technical-debt.svg)](https://forthebadge.com)

## Table of Contents

1.  [Overview](#Overview)
2.  [Description](#Description)
3.  [Usage and Installation](#Usage-and-Installation)
4.  [Libraries](#Libraries)
5.  [Team](#Team)
6.  [License](#License)

## Overview

The Rapid Routing and Decision-making Dashboard (R2/D2) is a unit-centric task-flow management system that enables accountable and informed decision-making at all levels in the CoC.

Most of today's task-flows usually involve one of the following:

1.  Disaggregated, unintuitive, and/or expensive enterprise work flows (e.g. Sharepoint, TMT, TopVue, LeaveWeb), or
2.  Hundreds of thousands of long email chains of questionable standardization and accountability, or
3.  Pen and paper processes

All of these methods significantly reduce both the velocity and efficacy of the decision-making loop and provide little to no interconnectivity or modularity for a digitally-oriented force.

R2/D2 is built by those of us who have experienced the pain of using the existing systems and wanted something better. Our team's instantiation of task-flow management fills in the gaps left by those systems and provides a solid foundation for future improvements such as: more intra-unit customizability, inter-unit task-flow hooks, Active Directory or LDAP-based data injection, and operational metrics generation.

## Description

From the database schema to the user interface (UI) and experience (UX), this full-stack PostgreSQL, ExpressJS, ReactJS, and NodeJS (PERN) application was designed with scalability and accessibility in mind. The UI contains conditional rendering, modular dialog components, and intuitive clickstreams for user input and notification. The API handles requests sent to it by the UI and forwards them to the PostgreSQL database. SQL is used in these queries to find, join, and manipulate data so that the API can send the right data back to the UI for display. User passwords are protected with encryption, and authorization is required to access protected routes. The PostgreSQL database is set-up with data validation and cascading. Foreign and primary key relationships dynamically alter table data based on user changes and inputs.

Below is a breakdown of the stack:

- Runtime environment: NodeJS
- SQL database: PostgreSQL
- UI: ReactJS
- API server: ExpressJS

Below is a list of applicable links:

- Repository: [GitHub](https://github.com/pham-andrew/SDI-Capstone-Group-5)
- Deployment: [PlatformONE](https://sdi05-05.staging.dso.mil/)
- Planning and Execution: [Miro](https://miro.com/app/board/o9J_l5ZAx5k=/)
  - Problem Statement
  - Definitions
  - Use Cases
  - Wireframes
  - Entity Relationship Diagrams
  - Kanban Board
    - To Do
    - In Progress
    - Done
    - Wishlist

## Usage and Installation

### PlatformONE

1. To use the application hosted on PlatformONE, please click or paste the following URL in your browser: https://sdi05-05.staging.dso.mil/.

### Source Code

_NOTE 1_: The following instructions must be read and followed in-order!

_NOTE 2_: The set-up of this repository and instructions were made to be as developer-agnostic as possible. Custom configuration for ports and names can be done in the .env.example file as noted later in this installation section.

1. Modify the .env.example file using the format commented within the .env.example file. Delete the .example portion of the extension from the .env file before running the application. Run setup.sh after you are done making modifications.

2. Start your Docker app and run the following command to spin-up PostgreSQL and the required database: `docker run --rm --name r2d2 --env-file ./.env -p 5432:5432 postgres:latest`

3. Go to the UI folder and execute `npm install`

4. Go to the api folder and execute `npm install`

5. (OPTIONAL) If you change the seeds or migrations, or the database becomes corrupted, you can run `npm run reset` in the API folder to run the migrations and seeds again.

6. Go to the UI and execute `npm start` to start the ReactJS app.

7. Go to the API and execute `npm run dev` to start the ExpressJS API.

8. Proceed to the address and port for the UI (e.g. http://localhost:3000)

9. Proceed to the address and port for the API (e.g. http://localhost:8080)

### Environment Variables

Environment variables that control the operation of the app are defined in the
`.env` file in the application root. These variables and their usage are shown
in the following table.

Environment variables maintained in the `.env` file are made available to the
application code via `process.env.<variable-name>`.

| Environment Variable | Description         | Example Setting | Applicability |
| :------------------- | :------------------ | :-------------- | :------------ |
| POSTGRES_DB          | Database name       | r2d2            | API, database |
| POSTGRES_USER        | PostgreSQL username | postgres        | API, database |
| POSTGRES_PASSWORD    | PostgreSQL password | docker          | API, database |

## Libraries

### UI

| Module/Library | Environment | Description                                        |
| :------------- | :---------- | :------------------------------------------------- |
| material-ui    | Development | Component library                                  |
| uuid           | Development | UUID generator                                     |
| react          | Runtime     | Framework, JS library                              |
| react-dom      | Runtime     | DOM renderer for React                             |
| react-scripts  | Runtime     | Scripts and configuration used by Create React App |
| js-cookie      | Runtime     | Cookie library                                     |

### API

| Module/Library | Environment | Description        |
| :------------- | :---------- | :----------------- |
| nodemon        | Development | Live API updates   |
| express        | Runtime     | Web framework      |
| cookie-parser  | Runtime     | Cookie middleware  |
| cors           | Runtime     | CORS middleware    |
| pg             | Runtime     | Postgres client    |
| bcrypt         | Runtime     | Encryption library |

## Team

- Andrew Pham
  - UI/UX designer, UI-API integration, Miro Board expert
- Justin Law
  - API architect, UI/UX designer, UI-API integration, database architect, PlatformONE deployment
- Mark Terry
  - API architect, UI-API integration, and database architect
- Noah Loy
  - UI/UX designer

## License

This software is licensed under the [MIT](./LICENSE) license.
