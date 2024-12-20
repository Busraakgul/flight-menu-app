# Flight Menu Web Application  

An interactive digital solution for Turkish Airlines passengers to explore in-flight meal menus. This web application allows users to upload meal menu images, extract menu information using OCR, and interact with the menu via a multilingual chat interface.

## Features  

### 1. **Image Upload and Menu Extraction**  
- Upload or capture meal menu images directly.  
- Extract text from images using Optical Character Recognition (OCR).  
- Automatically parse and structure menu items with descriptions.  

### 2. **Menu Display**  
- View extracted menu items in an intuitive, card-based UI.  
- Supports features like translations for menu items.  

### 3. **Interactive Chat Interface**  
- Ask questions about menu items, including specific dietary inquiries (e.g., gluten-free options).  
- Multilingual support: Detects and responds in the user's preferred language.  

### 4. **Dark Mode**  
- Seamless toggling between light and dark themes for enhanced usability.  

---

## Technologies Used  

### Frontend  
- **React.js** with **Material UI** for the UI components and styling.  
- **Chakra UI** for chat interface enhancements.  

### Backend  
- **Next.js** for server-side rendering and API routes.  
- **Axios** for HTTP requests to APIs.  

### OCR and Translation  
- **Tesseract.js**: Optical Character Recognition for text extraction.  
- **Google Translate API**: Translation for multilingual support.  

### Deployment  
- Hosted on **Vercel** for scalable and easy deployment.

## Installation  
Local - http://localhost:3000/
### 1. Clone the Repository  
```bash  
git clone <repository-url>  
cd flight-menu-web-app  
