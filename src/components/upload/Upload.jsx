import { createContext, useEffect, useState } from "react";
import "./Upload.scss"

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function Upload({ uwConfig, setPublicId, setImages, setVideos }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      var myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the file info: ", result.info);
  
            if (result.info.resource_type === "image") {
              setImages((prev) => [...prev, result.info.secure_url]);
            } else if (result.info.resource_type === "video") {
              setVideos((prev) => [...prev, result.info.secure_url]);
            }
          }
        }
      );
  
      document.getElementById("upload_widget").addEventListener(
        "click",
        function () {
          myWidget.open();
        },
        false
      );
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        //className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
      >
        Add image
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default Upload;
export { CloudinaryScriptContext };
