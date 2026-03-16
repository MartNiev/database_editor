let deleted;

async function deleteQuery(id) {
  try {
    response = await fetch(`/table/accounts/delete?id=${id}`);
    if (response.ok) {
      deleted = true;
    }
  } catch (error) {
    alert("Error deleting data: " + error);
  }
}

function deleteMessage() {
  const messageContainer = document.getElementById("iframeContainer");
  const messageWindow = document.createElement("iframe");
  messageWindow.src = "/delete_data";
  messageWindow.id = "deletionPage";

  console.log(messageWindow);

  messageContainer.appendChild(messageWindow);
}

function deleteData() {
  const currentItems = localStorage.getItem("currentItems");

  let deleteList = [];
  for (let i = currentItems[0]; i < currentItems.length; i++) {
    let checkId = `check${i}`;
    let rowId = `row${i}`;
    let checkBox = document.getElementById(checkId);
    let row = document.getElementById(rowId);
    if (checkBox !== null) {
      if (checkBox.checked) {
        console.log("Clicked!");
        deleteList.push(i);
        row.remove();
      }
    }
  }
  for (const row of deleteList) {
    deleteQuery(row);
  }
  if (deleted) {
    alert("Data delete!");
  }
}

function addData() {
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;

  async function addNewData() {
    try {
      const response = await fetch(
        `/data/addClient?firstName=${firstName}&lastName=${lastName}`,
      );
      if (response.ok) window.location.href = "/";
    } catch (error) {
      alert(`Error adding data ${error}`);
    }
  }

  addNewData();
}

function cancelForm() {
  window.location.href = "/";
}

function userOption(option) {
  const iframe = parent.document.getElementById("deletionPage");

  if (option === "yes") {
    deleteData();
    iframe.remove();
  } else if (option === "no") {
    iframe.remove();
  }
}
