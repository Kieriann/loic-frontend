
export default function ProfileFiles({ files }) {
  if (!files?.length) return null

  const getCloudinaryUrl = (file) => {
    const type = file.resourceType === "image" ? "image" : "raw"
    const ext = file.format && !file.public_id.endsWith(`.${file.format}`) ? `.${file.format}` : ""
    return `https://res.cloudinary.com/dwwt3sgbw/${type}/upload/v${file.version}/${file.public_id}${ext}`
  }

  return (
    <div>
      <strong>Documents :</strong>
      <div>
        {files.map(f =>
          f.resourceType === "image" ? (
            <img
              key={f.id}
              src={getCloudinaryUrl(f)}
              alt={f.originalName}
              style={{ maxWidth: 120, marginRight: 8, display: "inline-block" }}
            />
          ) : (
            <a
              key={f.id}
              href={getCloudinaryUrl(f)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
              style={{ marginRight: 8, display: "inline-block" }}
            >
              {f.originalName}
            </a>
          )
        )}
      </div>
    </div>
  )
}