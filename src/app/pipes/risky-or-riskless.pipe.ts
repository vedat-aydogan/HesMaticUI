import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'riskyOrRiskless'
})
export class RiskyOrRisklessPipe implements PipeTransform {

  transform(value: string): string {
    if (value == 'RISKY') {
      return 'RİSKLİ'
    }
    return 'RİSKSİZ';
  }

}
