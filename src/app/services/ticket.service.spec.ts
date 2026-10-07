import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TicketSeed } from '../models/ticket.model';
import { TicketService } from './ticket.service';

const exemplo: TicketSeed[] = [
  {
    id: 1,
    titulo: 'Chamado de teste',
    descricao: 'Descrição do chamado de teste',
    status: 'aberto',
    prioridade: 'alta',
    categoria: 'Outros',
    solicitante: 'Ana',
    responsavel: '',
    slaHoras: 4,
    criadoHaHoras: 10,
    comentarios: [],
  },
];

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TicketService);
    http.expectOne('tickets.json').flush(exemplo);
  });

  it('carrega os chamados de exemplo na primeira visita', () => {
    expect(service.tickets().length).toBe(1);
    expect(service.carregando()).toBeFalse();
  });

  it('marca como vencido um chamado em aberto fora do SLA', () => {
    expect(service.vencido(service.tickets()[0])).toBeTrue();
  });

  it('não considera vencido um chamado resolvido', () => {
    service.atualizar(1, { status: 'resolvido' });
    expect(service.vencido(service.tickets()[0])).toBeFalse();
  });

  it('cria chamados com id incremental', () => {
    const novo = service.criar({
      titulo: 'Outro chamado',
      descricao: 'Descrição suficiente',
      status: 'aberto',
      prioridade: 'baixa',
      categoria: 'Outros',
      solicitante: 'Beto',
      responsavel: '',
      slaHoras: 24,
    });
    expect(novo.id).toBe(2);
    expect(service.tickets().length).toBe(2);
  });
});
