function formatSize(sizeInBytes) {
  const sizeInKB = sizeInBytes / 1024;
  const sizeInMB = sizeInKB / 1024;

  if (sizeInMB >= 1) {
    return `${sizeInMB.toFixed(2)} MB (${sizeInBytes} bytes)`;
  } else {
    return `${sizeInKB.toFixed(2)} KB (${sizeInBytes} bytes)`;
  }
}

function formatDate(date) {
  return date.toLocaleDateString();
}

module.exports = {
  formatSize,
  formatDate,
};
