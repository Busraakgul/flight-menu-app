import Image from 'next/image';

import { useState } from "react";
import axios from "axios";
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Button,
    CircularProgress,
    Typography,
    Card,
    CardContent,
    Snackbar,
    Tabs,
    Tab,
    TextField,
    Select,
    MenuItem,
    Grid,
    FormControlLabel,
    Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useDropzone } from "react-dropzone";

export default function Home() {
    const [image, setImage] = useState(null);
    const [ocrText, setOcrText] = useState("");
    const [menuItems, setMenuItems] = useState([]);
    const [language, setLanguage] = useState("en");
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [tabIndex, setTabIndex] = useState(0);
    const [userQuery, setUserQuery] = useState("");
    const [chatResponse, setChatResponse] = useState([]);
    const [isQueryLoading, setIsQueryLoading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // Uploaded Image URL
    const [darkMode, setDarkMode] = useState(false);

    // Dropzone
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            setImage(acceptedFiles[0]);
        },
    });

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    const handleUpload = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append("file", image);

        try {
            setLoading(true);
            const ocrResponse = await axios.post("/api/ocr", formData);
            setOcrText(ocrResponse.data.text);
            setMenuItems(ocrResponse.data.menuItems);
            setUploadedImageUrl(URL.createObjectURL(image)); // Display uploaded image
            setSnackbarMessage("OCR successfully processed!");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("OCR error:", error);
            setSnackbarMessage("OCR process failed.");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleTranslate = async () => {
        if (!menuItems.length) {
            setSnackbarMessage("No menu items to translate.");
            setOpenSnackbar(true);
            return;
        }
    
        try {
            setLoading(true);
            const translations = await Promise.all(
                menuItems.map((item) =>
                    axios
                        .post("/api/translate", { text: item.description, language })
                        .then((res) => ({
                            ...item,
                            description: res.data.translatedText,
                        }))
                        .catch((error) => {
                            console.error("Translation error:", error);
                            return { ...item, description: "Translation failed." };
                        })
                )
            );
            setMenuItems(translations); // Directly update menuItems with translated items
            setSnackbarMessage("Menu translated successfully!");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Translation process error:", error);
            setSnackbarMessage("Translation failed.");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    }; 

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleQuerySubmit = async () => {
        if (!userQuery.trim()) return;

        setIsQueryLoading(true);
        try {
            const response = await axios.post("/api/chat", {
                query: userQuery,
                menuItems,
            });
            setChatResponse(response.data.response);
        } catch (error) {
            console.error("Chat query error:", error);
            setChatResponse([]);
        } finally {
            setIsQueryLoading(false);
        }
    };

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "900px",
                margin: "auto",
                backgroundColor: darkMode ? "#333" : "#fff",
                color: darkMode ? "#fff" : "#000",
            }}
        >
            {/* Navbar */}
            <AppBar position="static" style={{ backgroundColor: darkMode ? "#222" : "#C00A0A" }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Turkish Airlines Dashboard
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
                        label="Dark Mode"
                    />
                </Toolbar>
            </AppBar>

            {/* Header */}
            <Box textAlign="center" mt={4} mb={4}>
                <Image
                    src="https://www.uted.org/assets/images/slider/__Page_e4838d74-3ce7-4103-ba42-446d71e4c1f2686.png"
                    alt="Turkish Airlines Logo"
                    style={{ height: "60px", marginBottom: "20px" }}
                />
                <Typography variant="h3" gutterBottom style={{ color: "#C00A0A", fontWeight: "bold" }}>
                    Turkish Airlines Flight Menu Application
                </Typography>
            </Box>

            {/* Dropzone */}
            <Box
                {...getRootProps()}
                border="2px dashed #ccc"
                borderRadius="8px"
                p={3}
                textAlign="center"
                mb={4}
                style={{
                    backgroundColor: darkMode ? "#555" : "#f9f9f9",
                }}
            >
                <input {...getInputProps()} />
                <Typography variant="body1" color="textSecondary">
                    Drag & Drop an image file here, or click to select a file.
                </Typography>
                {image && (
                    <Typography variant="body2" color="textPrimary" mt={2}>
                        Selected File: {image.name}
                    </Typography>
                )}
            </Box>

            <Button
                onClick={handleUpload}
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginBottom: "20px", backgroundColor: "#C00A0A", color: "white" }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "Upload and Run OCR"}
            </Button>

            <Box mb={4}>
                <Typography>Select Language:</Typography>
                <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    fullWidth
                    style={{
                        backgroundColor: darkMode ? "#444" : "#fff", // Koyu modda arka plan rengi
                        color: darkMode ? "#fff" : "#000", // Koyu modda metin rengi
                    }}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                backgroundColor: darkMode ? "#333" : "#fff", // Menü arka plan rengi
                                color: darkMode ? "#fff" : "#000", // Menü metin rengi
                            },
                        },
                    }}
                >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="tr">Turkish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                </Select>
                <Button
                    onClick={handleTranslate}
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: "20px" }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Translate Menu"}
                </Button>
            </Box>


            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Dashboard" />
                <Tab label="Uploaded Image" />
                <Tab label="OCR Result" />
                <Tab label="Menu Items" />
                <Tab label="Chat Response" />
            </Tabs>

            {/* Tab Content */}
            <Box mt={4}>
                {tabIndex === 0 && (
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Card sx={{ padding: 2 }}>
                                <Typography variant="h6">Total Uploaded Images</Typography>
                                <Typography variant="h4">{image ? 1 : 0}</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card sx={{ padding: 2 }}>
                                <Typography variant="h6">Total Processed Menus</Typography>
                                <Typography variant="h4">{menuItems.length}</Typography>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {tabIndex === 1 && (
                    <Box textAlign="center">
                        {uploadedImageUrl ? (
                            <Image src={uploadedImageUrl} alt="Uploaded" style={{ maxWidth: "100%", height: "auto" }} />
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No image uploaded yet.
                            </Typography>
                        )}
                    </Box>
                )}

                {tabIndex === 2 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            OCR Result:
                        </Typography>
                        {ocrText ? (
                            <Box>
                                <Box mb={2} display="flex" justifyContent="space-between">
                                    <TextField
                                        variant="outlined"
                                        placeholder="Search in OCR results"
                                        onChange={(e) => {
                                            const searchTerm = e.target.value.toLowerCase();
                                            const filtered = ocrText
                                                .split("\n")
                                                .filter((line) => line.toLowerCase().includes(searchTerm));
                                            setMenuItems(filtered.map((line, index) => ({ id: index + 1, description: line })));
                                        }}
                                        fullWidth
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            const blob = new Blob([JSON.stringify(menuItems, null, 2)], {
                                                type: "application/json",
                                            });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement("a");
                                            a.href = url;
                                            a.download = "ocr_results.json";
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                        }}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Export JSON
                                    </Button>
                                </Box>
                                <Box
                                    sx={{
                                        maxHeight: "400px",
                                        overflowY: "auto",
                                        backgroundColor: "#f9f9f9",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    {ocrText.split("\n").map((line, index) => (
                                        <Box
                                            key={index}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            mb={1}
                                            p={1}
                                            style={{
                                                backgroundColor: index % 2 === 0 ? "#fff" : "#f1f1f1",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                value={line}
                                                onChange={(e) => {
                                                    const updatedText = [...ocrText.split("\n")];
                                                    updatedText[index] = e.target.value;
                                                    setOcrText(updatedText.join("\n"));
                                                }}
                                            />
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                style={{ marginLeft: "10px" }}
                                                onClick={() => {
                                                    const updatedLines = ocrText.split("\n").filter((_, i) => i !== index);
                                                    setOcrText(updatedLines.join("\n"));
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        ) : (
                            <Typography>No OCR result yet.</Typography>
                        )}
                    </Box>
                )}
                {tabIndex === 3 && (
                    <Box>
                        {menuItems.map((item, index) => (
                            <Box key={index} display="flex" alignItems="center" mb={2}>
                                <TextField
                                    value={item.description}
                                    fullWidth
                                    onChange={(e) => {
                                        const newItems = [...menuItems];
                                        newItems[index].description = e.target.value;
                                        setMenuItems(newItems);
                                    }}
                                />
                                <Button
                                    style={{ marginLeft: "10px" }}
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                        const newItems = menuItems.filter((_, i) => i !== index);
                                        setMenuItems(newItems);
                                    }}
                                >
                                    Remove
                                </Button>
                            </Box>
                        ))}
                    </Box>
                )}

                {tabIndex === 4 && (
                    <Box>
                        <TextField
                            label="Ask a question"
                            variant="outlined"
                            fullWidth
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            disabled={isQueryLoading || !menuItems.length}
                            style={{
                                marginTop: "10px",
                                backgroundColor: darkMode ? "#444" : "#fff", // Dark mode'da arka plan rengini ayarla
                                color: darkMode ? "white" : "black", // Metin rengini ayarla
                                borderColor: darkMode ? "#C00A0A" : "#ccc", // Kenarlık rengini ayarla
                            }}
                        />

                        <Button
                            onClick={handleQuerySubmit}
                            variant="contained"
                            color="secondary"
                            fullWidth
                            style={{
                                marginTop: "10px",
                                backgroundColor: darkMode ? "#C00A0A" : "#333333", // Dark mode'da arka plan rengi
                                color: "white", // Metin rengini beyaz yapalım
                            }}
                            disabled={isQueryLoading || !userQuery.trim()}
                        >
                            {isQueryLoading ? <CircularProgress size={24} /> : "Submit Query"}
                        </Button>


                        <Box mt={4} display="grid" gap={2}>
                            {chatResponse.length > 0 ? (
                                chatResponse.map((response, index) => (
                                    <Card key={index}>
                                        <CardContent>
                                            <Typography variant="h6">Result {index + 1}</Typography>
                                            <Typography variant="body1">{response.item}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {response.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    {isQueryLoading ? "Loading..." : "No chat response yet."}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </div>
    );
}