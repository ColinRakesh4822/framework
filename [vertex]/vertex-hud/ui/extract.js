const fs = require('fs');
const content = fs.readFileSync('d:/FiveM Development/FiveM Asset Storage/!Server Dumps Storage/circuit Roleplay/circuit-hud/ui/dist/main.js', 'utf8');

// Use absolute paths
const outFile = 'd:/FiveM Development/FiveM local hosts/mythic/txData/MythicFramework_5094C8.base/resources/[vertex]/vertex-hud/ui/extracted_styles.css';

const cssBlocks = content.match(/[\.a-zA-Z0-9_-]+\{[^}]+\}/g);
if (cssBlocks) {
    fs.writeFileSync(outFile, cssBlocks.join('\n'));
    console.log(`Extracted CSS rules to ` + outFile);
} else {
    console.log("No CSS blocks found this way.");
}
