const {  configureApp } = require("./config/app.config");
const uploadRoutes = require('./routes/uploadRoutes');

const app = configureApp();

const data = [
  { id: 1, name: "vishnu", age: 25 },
  { id: 2, name: "varun", age: 30 },
  { id: 3, name: "charan", age: 22 }
];

app.get("/api/users", (req, res) => {
  res.json(data);
});

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use('/api', uploadRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
