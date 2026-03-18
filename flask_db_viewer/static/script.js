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
    //forEach runs callback for each Item in array
    const headerNames = [
      "Account Number",
      "Balance",
      "First Name",
      "Last Name",
    ];

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

      let checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.id = `check${row.id}`;
      checkBox.className = "checkBox";
      checkContainer.appendChild(checkBox);

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

      // Table Content from Database
      let rowId = `row${row.id}`;

      for (const key in row) {
        let value = row[key];

        if (key !== "id") {
          let td = document.createElement("td");
          td.textContent = value;
          tr.id = rowId;
          tr.className = "rowBehavior";

          tr.appendChild(td);
        }
      }

      currentItems.push(row.id);

      //console.log(tr);
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
      const response = await fetch(
        `/table/accounts?page=${currentPage}&limit=10`,
      );
      const data = await response.json();

      if (data.rows.length < 10) lastPage = true;
      if (data.page === 1) startPage = true;
      else startPage = false;

      // console.log(data);
      displayData(data);
    } catch (error) {
      console.log("Error loading data: " + error);
    }
  }
}

loadData("start");
