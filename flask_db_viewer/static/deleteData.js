let deleteListObj = {
  list: [],
  clearArray: function () {
    this.list.length = 0;
  },
};

function deleteMessage() {
  deleteListObj.clearArray();

  const messageContainer = document.getElementById("iframeContainer");
  const popUp = document.createElement("div");
  popUp.id = "popUpWindow";
  popUp.innerHTML = `<div class="deletionContainer">
      <div class="messageBox">
        <header><h2>Are you sure you want to delete?</h2></header>
        <div class="yesOrNoBt">
          <button class="pageBt" onclick="deleteData()">Yes</button>
          <button class="pageBt" onclick="cancel()">No</button>
        </div>
      </div>
    </div>`;

  messageContainer.appendChild(popUp);
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
