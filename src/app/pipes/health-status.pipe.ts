import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'healthStatus'
})
export class HealthStatusPipe implements PipeTransform {

  transform(value: string): string {
    if (value == 'RISKY') {
      return 'RİSKLİDİR!'
    } else if (value == 'RISKLESS') {
      return 'RİSKSİZDİR!';
    } else if (value == 'Hes code has been expired!') {
      return 'Süresi geçmiş hes kodu!'
    } else {
      return 'Hes kodu bulunamadı!'
    }

  }

}
