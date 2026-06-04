const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 确保子目录存在
const avatarsDir = path.join(uploadDir, 'avatars');
const foodsDir = path.join(uploadDir, 'foods');

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

if (!fs.existsSync(foodsDir)) {
  fs.mkdirSync(foodsDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 根据上传类型选择目录
    const type = req.params.type || 'avatars';
    const dest = type === 'foods' ? foodsDir : avatarsDir;
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 只允许图片文件
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件（JPEG, PNG, GIF, WebP）'), false);
  }
};

// 创建 multer 实例
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

/**
 * 上传单个图片
 * POST /api/upload/:type
 * type: avatars 或 foods
 */
exports.uploadSingle = (req, res) => {
  const uploadSingleFile = upload.single('image');

  uploadSingleFile(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer 错误
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: '文件大小不能超过 5MB'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      // 其他错误
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    // 检查是否有文件
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的图片'
      });
    }

    // 生成文件访问 URL
    const type = req.params.type || 'avatars';
    const fileUrl = `/uploads/${type}/${req.file.filename}`;

    res.json({
      success: true,
      message: '上传成功',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  });
};

/**
 * 上传多个图片
 * POST /api/upload/:type/multiple
 */
exports.uploadMultiple = (req, res) => {
  const uploadMultipleFiles = upload.array('images', 5); // 最多5张

  uploadMultipleFiles(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: '文件大小不能超过 5MB'
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          message: '最多只能上传 5 张图片'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的图片'
      });
    }

    const type = req.params.type || 'avatars';
    const files = req.files.map(file => ({
      url: `/uploads/${type}/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      message: '上传成功',
      data: files
    });
  });
};

/**
 * 删除图片
 * DELETE /api/upload/:type/:filename
 */
exports.deleteImage = (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(uploadDir, type, filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 删除文件
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除文件错误:', error);
    res.status(500).json({
      success: false,
      message: '删除失败'
    });
  }
};
