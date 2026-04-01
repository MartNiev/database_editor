let deleteListObj = {
  list: [],
  clearArray: function () {
    this.list.length = 0;
  },
};

function deleteMessage() {
  deleteListObj.clearArray();
  const messageContainer = document.getElementById("iframeContainer");
  const messageWindow = document.createElement("iframe");
  messageWindow.src = "/delete_data";
  messageWindow.id = "popUpWindow";

  messageContainer.appendChild(messageWindow);
}

async function deleteQuery(id) {
  try {
    const response = await fetch(`/table/accounts/delete?id=${id}`);

    if (!response.ok) {
      const err = await response.json();
      alert("Server error: " + (err.error || response.status));
      return;
    }
  } catch (error) {
    alert("Error deleting data: " + error);
  }
}

function getCheckedBoxes(number) {
  deleteListObj.list.push(number);
  localStorage.setItem("deleteList", JSON.stringify(deleteListObj));
}

// Action when pressing "Yes" button from iframe
function deleteData() {
  const iframe = parent.document.getElementById("popUpWindow");
  const deleteList = JSON.parse(localStorage.getItem("deleteList")).list;

  for (const row of deleteList) {
    let rowId = `row${row}`;
    let rowElement = parent.document.getElementById(rowId);
    rowElement.remove();
    window.parent.deleteQuery(row);
  }

  localStorage.removeItem("deleteList");

  iframe.remove();
}

function cancel() {
  const iframe = parent.document.getElementById("popUpWindow");
  iframe.remove();
}

function addPopUp() {
  const messageContainer = document.getElementById("iframeContainer");
  const popUp = document.createElement("dialog");
  popUp.id = "popUpWindow";
  popUp.innerHTML = `<section class="addDataContainer">
      <div class="messageBox">
        <header><h1>Add Data</h1></header>
        <form class="userForm">
          <input type="text" id="firstName" placeholder="First Name" />
          <input type="text" id="lastName" placeholder="Last Name" />
          <div class="yesOrNoBt">
            <button type="button" class="pageBt" onclick="addData()">Create</button>
            <button type="button" class="pageBt" onclick="cancelForm()">Cancel</button>
          </div>
        </form>
      </div>
    </section>`;

  messageContainer.appendChild(popUp);
  popUp.showModal();
}

//Action when pressing "Create" button from iframe
function addData() {
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;

  if ((!firstName && !lastName) || !firstName || !lastName) {
    alert("Field CANNOT be empty");
    return;
  }

  async function addNewData(firstName, lastName) {
    try {
      const response = await fetch(`/data/addClient?firstName=${firstName}&lastName=${lastName}`);

      if (!response.ok) {
        const err = await response.json();
        alert("Server error: " + (err.error || response.status));
        return;
      } else {
        document.getElementById("popUpWindow").close();
        window.location.href = "/";
      }
    } catch (error) {
      alert(`Error adding data ${error.message}`);
    }
  }

  addNewData(firstName, lastName);
  // Data is adding to database the iframe is not removing
}

function cancelForm() {
  const popUp = document.getElementById("popUpWindow");
  popUp.remove();
}
