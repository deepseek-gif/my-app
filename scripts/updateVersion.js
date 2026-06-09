const fs = require('fs');
const path = require('path');

// 用法: node scripts/updateVersion.js <versionName> <updateDescription>
// 示例: node scripts/updateVersion.js "1.0.1" "修复了一些bug"

const versionName = process.argv[2];
const updateDescription = process.argv[3] || '版本更新';

if (!versionName) {
  console.error('请提供版本号，例如: node scripts/updateVersion.js "1.0.1" "更新说明"');
  process.exit(1);
}

const VERSION_FILE = path.join(__dirname, '../version.json');
const versionData = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));

// 版本号递增
const newVersionCode = versionData.versionCode + 1;

// 更新版本信息
const newVersionData = {
  ...versionData,
  versionName: versionName,
  versionCode: newVersionCode,
  apkUrl: `/uploads/apk/meishi-v${versionName}.apk`,
  updateDescription: updateDescription,
  releaseDate: new Date().toISOString().split('T')[0]
};

fs.writeFileSync(VERSION_FILE, JSON.stringify(newVersionData, null, 2));

console.log(`版本已更新: v${versionName} (code: ${newVersionCode})`);
console.log(`APK 路径: /uploads/apk/meishi-v${versionName}.apk`);
console.log('请将 APK 文件上传到 backend/uploads/apk/ 目录');
