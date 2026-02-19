
import { IndicatorData, MonthlyRecord, AutomationStep } from './types';

export const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/**
 * TERMINAL ECONÔMICO - DADOS REAIS 2025 vs 2026
 * ORDEM FIXA: Payroll, CPI, PPI, PCE -> Selic, IPCA, Caged, Balança Comercial
 */
export const INITIAL_INDICATORS: IndicatorData[] = [
  // BLOCO 1: USA
  { id: 'payroll', name: 'Payroll (NFP)', region: 'US', unit: 'k', description: 'Variação na folha de pagamentos (2025 vs 2026)', currentValue: 130, previousValue: 143, trend: 'down', isInverse: false },
  { id: 'cpi_us', name: 'CPI US', region: 'US', unit: '%', description: 'Inflação ao consumidor anualizada', currentValue: 2.4, previousValue: 2.7, trend: 'down', isInverse: true },
  { id: 'ppi_us', name: 'PPI US', region: 'US', unit: '%', description: 'Inflação ao produtor (Anual)', currentValue: 0.5, previousValue: 0.2, trend: 'up', isInverse: true },
  { id: 'pce_us', name: 'PCE US', region: 'US', unit: '%', description: 'Índice de preços favorito do Fed', currentValue: 2.8, previousValue: 2.7, trend: 'up', isInverse: true },
  
  // BLOCO 2: BRASIL
  { id: 'selic', name: 'SELIC', region: 'BR', unit: '%', description: 'Taxa básica de juros (Copom)', currentValue: 15.00, previousValue: 15.00, trend: 'stable', isInverse: true },
  { id: 'focus', name: 'IPCA (Real)', region: 'BR', unit: '%', description: 'Inflação oficial (Acumulado 12m)', currentValue: 4.44, previousValue: 4.26, trend: 'up', isInverse: true },
  { id: 'caged', name: 'CAGED', region: 'BR', unit: 'k', description: 'Saldo líquido de empregos formais', currentValue: -618.16, previousValue: 85.86, trend: 'down', isInverse: false },
  { id: 'trade_balance', name: 'Balança Comercial', region: 'BR', unit: 'B', description: 'Saldo entre exportações e importações', currentValue: 4.34, previousValue: 9.63, trend: 'down', isInverse: false },
];

export const MOCK_HISTORY: Record<string, MonthlyRecord[]> = {
  payroll: [
    { month: 'Jan', prevYear: 143, currYear: 130 },
    { month: 'Fev', prevYear: 151, currYear: 130 },
    { month: 'Mar', prevYear: 228, currYear: null },
    { month: 'Abr', prevYear: 177, currYear: null },
    { month: 'Mai', prevYear: 139, currYear: null },
    { month: 'Jun', prevYear: 147, currYear: null },
    { month: 'Jul', prevYear: 73, currYear: null },
    { month: 'Ago', prevYear: 22, currYear: null },
    { month: 'Set', prevYear: 119, currYear: null },
    { month: 'Out', prevYear: -105, currYear: null },
    { month: 'Nov', prevYear: 64, currYear: null },
    { month: 'Dez', prevYear: 50, currYear: null },
  ],
  selic: [
    { month: 'Jan', prevYear: 13.25, currYear: 15.00 },
    { month: 'Fev', prevYear: 13.25, currYear: null },
    { month: 'Mar', prevYear: 14.25, currYear: null },
    { month: 'Abr', prevYear: 14.25, currYear: null },
    { month: 'Mai', prevYear: 14.75, currYear: null },
    { month: 'Jun', prevYear: 15.00, currYear: null },
    { month: 'Jul', prevYear: 15.00, currYear: null },
    { month: 'Ago', prevYear: 15.00, currYear: null },
    { month: 'Set', prevYear: 15.00, currYear: null },
    { month: 'Out', prevYear: 15.00, currYear: null },
    { month: 'Nov', prevYear: 15.00, currYear: null },
    { month: 'Dez', prevYear: 15.00, currYear: null },
  ],
  cpi_us: [
    { month: 'Jan', prevYear: 3.0, currYear: 2.4 },
    { month: 'Fev', prevYear: 2.8, currYear: null },
    { month: 'Mar', prevYear: 2.4, currYear: null },
    { month: 'Abr', prevYear: 2.3, currYear: null },
    { month: 'Mai', prevYear: 2.4, currYear: null },
    { month: 'Jun', prevYear: 2.7, currYear: null },
    { month: 'Jul', prevYear: 2.7, currYear: null },
    { month: 'Ago', prevYear: 2.9, currYear: null },
    { month: 'Set', prevYear: 3.0, currYear: null },
    { month: 'Out', prevYear: 3.0, currYear: null },
    { month: 'Nov', prevYear: 2.7, currYear: null },
    { month: 'Dez', prevYear: 2.7, currYear: null },
  ],
  pce_us: [
    { month: 'Jan', prevYear: 2.6, currYear: null },
    { month: 'Fev', prevYear: 2.8, currYear: null },
    { month: 'Mar', prevYear: 2.6, currYear: null },
    { month: 'Abr', prevYear: 2.5, currYear: null },
    { month: 'Mai', prevYear: 2.7, currYear: null },
    { month: 'Jun', prevYear: 2.8, currYear: null },
    { month: 'Jul', prevYear: 2.9, currYear: null },
    { month: 'Ago', prevYear: 2.9, currYear: null },
    { month: 'Set', prevYear: 2.8, currYear: null },
    { month: 'Out', prevYear: 2.7, currYear: null },
    { month: 'Nov', prevYear: 2.8, currYear: null },
    { month: 'Dez', prevYear: 0, currYear: null },
  ],
  ppi_us: [
    { month: 'Jan', prevYear: 0.4, currYear: null },
    { month: 'Fev', prevYear: 0.0, currYear: null },
    { month: 'Mar', prevYear: -0.4, currYear: null },
    { month: 'Abr', prevYear: -0.5, currYear: null },
    { month: 'Mai', prevYear: 0.1, currYear: null },
    { month: 'Jun', prevYear: 0.0, currYear: null },
    { month: 'Jul', prevYear: 0.9, currYear: null },
    { month: 'Ago', prevYear: -0.1, currYear: null },
    { month: 'Set', prevYear: 0.3, currYear: null },
    { month: 'Out', prevYear: 0.1, currYear: null },
    { month: 'Nov', prevYear: 0.2, currYear: null },
    { month: 'Dez', prevYear: 0.5, currYear: null },
  ],
  focus: [
    { month: 'Jan', prevYear: 4.56, currYear: 4.44 },
    { month: 'Fev', prevYear: 5.06, currYear: null },
    { month: 'Mar', prevYear: 5.48, currYear: null },
    { month: 'Abr', prevYear: 5.53, currYear: null },
    { month: 'Mai', prevYear: 5.32, currYear: null },
    { month: 'Jun', prevYear: 5.35, currYear: null },
    { month: 'Jul', prevYear: 5.23, currYear: null },
    { month: 'Ago', prevYear: 5.13, currYear: null },
    { month: 'Set', prevYear: 5.17, currYear: null },
    { month: 'Out', prevYear: 4.68, currYear: null },
    { month: 'Nov', prevYear: 4.46, currYear: null },
    { month: 'Dez', prevYear: 4.26, currYear: null },
  ],
  caged: [
    { month: 'Jan', prevYear: 137.30, currYear: null },
    { month: 'Fev', prevYear: 432.00, currYear: null },
    { month: 'Mar', prevYear: 71.58, currYear: null },
    { month: 'Abr', prevYear: 257.53, currYear: null },
    { month: 'Mai', prevYear: 148.99, currYear: null },
    { month: 'Jun', prevYear: 166.62, currYear: null },
    { month: 'Jul', prevYear: 129.78, currYear: null },
    { month: 'Ago', prevYear: 147.36, currYear: null },
    { month: 'Set', prevYear: 213.00, currYear: null },
    { month: 'Out', prevYear: 85.15, currYear: null },
    { month: 'Nov', prevYear: 85.86, currYear: null },
    { month: 'Dez', prevYear: -618.16, currYear: null },
  ],
  trade_balance: [
    { month: 'Jan', prevYear: 2.16, currYear: 4.34 },
    { month: 'Fev', prevYear: -0.32, currYear: null },
    { month: 'Mar', prevYear: 8.15, currYear: null },
    { month: 'Abr', prevYear: 8.15, currYear: null },
    { month: 'Mai', prevYear: 7.24, currYear: null },
    { month: 'Jun', prevYear: 5.89, currYear: null },
    { month: 'Jul', prevYear: 7.08, currYear: null },
    { month: 'Ago', prevYear: 6.13, currYear: null },
    { month: 'Set', prevYear: 2.99, currYear: null },
    { month: 'Out', prevYear: 6.96, currYear: null },
    { month: 'Nov', prevYear: 5.84, currYear: null },
    { month: 'Dez', prevYear: 9.63, currYear: null },
  ],
};

export const AUTOMATION_STEPS: AutomationStep[] = [
  {
    id: 1,
    title: "Coleta Automatizada (Web Scraping/API)",
    tool: "Python (BeautifulSoup / Selenium) ou Make.com",
    description: "Configurar um script que visita os sites oficiais (BLS, IBGE, Fed) ou consome APIs como Alpha Vantage/Fred.",
    prompt: "Crie um script em Python usando a biblioteca 'fredapi' para extrair os dados mais recentes do Payroll (NFP) e exportar para um CSV estruturado."
  },
  {
    id: 2,
    title: "Processamento e Limpeza",
    tool: "Pandas ou AI Agent (GPT-4o)",
    description: "Transformar dados brutos em formatos padronizados, removendo ruídos e tratando das datas.",
    prompt: "Aja como engenheiro de dados. Limpe este JSON de indicadores econômicos brutos, padronize datas para ISO e valores para float com 2 casas decimais."
  },
  {
    id: 3,
    title: "Armazenamento em Nuvem",
    tool: "Google Sheets API ou Supabase",
    description: "Manter o histórico de 2025 e 2026 centralizado para consulta rápida via dashboard.",
    prompt: "Como integrar um script Python com a API do Google Sheets para atualizar uma linha específica baseada no mês e ano atuais?"
  },
  {
    id: 4,
    title: "Análise de Tendências com IA",
    tool: "Gemini API",
    description: "Comparar automaticamente o valor atual com o anterior e gerar um relatório de impacto para o mercado.",
    prompt: "Analise estes dados: Payroll atual 130k vs anterior 143k. CPI atual 2.7% vs anterior 3.1%. Qual o impacto provável na decisão de juros do Fed na próxima reunião?"
  },
  {
    id: 5,
    title: "Alertas Inteligentes",
    tool: "Telegram Bot / Slack",
    description: "Enviar notificações instantâneas quando um dado é publicado e foge do consenso do mercado.",
    prompt: "Crie uma lógica de alerta: se o CPI veio 0.2% acima do consenso, dispare um alerta urgente 'ALTA DE INFLAÇÃO' via bot do Telegram."
  },
  {
    id: 6,
    title: "Visualização Dinâmica",
    tool: "React + Recharts",
    description: "Renderizar os gráficos comparativos automaticamente assim que o dado entra na planilha/banco.",
    prompt: "Crie um componente de gráfico de linha em Recharts que compare duas séries temporais (2025 vs 2026) com estilos de linha diferentes."
  }
];
