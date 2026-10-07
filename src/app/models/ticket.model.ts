export type Status = 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
export type Prioridade = 'baixa' | 'media' | 'alta' | 'critica';

export const STATUS_LIST: Status[] = ['aberto', 'em_andamento', 'resolvido', 'fechado'];
export const PRIORIDADE_LIST: Prioridade[] = ['critica', 'alta', 'media', 'baixa'];

export const STATUS_LABEL: Record<Status, string> = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  resolvido: 'Resolvido',
  fechado: 'Fechado',
};

export const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

export const CATEGORIAS = [
  'Acesso e senhas',
  'Rede e VPN',
  'Sistemas corporativos',
  'Banco de dados',
  'Hardware e periféricos',
  'Outros',
] as const;

export interface Comentario {
  autor: string;
  texto: string;
  data: string; // ISO 8601
}

export interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  status: Status;
  prioridade: Prioridade;
  categoria: string;
  solicitante: string;
  responsavel: string;
  slaHoras: number;
  criadoEm: string; // ISO 8601
  atualizadoEm: string; // ISO 8601
  comentarios: Comentario[];
}

/** Campos que o usuário preenche no formulário. */
export type TicketInput = Pick<
  Ticket,
  'titulo' | 'descricao' | 'status' | 'prioridade' | 'categoria' | 'solicitante' | 'responsavel' | 'slaHoras'
>;

/** Formato do arquivo public/tickets.json (datas relativas, para o exemplo nunca "envelhecer"). */
export type TicketSeed = Omit<Ticket, 'criadoEm' | 'atualizadoEm' | 'comentarios'> & {
  criadoHaHoras: number;
  comentarios: { autor: string; texto: string; haHoras: number }[];
};
