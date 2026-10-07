import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  PRIORIDADE_LABEL,
  PRIORIDADE_LIST,
  Prioridade,
  STATUS_LABEL,
  STATUS_LIST,
  Status,
  Ticket,
} from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './ticket-list.html',
})
export class TicketList {
  private readonly service = inject(TicketService);

  protected readonly STATUS_LIST = STATUS_LIST;
  protected readonly STATUS_LABEL = STATUS_LABEL;
  protected readonly PRIORIDADE_LIST = PRIORIDADE_LIST;
  protected readonly PRIORIDADE_LABEL = PRIORIDADE_LABEL;

  protected readonly carregando = this.service.carregando;
  protected readonly busca = signal('');
  protected readonly filtroStatus = signal<Status | ''>('');
  protected readonly filtroPrioridade = signal<Prioridade | ''>('');

  protected readonly filtrados = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    const status = this.filtroStatus();
    const prioridade = this.filtroPrioridade();

    return this.service
      .tickets()
      .filter((t) => !status || t.status === status)
      .filter((t) => !prioridade || t.prioridade === prioridade)
      .filter(
        (t) =>
          !termo ||
          `${t.id} ${t.titulo} ${t.solicitante} ${t.categoria}`.toLowerCase().includes(termo),
      )
      .sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
  });

  protected readonly temFiltro = computed(
    () => !!(this.busca() || this.filtroStatus() || this.filtroPrioridade()),
  );

  protected valor(evento: Event): string {
    return (evento.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected limpar(): void {
    this.busca.set('');
    this.filtroStatus.set('');
    this.filtroPrioridade.set('');
  }

  protected vencido(t: Ticket): boolean {
    return this.service.vencido(t);
  }

  protected prazo(t: Ticket): Date {
    return this.service.prazoSla(t);
  }
}
