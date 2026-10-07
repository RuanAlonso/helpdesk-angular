import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  PRIORIDADE_LABEL,
  PRIORIDADE_LIST,
  STATUS_LABEL,
  STATUS_LIST,
  Ticket,
} from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly service = inject(TicketService);

  protected readonly carregando = this.service.carregando;
  protected readonly erro = this.service.erro;
  protected readonly STATUS_LABEL = STATUS_LABEL;
  protected readonly PRIORIDADE_LABEL = PRIORIDADE_LABEL;

  protected readonly total = computed(() => this.service.tickets().length);

  private readonly emAberto = computed(() =>
    this.service.tickets().filter((t) => t.status === 'aberto' || t.status === 'em_andamento'),
  );

  protected readonly vencidos = computed(() =>
    this.emAberto()
      .filter((t) => this.service.vencido(t))
      .sort((a, b) => this.service.prazoSla(a).getTime() - this.service.prazoSla(b).getTime()),
  );

  protected readonly porStatus = computed(() =>
    STATUS_LIST.map((status) => ({
      status,
      rotulo: STATUS_LABEL[status],
      qtd: this.service.tickets().filter((t) => t.status === status).length,
    })),
  );

  protected readonly porPrioridade = computed(() =>
    PRIORIDADE_LIST.map((prioridade) => ({
      prioridade,
      rotulo: PRIORIDADE_LABEL[prioridade],
      qtd: this.emAberto().filter((t) => t.prioridade === prioridade).length,
    })),
  );

  protected readonly maiorPrioridadeQtd = computed(() =>
    Math.max(1, ...this.porPrioridade().map((p) => p.qtd)),
  );

  protected readonly recentes = computed(() =>
    [...this.service.tickets()]
      .sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm))
      .slice(0, 5),
  );

  protected atrasoEmHoras(t: Ticket): number {
    const ms = Date.now() - this.service.prazoSla(t).getTime();
    return Math.max(1, Math.floor(ms / 3_600_000));
  }

  protected restaurar(): void {
    this.service.restaurarExemplos();
  }
}
