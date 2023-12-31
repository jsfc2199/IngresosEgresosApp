import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    
    const itemsCopy = [...items]

    return itemsCopy.sort((a,b) => {
      if(a.tipo === b.tipo){
        return -1
      }else{
        return 1
      }
    })
  }

}
