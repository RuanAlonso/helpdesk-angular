import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Fila de hoje',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'chamados',
    title: 'Chamados',
    loadComponent: () => import('./pages/ticket-list/ticket-list').then((m) => m.TicketList),
  },
  {
    path: 'chamados/novo',
    title: 'Novo chamado',
    loadComponent: () => import('./pages/ticket-form/ticket-form').then((m) => m.TicketForm),
  },
  {
    path: 'chamados/:id',
    title: 'Detalhe do chamado',
    loadComponent: () => import('./pages/ticket-detail/ticket-detail').then((m) => m.TicketDetail),
  },
  {
    path: 'chamados/:id/editar',
    title: 'Editar chamado',
    loadComponent: () => import('./pages/ticket-form/ticket-form').then((m) => m.TicketForm),
  },
  { path: '**', redirectTo: '' },
];
