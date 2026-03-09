import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
  standalone: true
})
export class FormatNumberPipe implements PipeTransform {
  transform(num: number): string {
    // CORREÇÃO: Se o número for 0 ou não existir, retorne '0' imediatamente
    if (!num || num <= 0) return '0'; 
    if (num === Infinity) return 'MAX';
    if (num < 1000) return num.toFixed(0);

    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
    const i = Math.floor(Math.log10(num) / 3);

    if (!suffixes[i]) return num.toExponential(2);

    return (num / Math.pow(1000, i)).toFixed(2) + suffixes[i];
  }
}