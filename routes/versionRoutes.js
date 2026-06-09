const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 版本信息文件路径
const VERSION_FILE = path.join(__dirname, '../version.json');

// 获取版本信息
router.get('/check', (req, res) => {
  try {
    const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
    res.json({
      success: true,
      data: versionData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取版本信息失败'
    });
  }
});

// 下载 APK
router.get('/download', (req, res) => {
  try {
    const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
    const apkPath = path.join(__dirname, '..', versionData.apkUrl);

    if (!fs.existsSync(apkPath)) {
      return res.status(404).json({
        success: false,
        message: 'APK 文件不存在'
      });
    }

    res.download(apkPath, `meishi-v${versionData.versionName}.apk`);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '下载失败'
    });
  }
});

module.exports = router;
