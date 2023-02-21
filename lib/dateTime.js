// Create a new Date object representing the current date and time
const now = new Date();

// Get the year, month, and day of the current date
const year = now.getFullYear();
const month = ("0" + (now.getMonth() + 1)).slice(-2); // Add leading zero if month is a single digit
const day = ("0" + now.getDate()).slice(-2); // Add leading zero if day is a single digit

// Get the hours, minutes, and seconds of the current time
const hours = ("0" + now.getHours()).slice(-2); // Add leading zero if hour is a single digit
const minutes = ("0" + now.getMinutes()).slice(-2); // Add leading zero if minute is a single digit
const seconds = ("0" + now.getSeconds()).slice(-2); // Add leading zero if second is a single digit

// Combine the year, month, and day with the hours, minutes, and seconds to create the desired format
const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

export default {formattedDateTime};
