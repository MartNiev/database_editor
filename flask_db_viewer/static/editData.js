function editPage() {
  const messageContainer = document.getElementById("iframeContainer");
  const popUp = document.createElement("div");
  popUp.id = "popUpWindow";
  popUp.innerHTML = `<section class="addDataContainer">
      <div class="messageBox">
        <header><h1>Edit Data</h1></header>
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
