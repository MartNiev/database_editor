const iframe = parent.document.getElementById("popUpWindow");

function deleteMessage() {
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
let deleteListObj = { list: [] };

function getCheckedBoxes(number) {
  deleteListObj.list.push(number);
  localStorage.setItem("deleteList", JSON.stringify(deleteListObj));
}

function deleteData() {
  const deleteList = JSON.parse(localStorage.getItem("deleteList")).list;

  for (const row of deleteList) {
    let rowId = `row${row}`;
    let rowElement = parent.document.getElementById(rowId);
    rowElement.remove();
    window.parent.deleteQuery(row);
  }

  iframe.remove();
}

function cancel() {
  iframe.remove();
}

function addPopUp() {
  const messageContainer = document.getElementById("iframeContainer");
  const messageWindow = document.createElement("iframe");
  messageWindow.src = "/add_data";
  messageWindow.id = "popUpWindow";

  messageContainer.appendChild(messageWindow);
}

function addData() {
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;

  async function addNewData() {
    try {
      const response = await fetch(
        `/data/addClient?firstName=${firstName}&lastName=${lastName}`,
      );

      iframe.remove();
      if (response.ok) window.location.href = "/";
    } catch (error) {
      alert(`Error adding data ${error}`);
    }
  }

  addNewData();
}

function cancelForm() {
  iframe.remove();
}
