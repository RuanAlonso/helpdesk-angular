import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
    <header class="topbar">
      <a class="topbar__brand" routerLink="/">Fila de Suporte</a>
      <nav class="topbar__nav" aria-label="Principal">
        <a routerLink="/" routerLinkActive="ativo" [routerLinkActiveOptions]="{ exact: true }">Fila de hoje</a>
        <a routerLink="/chamados" routerLinkActive="ativo" [routerLinkActiveOptions]="{ exact: false }">Chamados</a>
      </nav>
      <a class="btn btn--primary" routerLink="/chamados/novo">Novo chamado</a>
    </header>
    <main id="conteudo" class="page">
      <router-outlet />
    </main>
  `,
})
export class App {}
