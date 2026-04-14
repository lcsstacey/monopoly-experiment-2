const fs = require('node:fs');
const path = require('node:path');

const iconIco = path.join(__dirname, 'build', 'icons', 'icon.ico');
const iconIcns = path.join(__dirname, 'build', 'icons', 'icon.icns');
const iconPng = path.join(__dirname, 'build', 'icons', 'icon.png');

const hasIco = fs.existsSync(iconIco);
const hasIcns = fs.existsSync(iconIcns);
const hasPng = fs.existsSync(iconPng);

/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: 'com.familyedition.monopoly',
  productName: 'Monopoly Family Edition',
  artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
  copyright: 'Copyright © 2026 Monopoly Family Edition Contributors',
  directories: {
    buildResources: 'build',
  },
  files: ['index.html', 'styles.css', 'script.js', 'electron/**/*', 'README.md', 'LICENSE'],
  win: {
    target: [{ target: 'nsis', arch: ['x64'] }],
    publisherName: 'Monopoly Family Edition Contributors',
    signAndEditExecutable: true,
    ...(hasIco ? { icon: iconIco } : {}),
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    ...(hasIco
      ? {
          installerIcon: iconIco,
          uninstallerIcon: iconIco,
          installerHeaderIcon: iconIco,
        }
      : {}),
  },
  mac: {
    target: ['dmg'],
    category: 'public.app-category.games',
    ...(hasIcns ? { icon: iconIcns } : {}),
  },
  linux: {
    target: ['AppImage'],
    category: 'Game',
    ...(hasPng ? { icon: iconPng } : {}),
  },
};
