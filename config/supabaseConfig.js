const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET;

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;
