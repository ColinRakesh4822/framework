const fs = require('fs');
const path = require('path');

const resourceName = GetCurrentResourceName();
const resourcePath = GetResourcePath(resourceName);
const resourceStreamPath = path.join(resourcePath, 'stream');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((file) => file.isDirectory() ? walk(path.join(dir, file.name)) : path.join(dir, file.name));

const resources = [];
const streamFiles = walk(resourceStreamPath);

for (const streamFile of streamFiles) {
	const relativePath = path.relative(resourcePath, streamFile);
	const baseName = path.basename(streamFile);
	const cacheString = RegisterResourceAsset(resourceName, relativePath);

	resources.push({
		fileName: baseName,
		cacheString,
	});
}

onNet('requestVertexHubResources/831f5cbe-c4c4-487a-9d70-8517d442b71b', () => {
	const resourcesDto = JSON.stringify(resources);
	emitNet('registerVertexHubResources/831f5cbe-c4c4-487a-9d70-8517d442b71b', source, resourcesDto);
});