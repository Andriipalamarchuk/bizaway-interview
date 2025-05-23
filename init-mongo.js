db = db.getSiblingDB(process.env.DATABASE_NAME);

db.createUser({
  user: process.env.DATABASE_USERNAME,
  pwd: process.env.DATABASE_PASSWORD,
  roles: [{ role: "readWrite", db: db.getName() }]
});

const collectionName = process.env.DATABASE_DESTINATION_COLLECTION_NAME;

db.createCollection(collectionName);

db.getCollection(collectionName).insertMany([
  { "code": "ATL", "city": "Atlanta", "country": "USA", "airportName": "Hartsfield–Jackson Atlanta International Airport" },
  { "code": "PEK", "city": "Beijing", "country": "China", "airportName": "Beijing Capital International Airport" },
  { "code": "LAX", "city": "Los Angeles", "country": "USA", "airportName": "Los Angeles International Airport" },
  { "code": "DXB", "city": "Dubai", "country": "UAE", "airportName": "Dubai International Airport" },
  { "code": "HND", "city": "Tokyo", "country": "Japan", "airportName": "Haneda Airport (Tokyo International)" },
  { "code": "ORD", "city": "Chicago", "country": "USA", "airportName": "O'Hare International Airport" },
  { "code": "LHR", "city": "London", "country": "UK", "airportName": "London Heathrow Airport" },
  { "code": "PVG", "city": "Shanghai", "country": "China", "airportName": "Shanghai Pudong International Airport" },
  { "code": "CDG", "city": "Paris", "country": "France", "airportName": "Charles de Gaulle Airport" },
  { "code": "DFW", "city": "Dallas–Fort Worth", "country": "USA", "airportName": "Dallas/Fort Worth International Airport" },
  { "code": "AMS", "city": "Amsterdam", "country": "Netherlands", "airportName": "Amsterdam Airport Schiphol" },
  { "code": "FRA", "city": "Frankfurt", "country": "Germany", "airportName": "Frankfurt Airport" },
  { "code": "IST", "city": "Istanbul", "country": "Turkey", "airportName": "Istanbul Airport" },
  { "code": "CAN", "city": "Guangzhou", "country": "China", "airportName": "Guangzhou Baiyun International Airport" },
  { "code": "JFK", "city": "New York City", "country": "USA", "airportName": "John F. Kennedy International Airport" },
  { "code": "SIN", "city": "Singapore", "country": "Singapore", "airportName": "Singapore Changi Airport" },
  { "code": "DEN", "city": "Denver", "country": "USA", "airportName": "Denver International Airport" },
  { "code": "ICN", "city": "Seoul", "country": "South Korea", "airportName": "Incheon International Airport" },
  { "code": "BKK", "city": "Bangkok", "country": "Thailand", "airportName": "Suvarnabhumi Airport" },
  { "code": "SFO", "city": "San Francisco", "country": "USA", "airportName": "San Francisco International Airport" },
  { "code": "LAS", "city": "Las Vegas", "country": "USA", "airportName": "Harry Reid International Airport" },
  { "code": "CLT", "city": "Charlotte", "country": "USA", "airportName": "Charlotte Douglas International Airport" },
  { "code": "MIA", "city": "Miami", "country": "USA", "airportName": "Miami International Airport" },
  { "code": "KUL", "city": "Kuala Lumpur", "country": "Malaysia", "airportName": "Kuala Lumpur International Airport" },
  { "code": "SEA", "city": "Seattle", "country": "USA", "airportName": "Seattle–Tacoma International Airport" },
  { "code": "MUC", "city": "Munich", "country": "Germany", "airportName": "Munich Airport" },
  { "code": "EWR", "city": "Newark", "country": "USA", "airportName": "Newark Liberty International Airport" },
  { "code": "MAD", "city": "Madrid", "country": "Spain", "airportName": "Adolfo Suárez Madrid–Barajas Airport" },
  { "code": "HKG", "city": "Hong Kong", "country": "Hong Kong", "airportName": "Hong Kong International Airport" },
  { "code": "MCO", "city": "Orlando", "country": "USA", "airportName": "Orlando International Airport" },
  { "code": "PHX", "city": "Phoenix", "country": "USA", "airportName": "Phoenix Sky Harbor International Airport" },
  { "code": "IAH", "city": "Houston", "country": "USA", "airportName": "George Bush Intercontinental Airport" },
  { "code": "SYD", "city": "Sydney", "country": "Australia", "airportName": "Sydney Kingsford Smith Airport" },
  { "code": "MEL", "city": "Melbourne", "country": "Australia", "airportName": "Melbourne Airport" },
  { "code": "GRU", "city": "São Paulo", "country": "Brazil", "airportName": "São Paulo/Guarulhos International Airport" },
  { "code": "YYZ", "city": "Toronto", "country": "Canada", "airportName": "Toronto Pearson International Airport" },
  { "code": "LGW", "city": "London", "country": "UK", "airportName": "London Gatwick Airport" },
  { "code": "BCN", "city": "Barcelona", "country": "Spain", "airportName": "Barcelona–El Prat Airport" },
  { "code": "MAN", "city": "Manchester", "country": "UK", "airportName": "Manchester Airport" },
  { "code": "BOM", "city": "Mumbai", "country": "India", "airportName": "Chhatrapati Shivaji Maharaj International Airport" },
  { "code": "DEL", "city": "Delhi", "country": "India", "airportName": "Indira Gandhi International Airport" },
  { "code": "ZRH", "city": "Zurich", "country": "Switzerland", "airportName": "Zurich Airport" },
  { "code": "SVO", "city": "Moscow", "country": "Russia", "airportName": "Sheremetyevo International Airport" },
  { "code": "DME", "city": "Moscow", "country": "Russia", "airportName": "Domodedovo International Airport" },
  { "code": "JNB", "city": "Johannesburg", "country": "South Africa", "airportName": "O. R. Tambo International Airport" },
  { "code": "ARN", "city": "Stockholm", "country": "Sweden", "airportName": "Stockholm Arlanda Airport" },
  { "code": "OSL", "city": "Oslo", "country": "Norway", "airportName": "Oslo Gardermoen Airport" },
  { "code": "CPH", "city": "Copenhagen", "country": "Denmark", "airportName": "Copenhagen Airport" },
  { "code": "HEL", "city": "Helsinki", "country": "Finland", "airportName": "Helsinki-Vantaa Airport" },
  { "code": "VIE", "city": "Vienna", "country": "Austria", "airportName": "Vienna International Airport" }
]);

db.getCollection(collectionName).createIndex({ code: 1, unique: 1 });
