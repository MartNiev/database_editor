let currentRow;

let inc = 0;

function createElement(id, value) {
  let editBoxes = document.getElementById("editBoxes");

  let boxContainer = document.createElement("div");
  boxContainer.className = "editName";
  boxContainer.id = `boxContainer${inc}`;
  editBoxes.appendChild(boxContainer);

  let button = document.createElement("button");
  button.type = "button";
  onclickFunction = `editUI('${id}', ${inc})`;
  button.setAttribute("onclick", onclickFunction);
  button.textContent = "Edit";

  let dynamicContainer = document.createElement("div");
  dynamicContainer.id = `dynamicContainer${inc}`;
  boxContainer.appendChild(dynamicContainer);

  let elem = document.createElement("p");
  elem.className = "name";
  elem.id = id;
  elem.textContent = value;

  boxContainer.appendChild(button);
  dynamicContainer.appendChild(elem);

  inc++;
}

function editPage(id) {
  inc = 0;

  let data = JSON.parse(localStorage.getItem("data"));
  var originalColumnNames = JSON.parse(localStorage.getItem("ogColumnNames"));
  currentRow = `row${id}`;

  const messageContainer = document.getElementById("iframeContainer");
  const popUp = document.createElement("div");
  popUp.id = "popUpWindow";
  popUp.innerHTML = `<section class="addDataContainer">
      <div class="messageBox">
        <header class="headerPopUp"><h1>Edit Data</h1></header>
        <div id="editBoxes">
        </div>
         <div class="yesOrNoBt">
            <button type="button" class="pageBt" onclick="handleEdit(${id})">Save</button>
            <button type="button" class="pageBt" onclick="cancelForm()">Cancel</button>
        </div>
  
      </div>
    </section>`;
  messageContainer.appendChild(popUp);

  for (const prop in data) {
    if (data[prop].id === id) {
      rowObject = data[prop];
      // console.log(data[prop]);

      infoToEdit = [];

      for (const key in rowObject) {
        if (key !== "id") {
          let newKey = key.replace("_", "");
          let value = rowObject[key];

          createElement(newKey, value);
        }
      }

      var firstName = data[prop].first_name;
      var lastName = data[prop].last_name;

      break;
    }
  }
}

function createInputField(fieldName, containerName, nameValue) {
  let container = document.getElementById(containerName);

  let editInput = document.createElement("input");
  editInput.className = "editInput";
  editInput.id = fieldName + "Input";
  editInput.placeholder = nameValue;

  container.appendChild(editInput);
  return editInput;
}

let fieldArray = [];

function editUI(name, idx) {
  fieldArray.push(name);

  let nameTag = document.getElementById(name);
  let nameValue = nameTag.textContent;
  nameTag.remove();

  let containerName = `dynamicContainer${idx}`;

  let editInput = createInputField(name, containerName, nameValue);

  let boxContainerName = `boxContainer${idx}`;
  let boxContainer = document.getElementById(boxContainerName);
  boxContainer.style.border = "solid 2px #6e6e6e";
  editInput.focus();

  // Need to add columnName t
}

let editData = { name: {}, id: 0 };

function handleEdit(id) {
  console.log(editData);
  console.log(fieldArray);
  // if (fieldArray.length === 0) return;

  const row = document.getElementById(currentRow);

  console.log(originalColumnNames.columnNames);
  console.log(fieldArray);

  for (const field of fieldArray) {
    let rowData = document.getElementById(field + id);
    let input = document.getElementById(field + "Input");

    for (let name of originalColumnNames.columnNames) {
      formattedName = name.replace("_", "");

      if (field === formattedName) {
        editData.id = id;
        editData.name[name.toString()] = input.value;
      }
    }

    console.log(editData);

    if (!input.value) return;
    rowData.textContent = input.value;
  }

  fieldArray = [];

  // Send a JSON instead as part of the url
  // Will send the

  async function editRequest(object) {
    try {
      const response = fetch("/data/edit_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });
      if (response.ok) alert(response.json());
    } catch (err) {
      alert("Error editing record: " + err);
    }
  }
  editRequest(editData);

  const popUp = document.getElementById("popUpWindow");
  popUp.remove();

  editData = { name: {}, id: 0 };
}
