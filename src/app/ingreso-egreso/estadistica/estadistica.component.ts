import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { AppStateWithIngresoEgreso } from '../ingreso-egreso-reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: [] }],
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private store: Store<AppStateWithIngresoEgreso>) {}

  ngOnDestroy(): void {
    this.itemsSubscription.unsubscribe();
  }

  ingresos: number = 0;
  egresos: number = 0;
  totalIngresos: number = 0;
  totalEgresos: number = 0;
  itemsSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.itemsSubscription = this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => {
        this.generarEstadistica(items);
      });
  }

  generarEstadistica(items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;
    this.totalIngresos = 0;
    this.totalEgresos = 0;

    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }

    this.doughnutChartData.datasets = [
      {
        data: [this.totalIngresos, this.totalEgresos],
      },
    ];

    this.chart?.chart?.update();
  }
}
