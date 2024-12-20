// Main handler function to process the incoming request
export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method === "POST") {
    // Extract query and menuItems from the request body
    const { query, menuItems } = req.body; // query: search term, menuItems: list of menu items to filter

    try {
      // Validate that query and menuItems are provided and menuItems is an array
      if (!query || !menuItems || !Array.isArray(menuItems)) {
        return res
          .status(400)
          .json({ error: "Query and menu items are required and must be valid." });
      }

      // Process the query with the provided menuItems
      const response = processQuery(query, menuItems);

      // Send back the filtered results as a response
      return res.status(200).json({ response });
    } catch (error) {
      console.error("Error processing query:", error);
      // Return an error message if something goes wrong during processing
      return res.status(500).json({ error: "Failed to process the query." });
    }
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed error
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  }
}

// Function to process the query and filter the menu items based on it
function processQuery(query, menuItems) {
  // Convert the query to lowercase to make the search case-insensitive
  const lowerQuery = query.toLowerCase();

  // Filter the menuItems array based on whether the query matches the item name or description
  const results = menuItems.filter((item) => {
    // Safely handle missing or undefined fields and ensure they're strings for comparison
    const itemName = item.item?.toString().toLowerCase() || ""; // Get the item name in lowercase
    const itemDescription = item.description?.toString().toLowerCase() || ""; // Get the item description in lowercase

    // Check if the query matches either the item name or description
    return itemName.includes(lowerQuery) || itemDescription.includes(lowerQuery);
  });

  // If matches are found, return an array of results with relevant details
  if (results.length > 0) {
    return results.map((result, index) => ({
      index: index + 1, // Provide an index to track the result number
      item: result.item || "Menu Item", // Use "Menu Item" as a fallback if item is missing
      description: result.description || "No Description", // Fallback for missing description
    }));
  } else {
    // If no matches are found, return an empty array
    return [];
  }
}
