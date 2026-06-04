function formatBytes(bytes = 0) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).format(new Date(date));
}

module.exports = { formatBytes, formatDate };
