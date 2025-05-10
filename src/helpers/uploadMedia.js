const uploadMedia = async (file) => {
  const isVideo = file.type.startsWith("video/")
  const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME_CLOUDINARY}/${isVideo ? "video" : "image"}/upload`

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "ecommerce_asset")

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  })

  return response.json()
}

export default uploadMedia
