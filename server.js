const express = require("express");
const departmentRoutes = require('./routes/department');
const employeeRoutes = require('./routes/employee');
const timecardRoutes = require('./routes/timecard');
const companyRoutes = require('./routes/company');
const app = express();

//const DataLayer = require("./companydata/index.js");
//const dl = new DataLayer("sxd7342");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/CompanyServices', departmentRoutes);
app.use('/CompanyServices', employeeRoutes);
app.use('/CompanyServices', timecardRoutes);
app.use('/CompanyServices', companyRoutes);

const listener = app.listen(process.env.PORT || 8080, () => {
    console.log("Server is listening on port " + listener.address().port)
});