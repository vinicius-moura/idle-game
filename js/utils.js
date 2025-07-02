export const formatNumber = (num) => {
    if (num < 1000) {return num.toFixed(0);}
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
    const i = Math.floor(Math.log10(num) / 3);

    return (num / Math.pow(1000, i)).toFixed(2) + suffixes[i];
};
