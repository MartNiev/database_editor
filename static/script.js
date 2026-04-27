function checkBox(container, rowId, tr) {
  let checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.id = `check${rowId}`;
  checkBox.className = "checkBox";
  container.appendChild(checkBox);

  let increment = 1;

  checkBox.addEventListener("click", function () {
    if (increment % 2 !== 0) {
      tr.style.backgroundColor = "#ececec";
      increment++;
    } else {
      tr.style.backgroundColor = "white";
      increment++;
    }
  });
}

function editButtons(tr, id) {
  let editContainer = document.createElement("td");
  editContainer.style.width = "42px";

  let editButton = document.createElement("button");
  editButton.id = `editRow${id}`;
  let onclickName = `editPage(${String(id)})`;
  editButton.setAttribute("onclick", onclickName);

  let text = document.createTextNode("Edit");
  editButton.append(text);

  editContainer.appendChild(editButton);
  tr.appendChild(editContainer);
}

let columnNames = [];
let originalColumnNames = { columnNames: [] };

function createTableHeader(data) {
  const headerRow = document.getElementById("table-header");
  headerRow.innerHTML = "";

  if (data.rows.length > 0) {
    let messageText = document.getElementById("messageText");
    if (messageText !== null) {
      messageText.remove();
    }
  }
  const headerNames = ["Edit"];
  const formattedColumns = { columnNames: [] };

  //Dynamically get the column names from data.rows
  for (const headerName of data.columnNames) {
    if (headerName !== "id") {
      let formattedHeader = "";
      originalColumnNames.columnNames.push(headerName);
      let value = headerName.replace("_", " ");

      columnNames.push(value.replace(" ", "").toLowerCase());

      let capFirstLetter = value[0].toUpperCase();
      formattedHeader += capFirstLetter;

      let isSpaceFound = false;
      for (let i = 1; i < headerName.length; i++) {
        if (isSpaceFound) {
          formattedHeader += value[i].toUpperCase();

          isSpaceFound = false;
          continue;
        }

        if (value[i] === " ") {
          isSpaceFound = true;
        }

        formattedHeader += value[i];
      }

      headerNames.push(formattedHeader);
      formattedColumns.columnNames.push(formattedHeader);
      localStorage.setItem("formattedColumns", JSON.stringify(formattedColumns));
    }
  }

  localStorage.setItem("ogColumnNames", JSON.stringify(originalColumnNames));

  let checkContainer = document.createElement("th");
  headerRow.appendChild(checkContainer);

  headerNames.forEach((col) => {
    let th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
}

function createTableBody(data) {
  const body = document.getElementById("table-body");
  body.innerHTML = "";

  let currentItems = [];

  data.rows.forEach((row) => {
    let tr = document.createElement("tr");
    tr.setAttribute("onchange", `getCheckedBoxes(${row.id})`);

    let checkContainer = document.createElement("td");
    checkContainer.id = "checkContainer";
    tr.appendChild(checkContainer);

    checkBox(checkContainer, row.id, tr);
    editButtons(tr, row.id);

    // Table Content from Database
    let rowId = `row${row.id}`;

    let idx = 0;
    for (const key in row) {
      let value = row[key];

      if (key !== "id") {
        let td = document.createElement("td");
        rowNum = row.id;
        tdID = columnNames[idx] + rowNum;
        td.id = tdID;

        tr.appendChild(td);

        td.textContent = value;
        tr.id = rowId;
        tr.className = "rowBehavior";

        idx++;
      }
    }

    idx = 0;

    currentItems.push(row.id);

    body.appendChild(tr);
  });

  localStorage.setItem("currentItems", currentItems);
}

function displayData(data) {
  if (data.rows.length === 0) {
    const messageContainer = document.getElementById("noDataMessage");
    messageContainer.style.height = "250px";
    let message = document.createElement("h2");
    message.id = "messageText";
    message.textContent = "No data was found in your .db file";
    messageContainer.appendChild(message);
    return;
  }

  let buttons = document.getElementById("buttons");

  buttons.innerHTML = `
  <button class="pageBt" onclick="loadData('prev')">Prev Page</button>
  <button class="pageBt" onclick="loadData('next')">Next Page</button>
  `;

  createTableHeader(data);
  createTableBody(data);
}

let currentPage;
let lastPage;
let startPage;

async function loadData(condition = null) {
  if (condition === "next" && !lastPage) {
    startPage = false;
    currentPage += 1;
  } else if (condition === "prev" && currentPage > 1) {
    lastPage = false;
    currentPage -= 1;
  } else if (condition === "start") currentPage = 1;

  if (
    (!startPage && condition === "prev") ||
    (!lastPage && condition === "next") ||
    condition === "start"
  ) {
    try {
      const response = await fetch(`/loadTable/accounts?page=${currentPage}&limit=15`);
      const data = await response.json();

      if (data.rows.length < 10) lastPage = true;
      if (data.page === 1) startPage = true;
      else startPage = false;
      //
      displayData(data);

      localStorage.setItem("data", JSON.stringify(data.rows));
    } catch (error) {
      console.log("Error loading data: " + error.message);
    }
  }
}

loadData("start");

function home() {
  window.location.href = "/";
}
