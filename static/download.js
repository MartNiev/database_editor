function download() {
  // Add functionality to download the edited db from userDB to users computer
  async function download_file() {
    try {
      const response = await fetch("/download");

      if (!response.ok) {
        // alert("File not Found.");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      console.log(response);

      const a = document.createElement("a");
      a.href = url;
      a.download = "EditedDB.db";
      a.click();

      // Add condition asking the user if they want continue editing
      //if no redirect to home
      // window.location.href = "/";
    } catch (error) {
      console.log("Error downloading: " + error.message);
    }
  }

  download_file();
}
