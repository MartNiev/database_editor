function addPopUp() {
  const messageContainer = document.getElementById("iframeContainer");
  const popUp = document.createElement("div");
  popUp.id = "popUpWindow";
  popUp.innerHTML = `<section class="addDataContainer">
      <div class="messageBox">
        <header class="headerPopUp"><h1>Add Data</h1></header>
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
        document.getElementById("popUpWindow").remove();
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
