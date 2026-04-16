let currentRow;

function editPage(id) {
  let data = JSON.parse(localStorage.getItem("data"));
  currentRow = `row${id}`;

  for (const prop in data) {
    if (data[prop].id === id) {
      console.log(data[prop]);

      var firstName = data[prop].first_name;
      var lastName = data[prop].last_name;
      break;
    }
  }

  const messageContainer = document.getElementById("iframeContainer");
  const popUp = document.createElement("div");
  popUp.id = "popUpWindow";
  popUp.innerHTML = `<section class="addDataContainer">
      <div class="messageBox">
        <header><h1>Edit Data</h1></header>
          <div class="editName" id="boxContainer0">
            <div id=dynamicContainer0>
              <p class="name" id="firstName">${firstName}</p>
            </div>
            <button type"button" onclick="editUI('firstName', 0)">Edit</button>
          </div>
          <div class="editName" id="boxContainer1">
            <div id=dynamicContainer1>
              <p class="name" id="lastName">${lastName}</p>
            </div>
            <button type"button" onclick="editUI('lastName', 1)">Edit</button>
          </div>
          
         <div class="yesOrNoBt">
            <button type="button" class="pageBt" onclick="handleEdit(${id})">Save</button>
            <button type="button" class="pageBt" onclick="cancelForm()">Cancel</button>
          </div>
          
      </div>
    </section>`;

  messageContainer.appendChild(popUp);
}

function editUI(name, idx) {
  let nameTag = document.getElementById(name);
  let nameValue = nameTag.textContent;
  nameTag.remove();

  let containerName = `dynamicContainer${idx}`;
  let container = document.getElementById(containerName);
  let editInput = document.createElement("input");
  editInput.className = "editInput";
  editInput.id = name + "Input";
  editInput.placeholder = nameValue;

  container.appendChild(editInput);

  let boxContainerName = `boxContainer${idx}`;
  let boxContainer = document.getElementById(boxContainerName);
  boxContainer.style.border = "solid 2px #6e6e6e";
  editInput.focus();
}

function handleEdit(id) {
  const row = document.getElementById(currentRow);
  const firstName = document.getElementById("firstNameInput");
  const lastName = document.getElementById("lastNameInput");
  let firstNameValue;
  let lastNameValue;

  if (!firstName && !lastName) return;

  if (firstName) {
    if (!firstName.value) return;
    row.childNodes[2].textContent = firstName.value;
    firstNameValue = firstName.value;
  }
  if (lastName) {
    if (!lastName.value) return;
    row.childNodes[3].textContent = lastName.value;
    lastNameValue = lastName.value;
  }

  const popUp = document.getElementById("popUpWindow");

  async function editRequest(recordsId, firstName = "", lastName = "") {
    try {
      const response = fetch(
        `/data/edit_data?id=${recordsId}&firstName=${firstName}&lastName=${lastName}`,
      );

      if (response.ok) alert(response.json());
    } catch (err) {
      alert("Error editing record: " + err);
    }
  }

  editRequest(id, firstNameValue, lastNameValue);
  popUp.remove();
}
