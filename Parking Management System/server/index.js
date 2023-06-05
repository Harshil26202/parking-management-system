const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 8001;

app.use(express.json());

app.use(cors());
app.options('*', cors());

require('./routes/admin.routes.js')(app);
require('./routes/auth.routes.js')(app);
require('./routes/owner.routes.js')(app);

app.listen(PORT, () => {
  console.log('App is running on ', PORT);
});
