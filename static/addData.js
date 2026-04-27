let inputs = [];

function createAddElement(value) {
  let addContainer = document.getElementById("addInputContainer");

  let idName = value.replace(" ", "").toLowerCase() + "Input";
  inputs.push(idName);

  let addInput = document.createElement("input");
  addInput.className = "editName addInput";
  addInput.id = idName;
  addInput.placeholder = value;

  addContainer.appendChild(addInput);
}

function addPopUp() {
  var originalColumnNames = JSON.parse(localStorage.getItem("originalColumnNames"));
  var formattedColumns = JSON.parse(localStorage.getItem("formattedColumns"));

  const messageContainer = document.getElementById("iframeContainer");
  const popUp = document.createElement("div");
  popUp.id = "popUpWindow";
  popUp.innerHTML = `<section class="addDataContainer">
      <div class="messageBox">
        <header class="headerPopUp"><h1>Add Data</h1></header>
        <form class="userForm">
          <div id="addInputContainer"></div>
          <div class="yesOrNoBt">
            <button type="button" class="pageBt" onclick="addData()">Create</button>
            <button type="button" class="pageBt" onclick="cancelForm()">Cancel</button>
          </div>
        </form>
      </div>
    </section>`;

  messageContainer.appendChild(popUp);

  for (const column of formattedColumns.columnNames) {
    createAddElement(column);
  }
}

let dataObject = {};

function addData() {
  for (const column of originalColumnNames.columnNames) {
    let idName = column.replace("_", "").toLowerCase() + "Input";

    let inputElement = document.getElementById(idName);

    dataObject[column] = inputElement.value;
  }

  console.log(dataObject);

  async function addNewData(object) {
    try {
      const response = await fetch("/data/addData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });

      if (!response.ok) {
        const err = await response.json();
        alert("Server error: " + (err.error || response.status));
        return;
      } else {
        document.getElementById("popUpWindow").remove();
        window.location.href = "/yourdatabase";
      }
    } catch (error) {
      alert(`Error adding data ${error.message}`);
    }
  }

  addNewData(dataObject);

  dataObject = {};
}

function cancelForm() {
  const popUp = document.getElementById("popUpWindow");
  popUp.remove();
}
