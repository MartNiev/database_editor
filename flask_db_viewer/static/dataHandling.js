const iframe = parent.document.getElementById("deletionPage");

function deleteMessage() {
  const messageContainer = document.getElementById("iframeContainer");
  const messageWindow = document.createElement("iframe");
  messageWindow.src = "/delete_data";
  messageWindow.id = "deletionPage";

  messageContainer.appendChild(messageWindow);
}

async function deleteQuery(id) {
  try {
    response = await fetch(`/table/accounts/delete?id=${id}`);

    if (response.ok) {
      // alert("Data Deleted!");
    }

    iframe.remove();
  } catch (error) {
    alert("Error deleting data: " + error);
  }
}

function deleteData() {
  const currentItems = localStorage.getItem("currentItems");

  let deleteList = [];
  for (let i = currentItems[0]; i < currentItems.length; i++) {
    let checkId = `check${i}`;
    let rowId = `row${i}`;
    let checkBox = parent.document.getElementById(checkId);
    let row = parent.document.getElementById(rowId);

    if (checkBox !== null) {
      if (checkBox.checked) {
        deleteList.push(i);
        row.remove();
      }
    }
  }

  for (const row of deleteList) {
    deleteQuery(row);
  }
}

function cancel() {
  iframe.remove();
}

function addPopUp() {
  const messageContainer = document.getElementById("iframeContainer");
  const messageWindow = document.createElement("iframe");
  messageWindow.src = "/add_data";
  messageWindow.id = "deletionPage";

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
