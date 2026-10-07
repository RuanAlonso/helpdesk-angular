import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Ticket, TicketInput, TicketSeed } from '../models/ticket.model';

const STORAGE_KEY = 'helpdesk.tickets.v1';
const HORA_MS = 3_600_000;

/**
 * Camada de dados do app.
 * - Primeira visita: carrega public/tickets.json via HttpClient.
 * - Depois: guarda tudo no localStorage (simula um back-end).
 * Para ligar numa API real, troque as chamadas ao localStorage por chamadas HttpClient.
 */
@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly state = signal<Ticket[]>([]);

  readonly tickets = this.state.asReadonly();
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  constructor() {
    const salvo = this.lerLocal();
    if (salvo) {
      this.state.set(salvo);
      this.carregando.set(false);
    } else {
      this.buscarExemplos();
    }
  }

  obter(id: number): Ticket | undefined {
    return this.state().find((t) => t.id === id);
  }

  criar(dados: TicketInput): Ticket {
    const agora = new Date().toISOString();
    const id = Math.max(0, ...this.state().map((t) => t.id)) + 1;
    const novo: Ticket = { ...dados, id, criadoEm: agora, atualizadoEm: agora, comentarios: [] };
    this.state.update((lista) => [novo, ...lista]);
    this.salvar();
    return novo;
  }

  atualizar(id: number, dados: Partial<TicketInput>): void {
    const agora = new Date().toISOString();
    this.state.update((lista) =>
      lista.map((t) => (t.id === id ? { ...t, ...dados, atualizadoEm: agora } : t)),
    );
    this.salvar();
  }

  comentar(id: number, autor: string, texto: string): void {
    const agora = new Date().toISOString();
    this.state.update((lista) =>
      lista.map((t) =>
        t.id === id
          ? { ...t, atualizadoEm: agora, comentarios: [...t.comentarios, { autor, texto, data: agora }] }
          : t,
      ),
    );
    this.salvar();
  }

  excluir(id: number): void {
    this.state.update((lista) => lista.filter((t) => t.id !== id));
    this.salvar();
  }

  restaurarExemplos(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* armazenamento indisponível: segue sem persistir */
    }
    this.buscarExemplos();
  }

  /** Momento limite do SLA (criação + horas de SLA). */
  prazoSla(t: Ticket): Date {
    return new Date(new Date(t.criadoEm).getTime() + t.slaHoras * HORA_MS);
  }

  /** Chamado em aberto cujo prazo de SLA já passou. */
  vencido(t: Ticket): boolean {
    if (t.status === 'resolvido' || t.status === 'fechado') return false;
    return Date.now() > this.prazoSla(t).getTime();
  }

  private buscarExemplos(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.http.get<TicketSeed[]>('tickets.json').subscribe({
      next: (seeds) => {
        const agora = Date.now();
        this.state.set(seeds.map((s) => this.converterSeed(s, agora)));
        this.salvar();
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os chamados de exemplo. Recarregue a página.');
        this.carregando.set(false);
      },
    });
  }

  private converterSeed(seed: TicketSeed, agora: number): Ticket {
    const { criadoHaHoras, comentarios, ...resto } = seed;
    const criadoEm = new Date(agora - criadoHaHoras * HORA_MS).toISOString();
    const convertidos = comentarios.map((c) => ({
      autor: c.autor,
      texto: c.texto,
      data: new Date(agora - c.haHoras * HORA_MS).toISOString(),
    }));
    return {
      ...resto,
      criadoEm,
      atualizadoEm: convertidos.at(-1)?.data ?? criadoEm,
      comentarios: convertidos,
    };
  }

  private lerLocal(): Ticket[] | null {
    try {
      const bruto = localStorage.getItem(STORAGE_KEY);
      return bruto ? (JSON.parse(bruto) as Ticket[]) : null;
    } catch {
      return null;
    }
  }

  private salvar(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
    } catch {
      /* armazenamento indisponível: segue sem persistir */
    }
  }
}
