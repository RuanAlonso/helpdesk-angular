import { Component, computed, effect, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  CATEGORIAS,
  PRIORIDADE_LABEL,
  PRIORIDADE_LIST,
  Prioridade,
  STATUS_LABEL,
  STATUS_LIST,
  Status,
} from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-form.html',
})
export class TicketForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(TicketService);
  private readonly router = inject(Router);

  /** Só existe na rota de edição (chamados/:id/editar). */
  readonly id = input<string>();

  protected readonly CATEGORIAS = CATEGORIAS;
  protected readonly STATUS_LIST = STATUS_LIST;
  protected readonly STATUS_LABEL = STATUS_LABEL;
  protected readonly PRIORIDADE_LIST = PRIORIDADE_LIST;
  protected readonly PRIORIDADE_LABEL = PRIORIDADE_LABEL;

  protected readonly editando = computed(() => this.id() !== undefined);
  protected readonly ticket = computed(() => {
    const id = this.id();
    return id === undefined ? undefined : this.service.obter(Number(id));
  });
  protected readonly carregando = this.service.carregando;

  protected readonly form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(80)]],
    descricao: ['', [Validators.required, Validators.minLength(10)]],
    categoria: [CATEGORIAS[0] as string, Validators.required],
    prioridade: ['media' as Prioridade],
    status: ['aberto' as Status],
    solicitante: ['', [Validators.required, Validators.minLength(2)]],
    responsavel: [''],
    slaHoras: [24, [Validators.required, Validators.min(1), Validators.max(720)]],
  });

  private preenchido = false;

  constructor() {
    // Na edição, preenche o formulário assim que o chamado estiver disponível.
    effect(() => {
      const t = this.ticket();
      if (t && !this.preenchido) {
        this.form.patchValue(t);
        this.preenchido = true;
      }
    });
  }

  protected invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados = this.form.getRawValue();
    const t = this.ticket();

    if (this.editando() && t) {
      this.service.atualizar(t.id, dados);
      this.router.navigate(['/chamados', t.id]);
    } else {
      const novo = this.service.criar(dados);
      this.router.navigate(['/chamados', novo.id]);
    }
  }
}
