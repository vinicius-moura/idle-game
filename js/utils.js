export const formatNumber = (num) => {
    if (num < 1000) {return num.toFixed(0);}
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
    const i = Math.floor(Math.log10(num) / 3);

    return (num / Math.pow(1000, i)).toFixed(2) + suffixes[i];
};

export const formatDuration = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));

    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);

    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);

    const parts = [];

    if (days > 0) { parts.push(`${days} day${days !== 1 ? 's' : ''}`); }
    if (hours > 0) { parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`); }
    if (minutes > 0) { parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`); }

    if (parts.length === 1) {
        return parts[0];
    }

    if (parts.length === 2) {
        return parts.join(' and ');
    }

    const last = parts.pop();

    return parts.join(', ') + ' and ' + last;
};