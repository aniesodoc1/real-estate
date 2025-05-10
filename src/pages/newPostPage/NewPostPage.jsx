import React, { useState } from 'react'
import { RichTextEditor } from "@mantine/rte";
import "./NewPostPage.scss"
import Upload from "../../components/upload/Upload"
import apiRequest from "../../lib/apiRequest"
import {useNavigate} from "react-router-dom"

const NewPostPage = () => {
  const locations = {
    "Epe": { latitude: "6.5841", longitude: "3.9860" },
    "Ikorodu": { latitude: "6.6194", longitude: "3.5073" },
    "Ikeja": { latitude: "6.6018", longitude: "3.3515" },
    "Lekki": { latitude: "6.4676", longitude: "3.6026" },
    "Victoria Island": { latitude: "6.4281", longitude: "3.4219" },
    "Surulere": { latitude: "6.5008", longitude: "3.3601" },
    "Yaba": { latitude: "6.5164", longitude: "3.3869" },
    "Ojota": { latitude: "6.5823", longitude: "3.3768" },
    "Ajah": { latitude: "6.4707", longitude: "3.5856" },
    "Mushin": { latitude: "6.5291", longitude: "3.3577" },
    "Maryland": { latitude: "6.5684", longitude: "3.3676" },
    "Apapa": { latitude: "6.4483", longitude: "3.3603" },
    "Iyana Ipaja": { latitude: "6.6028", longitude: "3.2829" },
    "Ogba": { latitude: "6.6263", longitude: "3.3451" },
    "Agege": { latitude: "6.6202", longitude: "3.3212" },
    "Oshodi": { latitude: "6.5596", longitude: "3.3436" },
    "Festac Town": { latitude: "6.4667", longitude: "3.2981" },
    "Badagry": { latitude: "6.4154", longitude: "2.8804" },
    "Iyana Oworo": { latitude: "6.5456", longitude: "3.3979" },
    "Alimosho": { latitude: "6.5854", longitude: "3.2496" },
    "Ilupeju": { latitude: "6.5516", longitude: "3.3581" },
    "Ogudu": { latitude: "6.5731", longitude: "3.3931" },
    "Ketu": { latitude: "6.5874", longitude: "3.3928" },
    "Ojo": { latitude: "6.4654", longitude: "3.1879" },
    "Ajegunle": { latitude: "6.4612", longitude: "3.3320" },
    "Bariga": { latitude: "6.5378", longitude: "3.3917" },
    "Oniru": { latitude: "6.4312", longitude: "3.4539" },
    "Egbeda": { latitude: "6.6039", longitude: "3.2818" },
    "Amuwo Odofin": { latitude: "6.4487", longitude: "3.3006" }
  };
  

    const navigate = useNavigate()
    const [value, setValue] = useState("");
    const [images, setImages] = useState([])
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState("");
      const [latitude, setLatitude] = useState("");
      const [longitude, setLongitude] = useState(""); 
    
    const handleSelect = (e) => {
      const city = e.target.value;
      setSelectedCity(city);
  
      if (locations[city]) {
        setLatitude(locations[city].latitude);
        setLongitude(locations[city].longitude);
      } else {
        setLatitude("");
        setLongitude("");
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.target);
      const inputs = Object.fromEntries(formData);

      //const videos = images.filter((media) => media.endsWith(".mp4") || media.endsWith(".mov"));
    
      try {
        const res = await apiRequest.post("/posts", {
          postData: {
            title: inputs.title,
            price: parseInt(inputs.price),
            address: inputs.address,
            city: inputs.city,
            bedroom: parseInt(inputs.bedroom),
            bathroom: parseInt(inputs.bathroom),
            type: inputs.type,
            property: inputs.property,
            latitude: inputs.latitude,
            longitude: inputs.longitude,
            images: images.filter((media) => !media.endsWith(".mp4") && !media.endsWith(".mov")),
            videos: videos,  
          },
          postDetail: {
            desc: value,
            utilities: inputs.utilities,
            pet: inputs.pet,
            income: inputs.income,
            size: parseInt(inputs.size),
            school: parseInt(inputs.school),
            bus: parseInt(inputs.bus),
            restaurant: parseInt(inputs.restaurant),
          },
        });
    
        navigate("/" + res.data.id);
      } catch (err) {
        console.log(err);
        setError("An error occurred while submitting");
      } finally {
        setLoading(false);
      }
    };
    
  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
        <div className="uploadContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        {videos.map((video, index) => (
          <video key={index} autoPlay controls src={video}></video>
        ))}
       <Upload
            uwConfig={{
              multiple: true,
              cloudName: "difdmg2bx",
              uploadPreset: "realestate",
              folder: "posts",
              allowedFormats: ["jpg", "jpeg", "png", "mp4", "mov", "avi"],
              resourceType: "auto",
            }}
            setImages={setImages}      
            setVideos={setVideos}      
          />


      </div>
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <RichTextEditor value={value} onChange={setValue} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <select name="city" onChange={handleSelect} value={selectedCity}>
                  <option value="">Select a City</option>
                  {Object.keys(locations).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" value={latitude} readOnly/>
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" value={longitude} readOnly/>
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className='sendButton' disabled={loading}>
                {loading ? "Loading..." : "Add"}
              </button>
              {error && <span>error</span>}
          </form>
        </div>

        
      </div>
      
    </div>
  )
}

export default NewPostPage