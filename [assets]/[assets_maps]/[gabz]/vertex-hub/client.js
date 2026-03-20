const resourceName = GetCurrentResourceName();

emitNet('requestVertexHubResources/831f5cbe-c4c4-487a-9d70-8517d442b71b');

onNet('registerVertexHubResources/831f5cbe-c4c4-487a-9d70-8517d442b71b', (resourcesDto) => {
	const resources = JSON.parse(resourcesDto);
	for (const { fileName, cacheString } of resources) {
		RegisterStreamingFileFromCache(resourceName, fileName, cacheString);
	}
});