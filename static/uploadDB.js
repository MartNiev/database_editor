function getFileExtension(filename) {
  let fileExtenstion = "";

  let nameLength = filename.length;

  fileExtenstion += filename[nameLength - 3];
  fileExtenstion += filename[nameLength - 2];
  fileExtenstion += filename[nameLength - 1];

  return fileExtenstion;
}

function changeIcon() {
  let image = document.getElementById("uploadImage");
  image.src = "static/images/uploadedFile.svg";
  image.alt = "Uploaded";
  let imageContainer = document.getElementById("imageContainer");
  imageContainer.id = "imageContainerUploaded";
}

function uploadDB() {
  let fileInput = document.getElementById("dbFile");
  let file = fileInput.files[0];

  if (!file) return;

  let fileExtenstion = getFileExtension(file.name);

  if (fileExtenstion !== ".db") {
    alert("File MUST be a .db file");
    return;
  }

  async function upload() {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/uploadDB", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      window.location.href = "/yourdatabase";
    } catch (err) {
      console.log("Error Uploading db: " + err.message);
    }
  }

  upload();
}

let imageContainer = document.getElementById("imageContainer");

imageContainer.ondragover = (event) => {
  event.preventDefault();
};

imageContainer.ondrop = (event) => {
  event.preventDefault();
  let dbFile = document.getElementById("dbFile");

  const dataTransfer = new DataTransfer();

  dataTransfer.items.add(event.dataTransfer.files[0]);
  dbFile.files = dataTransfer.files;

  changeIcon();
};
