// ==========================================
// DATA
// ==========================================

let employees = [];

let attendance = [];


// ==========================================
// GET ELEMENTS
// ==========================================

const employeeForm =
    document.getElementById("employeeForm");

const employeeTableBody =
    document.getElementById("employeeTableBody");

const attendanceTableBody =
    document.getElementById("attendanceTableBody");

const searchInput =
    document.getElementById("searchInput");

const attendanceId =
    document.getElementById("attendanceId");

const message =
    document.getElementById("message");


// ==========================================
// ADD EMPLOYEE
// ==========================================

employeeForm.addEventListener("submit", function(event) {

    event.preventDefault();


    let id =
        document.getElementById("employeeId")
        .value
        .trim();


    let name =
        document.getElementById("employeeName")
        .value
        .trim();


    let department =
        document.getElementById("department")
        .value;


    // Validation

    if (id === "") {

        showMessage("Please enter Employee ID");

        return;
    }


    if (name === "") {

        showMessage("Please enter Employee Name");

        return;
    }


    if (department === "") {

        showMessage("Please select Department");

        return;
    }


    // Duplicate ID

    let employeeExists =
        employees.some(function(employee) {

            return employee.id.toLowerCase() ===
                   id.toLowerCase();

        });


    if (employeeExists) {

        showMessage("Employee ID already exists");

        return;
    }


    // Create employee

    let employee = {

        id: id,

        name: name,

        department: department

    };


    employees.push(employee);


    // Update UI

    displayEmployees();

    updateDashboard();


    // Reset form

    employeeForm.reset();


    showMessage(
        "Employee added successfully"
    );

});


// ==========================================
// DISPLAY EMPLOYEES
// ==========================================

function displayEmployees(list = employees) {

    employeeTableBody.innerHTML = "";


    if (list.length === 0) {

        employeeTableBody.innerHTML = `

            <tr>

                <td colspan="4" class="empty">
                    No employees found
                </td>

            </tr>

        `;

        return;
    }


    list.forEach(function(employee) {

        let row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${employee.id}</td>

            <td>${employee.name}</td>

            <td>${employee.department}</td>

            <td>

                <button
                    class="btn delete"
                    onclick="deleteEmployee('${employee.id}')">

                    Delete

                </button>

            </td>

        `;


        employeeTableBody.appendChild(row);

    });

}


// ==========================================
// DELETE EMPLOYEE
// ==========================================

function deleteEmployee(id) {

    let employee =
        employees.find(function(employee) {

            return employee.id === id;

        });


    if (!employee) {

        return;
    }


    let confirmed =
        confirm(
            "Delete " +
            employee.name +
            " from employee list?"
        );


    if (!confirmed) {

        return;
    }


    // Remove employee

    employees =
        employees.filter(function(employee) {

            return employee.id !== id;

        });


    // Remove attendance records

    attendance =
        attendance.filter(function(record) {

            return record.id !== id;

        });


    displayEmployees();

    displayAttendance();

    updateDashboard();


    showMessage(
        "Employee deleted successfully"
    );

}


// ==========================================
// SEARCH EMPLOYEE
// ==========================================

searchInput.addEventListener("input", function() {

    let search =
        searchInput.value
        .toLowerCase()
        .trim();


    let filteredEmployees =
        employees.filter(function(employee) {

            return (

                employee.id
                .toLowerCase()
                .includes(search)

                ||

                employee.name
                .toLowerCase()
                .includes(search)

                ||

                employee.department
                .toLowerCase()
                .includes(search)

            );

        });


    displayEmployees(filteredEmployees);

});


// ==========================================
// CHECK IN
// ==========================================

document
    .getElementById("checkInBtn")
    .addEventListener("click", checkIn);


function checkIn() {

    let id =
        attendanceId.value.trim();


    if (id === "") {

        showMessage(
            "Please enter Employee ID"
        );

        return;
    }


    // Find employee

    let employee =
        employees.find(function(employee) {

            return employee.id.toLowerCase() ===
                   id.toLowerCase();

        });


    if (!employee) {

        showMessage(
            "Employee ID not found"
        );

        return;
    }


    // Check already checked in

    let alreadyCheckedIn =
        attendance.some(function(record) {

            return record.id.toLowerCase() ===
                   employee.id.toLowerCase()
                   &&
                   record.checkOut === "";

        });


    if (alreadyCheckedIn) {

        showMessage(
            "Employee is already checked in"
        );

        return;
    }


    // Current date/time

    let now = new Date();


    let record = {

        id: employee.id,

        name: employee.name,

        date: now.toLocaleDateString(),

        checkIn: now.toLocaleTimeString(),

        checkOut: ""

    };


    attendance.push(record);


    displayAttendance();

    updateDashboard();


    attendanceId.value = "";


    showMessage(
        employee.name +
        " checked in successfully"
    );

}


// ==========================================
// CHECK OUT
// ==========================================

document
    .getElementById("checkOutBtn")
    .addEventListener("click", checkOut);


function checkOut() {

    let id =
        attendanceId.value.trim();


    if (id === "") {

        showMessage(
            "Please enter Employee ID"
        );

        return;
    }


    // Find active attendance

    let record =
        attendance.find(function(record) {

            return record.id.toLowerCase() ===
                   id.toLowerCase()
                   &&
                   record.checkOut === "";

        });


    if (!record) {

        showMessage(
            "No active Check-In found for this employee"
        );

        return;
    }


    // Add checkout time

    record.checkOut =
        new Date().toLocaleTimeString();


    displayAttendance();

    updateDashboard();


    attendanceId.value = "";


    showMessage(
        record.name +
        " checked out successfully"
    );

}


// ==========================================
// DISPLAY ATTENDANCE
// ==========================================

function displayAttendance() {

    attendanceTableBody.innerHTML = "";


    if (attendance.length === 0) {

        attendanceTableBody.innerHTML = `

            <tr>

                <td colspan="6" class="empty">
                    No attendance records
                </td>

            </tr>

        `;

        return;
    }


    attendance.forEach(function(record) {

        let row =
            document.createElement("tr");


        let statusHTML;


        if (record.checkOut === "") {

            statusHTML = `

                <span class="status-present">
                    Present
                </span>

            `;

        } else {

            statusHTML = `

                <span class="status-out">
                    Checked Out
                </span>

            `;

        }


        row.innerHTML = `

            <td>${record.id}</td>

            <td>${record.name}</td>

            <td>${record.date}</td>

            <td>${record.checkIn}</td>

            <td>
                ${
                    record.checkOut === ""
                    ? "-"
                    : record.checkOut
                }
            </td>

            <td>${statusHTML}</td>

        `;


        attendanceTableBody.appendChild(row);

    });

}


// ==========================================
// CLEAR ATTENDANCE
// ==========================================

document
    .getElementById("clearAttendanceBtn")
    .addEventListener(
        "click",
        clearAttendance
    );


function clearAttendance() {

    if (attendance.length === 0) {

        showMessage(
            "No attendance records to clear"
        );

        return;
    }


    let confirmed =
        confirm(
            "Are you sure you want to clear all attendance records?"
        );


    if (!confirmed) {

        return;
    }


    attendance = [];


    displayAttendance();

    updateDashboard();


    showMessage(
        "Attendance records cleared"
    );

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    // Total employees

    document
        .getElementById("totalEmployees")
        .textContent =
        employees.length;


    // Present

    let presentCount =
        attendance.filter(function(record) {

            return record.checkOut === "";

        }).length;


    document
        .getElementById("presentEmployees")
        .textContent =
        presentCount;


    // Checked out

    let checkedOutCount =
        attendance.filter(function(record) {

            return record.checkOut !== "";

        }).length;


    document
        .getElementById("checkedOutEmployees")
        .textContent =
        checkedOutCount;

}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(text) {

    message.textContent = text;


    setTimeout(function() {

        message.textContent = "";

    }, 3000);

}


// ==========================================
// INITIAL LOAD
// ==========================================

displayEmployees();

displayAttendance();

updateDashboard();