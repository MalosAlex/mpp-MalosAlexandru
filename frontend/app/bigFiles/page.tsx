"use client"

import { useState, useEffect } from "react";

interface Video {
  id: number;
  title: string;
  file: string;
}

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/videos/`);
      const data = await response.json();
      setVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("title", selectedFile.name);
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/videos/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const newVideo = await response.json();
        setVideos((prevVideos) => [...prevVideos, newVideo]);
        setSelectedFile(null);
        alert("Video uploaded successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error uploading video:", errorData);
        alert(`Error uploading video: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video");
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/videos/${videoId}/`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId));
        alert("Video deleted successfully!");
      } else {
        console.error("Error deleting video:", response.statusText);
        alert(`Error deleting video: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
    }
  };

  const handleDownload = (videoId: number, videoTitle: string) => {
    // Using the download endpoint
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/api/videos/${videoId}/download/`;
  };

  if (isLoading) {
    return <p>Loading videos...</p>;
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>Relevant filespace</h1>
      <form onSubmit={handleFileUpload} style={{ marginBottom: "20px" }}>
        <input
          type="file"
          accept="video/*"  // Optional: restrict to video files
          onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
        />
        <button type="submit" disabled={!selectedFile}>
          Upload File
        </button>
      </form>

      <h2>Already Available Files</h2>
      {videos.length === 0 ? (
        <p>No videos available.</p>
      ) : (
        <ul>
          {videos.map((video) => (
            <li key={video.id} style={{ marginBottom: "10px" }}>
              <a
                href={video.file}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: "10px" }}
              >
                {video.title}
              </a>
              <button
                onClick={() => handleDownload(video.id, video.title)}
                style={{
                  marginRight: "10px",
                  backgroundColor: "lightblue",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Download
              </button>
              <button
                onClick={() => handleDeleteVideo(video.id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}