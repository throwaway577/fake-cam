import React, { useState, useMemo } from 'react';
import './App.css'; // Import the CSS file


// 1. Define the context.
// Arguments: Directory path, recursive search (boolean), file extension pattern (Regex).
const mediaContext = require.context('../public/media', false, /\.(jpg|mp4)$/);

// 2. Map the context keys (file paths) to construct the array.
const initialCams = mediaContext.keys().map((filepath, index) => {
  // Extract filename (e.g., "./cam_alpha.jpg" -> "cam_alpha")
  const fileName = filepath.replace('./', '').split('.')[0];
  
  // Format title (e.g., "cam_alpha" -> "Cam Alpha")
  const title = fileName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    id: index + 1,
    title: title,
    // mediaContext(filepath) resolves the final URL/path for the asset
    mediaSrc: mediaContext(filepath) 
  };
});

// Function to sort the cams alphabetically (as required)
const sortCams = (cams) => {
    console.log(cams)
    return [...cams].sort((a, b) => a.title.localeCompare(b.title));
};


// --- Component 1: Top Bar ---
const TopBar = () => (
    <header className="top-bar">
        <div className="logo-container">
            <img src="logo.png" alt="Logo" className="logo" />
            <span className="title">陌生監視器</span>
        </div>
    </header>
);

// --- Component 2: Sidebar ---
const Sidebar = ({ activeTab, setActiveTab }) => {
    const categories = ["🔥熱門", "✨最新", "🌟頂級"];

    return (
        <nav className="sidebar">
            {categories.map((category) => (
                <div
                    key={category}
                    className={`sidebar-tab ${activeTab === category ? 'active' : ''}`}
                    onClick={() => setActiveTab(category)}
                >
                    {category}
                </div>
            ))}
        </nav>
    );
};

// --- Component 3: Cam Grid Item ---
const CamItem = ({ cam }) => (
    <div className="cam-item">
        <div className="thumbnail-container">
            {/* This is where the image or video player would load */}
            <img src={cam.mediaSrc} alt={cam.title} className="cam-thumbnail" />
        </div>
        <h3 className="cam-title">{cam.title}</h3>
    </div>
);


// --- Main Application Component ---
function App() {
    const [activeTab, setActiveTab] = useState('🔥熱門');

    // Use useMemo to ensure sorting only happens when initialCams changes
    const sortedCams = useMemo(() => sortCams(initialCams), []);

    return (
        <div className="cam-website">
            <TopBar />

            <div className="main-content-container">
                {/* Left Sidebar */}
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main Content Area (Cam Grid) */}
                <main className="cam-grid-area">
                    <h2>{activeTab} Cams</h2>
                    <div className="cam-grid">
                        {sortedCams.map((cam) => (
                            <CamItem key={cam.id} cam={cam} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
