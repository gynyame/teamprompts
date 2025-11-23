const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

const extensionDir = path.join(__dirname, '../extension')
const outDir = path.join(__dirname, '../extension/dist')

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir)
}

// Copy static files
fs.copyFileSync(path.join(extensionDir, 'manifest.json'), path.join(outDir, 'manifest.json'))
fs.copyFileSync(path.join(extensionDir, 'popup.html'), path.join(outDir, 'popup.html'))
fs.copyFileSync(path.join(extensionDir, 'popup.css'), path.join(outDir, 'popup.css'))

// Ensure icons directory exists
const iconsDir = path.join(outDir, 'icons')
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir)
}

// Copy icons
const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png']
iconFiles.forEach(icon => {
    const src = path.join(extensionDir, 'icons', icon)
    const dest = path.join(iconsDir, icon)
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest)
    }
})

// Build
esbuild.build({
    entryPoints: [
        path.join(extensionDir, 'popup.tsx'),
        path.join(extensionDir, 'background.ts'),
        path.join(extensionDir, 'content.ts'),
    ],
    bundle: true,
    outdir: outDir,
    platform: 'browser',
    target: 'es2020',
    loader: { '.tsx': 'tsx', '.ts': 'ts' },
    define: { 'process.env.NODE_ENV': '"production"' },
}).then(() => {
    console.log('Extension built successfully')
}).catch(() => process.exit(1))
