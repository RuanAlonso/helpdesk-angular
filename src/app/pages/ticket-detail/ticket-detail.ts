import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PRIORIDADE_LABEL, STATUS_LABEL, STATUS_LIST, Status } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-detail',
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './ticket-detail.html',
})
export class TicketDetail {
  private readonly service = inject(TicketService);
  private readonly router = inject(Router);

  /** Preenchido automaticamente pelo parâmetro :id da rota (withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly STATUS_LIST = STATUS_LIST;
  protected readonly STATUS_LABEL = STATUS_LABEL;
  protected readonly PRIORIDADE_LABEL = PRIORIDADE_LABEL;

  protected readonly carregando = this.service.carregando;
  protected readonly ticket = computed(() => this.service.obter(Number(this.id())));
  protected readonly vencido = computed(() => {
    const t = this.ticket();
    return !!t && this.service.vencido(t);
  });
  protected readonly prazo = computed(() => {
    const t = this.ticket();
    return t ? this.service.prazoSla(t) : null;
  });

  protected readonly comentario = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  protected mudarStatus(evento: Event): void {
    const t = this.ticket();
    if (!t) return;
    const status = (evento.target as HTMLSelectElement).value as Status;
    this.service.atualizar(t.id, { status });
  }

  protected enviarComentario(): void {
    const t = this.ticket();
    if (!t || this.comentario.invalid) {
      this.comentario.markAsTouched();
      return;
    }
    this.service.comentar(t.id, 'Você', this.comentario.value.trim());
    this.comentario.reset('');
  }

  protected excluir(): void {
    const t = this.ticket();
    if (!t) return;
    if (confirm(`Excluir o chamado #${t.id}? Essa ação não pode ser desfeita.`)) {
      this.service.excluir(t.id);
      this.router.navigate(['/chamados']);
    }
  }
}
