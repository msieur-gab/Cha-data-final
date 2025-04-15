# Tea Details Recorder

A web-based application for recording, organizing and exporting detailed tea information. This application allows tea enthusiasts to create comprehensive records of different teas, including their processing methods, flavor profiles, and other important characteristics.

## Features

- Record detailed tea information including:
  - Tea name and original name (e.g., in Chinese)
  - Tea type/family (White, Green, Yellow, Oolong, Black, Pu'er)
  - Processing methods with detailed descriptions
  - Flavor profiles with comprehensive flavor notes
  - Oxidation level and key characteristics
  - Custom notes

- Dynamic suggestions based on tea type:
  - Suggested processing methods specific to each tea type
  - Suggested flavor profiles commonly associated with each tea type

- Add and remove processing methods and flavor profiles as dismissable chips

- View, manage, and delete your tea records

- Export all tea records as structured JSON for backup or sharing

## Project Structure

```
/
├── index.html          # Main HTML file with form structure
├── css/
│   └── styles.css      # Styling for the application
├── js/
│   ├── app.js          # Main application logic
│   └── data.js         # Tea data definitions (types, processing methods, flavors)
└── README.md           # This documentation file
```

## Tea Types Included

- **White Tea**: Minimal oxidation (0-5%), least processed tea type
- **Green Tea**: Very low oxidation (0-5%), heated immediately after picking
- **Yellow Tea**: Low oxidation (5-10%), rare and expensive
- **Oolong Tea**: Partial oxidation (10-80%), highly varied flavor profiles
- **Black Tea**: Full oxidation (100%), strong flavor
- **Pu'er Tea**: Post-fermented, aged tea that improves over time

## Usage

1. Open `index.html` in a web browser
2. Fill in the tea name and original name (if applicable)
3. Select a tea type from the dropdown menu
4. Choose from suggested processing methods and flavor profiles by clicking on them
5. Add any additional notes about the tea
6. Click "Save Tea Record" to save the record
7. View your saved records below the form
8. Export all records as JSON by clicking the "Export All Records" button

## Data Storage

All tea records are stored in the browser's localStorage, allowing them to persist between sessions. The data can be exported as a JSON file for backup or sharing.

## Customization

The application can be extended by modifying the data definitions in `js/data.js`:

- Add new tea types to the `teaTypes` object
- Add new processing methods to the `processingMethods` object
- Add new flavor profiles to the `flavorProfiles` object
- Modify the suggested processing methods and flavor profiles for each tea type

## License

MIT License 