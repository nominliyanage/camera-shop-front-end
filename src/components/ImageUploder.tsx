import React,{useState} from 'react';
import axios from 'axios';

export function ImageUploder() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first");
            return;
        }
        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await axios.post("http://localhost:3000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Image uploaded successfully: " + response.data.filePath);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "200px" }} />}
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}