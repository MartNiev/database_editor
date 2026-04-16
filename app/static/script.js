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

function displayData(data) {
  const headerRow = document.getElementById("table-header");
  const body = document.getElementById("table-body");

  headerRow.innerHTML = "";
  body.innerHTML = "";

  // console.log(data.rows);
  if (data.rows.length > 0) {
    let messageText = document.getElementById("messageText");
    if (messageText !== null) {
      messageText.remove();
    }

    const headerNames = ["Edit", "First Name", "Last Name", "Account Number", "Balance"];
    let checkContainer = document.createElement("th");
    headerRow.appendChild(checkContainer);

    headerNames.forEach((col) => {
      let th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    });

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

      for (const key in row) {
        let value = row[key];

        // console.log(key);

        if (key !== "id") {
          let td = document.createElement("td");
          tr.appendChild(td);
          if (key == "balance") {
            valueStr = `$ ${value.toFixed(2)}`;
            td.textContent = valueStr;
            break;
          }

          td.textContent = value;
          tr.id = rowId;
          tr.className = "rowBehavior";
        }
      }

      currentItems.push(row.id);

      body.appendChild(tr);
    });

    localStorage.setItem("currentItems", currentItems);
  } else {
    const messageContainer = document.getElementById("message");
    let message = document.createElement("h2");
    message.id = "messageText";
    message.textContent = "No data found";
    messageContainer.appendChild(message);
  }
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
      const response = await fetch(`/table/accounts?page=${currentPage}&limit=15`);
      const data = await response.json();

      if (data.rows.length < 10) lastPage = true;
      if (data.page === 1) startPage = true;
      else startPage = false;

      console.log(data);
      displayData(data);
      localStorage.setItem("data", JSON.stringify(data.rows));
    } catch (error) {
      console.log("Error loading data: " + error);
    }
  }
}

loadData("start");
