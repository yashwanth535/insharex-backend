const supabase = require('../config/supabaseConfig');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (Supports all file types)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}).single('file');

const uploadFile = async (req, res) => {
  console.log('Uploading file...');
  upload(req, res, async (err) => {
    try {
      if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = req.file;
      const timestamp = Date.now();
      const fileExtension = path.extname(file.originalname);
      const fileName = `${timestamp}-${file.originalname}`;

      // Upload file to Supabase Storage (Bucket: "insharex")
      const { data, error } = await supabase.storage
        .from('insharex')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: true, // Allows overwriting existing files
        });

      if (error) {
        console.error('Supabase storage error:', error);
        return res.status(500).json({ error: 'Error uploading to storage' });
      }

      // Get the public URL of the uploaded file
      const publicUrl = supabase.storage.from('insharex').getPublicUrl(fileName).data.publicUrl;

      res.status(200).json({
        message: 'File uploaded successfully',
        fileName,
        fileType: file.mimetype,
        url: publicUrl,
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

module.exports = { uploadFile };
