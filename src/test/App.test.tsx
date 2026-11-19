import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('FOLIO — Fases 01 e 02: Página Inicial e Editor de Currículos', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState(null, '', '/');
  });

  it('preserva integralmente a página inicial da Fase 01 (Cabeçalho, Hero, Modelos, Benefícios, Como funciona e Rodapé)', () => {
    render(<App />);
    const banner = screen.getByRole('banner');
    expect(within(banner).getByText('FOLIO')).toBeInTheDocument();
    expect(within(banner).getByRole('link', { name: /Modelos/i })).toBeInTheDocument();
    expect(within(banner).getByRole('link', { name: /Como funciona/i })).toBeInTheDocument();
    expect(within(banner).getByRole('link', { name: /Sobre/i })).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Seu próximo capítulo começa no papel\./i,
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'ESSENCIAL' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'EDITORIAL' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CLÁSSICO' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'EXECUTIVO' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'TÉCNICO' })).toBeInTheDocument();
    expect(document.body.textContent?.toLowerCase()).not.toContain('lorem ipsum');
  });

  it('abre o editor de currículos ao clicar em "Criar meu currículo" e exibe a folha A4 inicialmente em branco sem misturar dados de exemplo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Criar meu currículo' }));

    expect(
      screen.getByRole('heading', { level: 1, name: /01 — Dados pessoais/i })
    ).toBeInTheDocument();

    // Verifica que a folha A4 começa em branco, sem misturar o exemplo da Helena Vasconcelos
    expect(screen.getByText(/Sua folha A4 está pronta\./i)).toBeInTheDocument();
    expect(screen.queryByText('Helena Vasconcelos')).not.toBeInTheDocument();
  });

  it('atualiza a pré-visualização A4 em tempo real ao preencher Dados Pessoais, Objetivo e Resumo, e salva automaticamente no LocalStorage', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: 'Criar meu currículo' }));

    // 01 — Dados Pessoais
    await user.type(screen.getByLabelText(/Nome completo/i), 'Gabriel Ferreira');
    await user.type(
      screen.getByLabelText(/Cargo ou título profissional/i),
      'Engenheiro Civil Pleno'
    );
    await user.type(screen.getByLabelText(/E-mail/i), 'gabriel@ferreira.eng.br');
    await user.type(screen.getByLabelText(/Telefone/i), '(21) 99876-5432');
    await user.type(screen.getByLabelText(/Cidade e estado/i), 'Niterói, RJ');

    // A folha A4 já exibe imediatamente os dados reais digitados
    const a4Sheet = screen.getByLabelText(/Folha de currículo A4/i);
    expect(within(a4Sheet).getByText('Gabriel Ferreira')).toBeInTheDocument();
    expect(within(a4Sheet).getByText('Engenheiro Civil Pleno')).toBeInTheDocument();
    expect(within(a4Sheet).getByText('gabriel@ferreira.eng.br')).toBeInTheDocument();

    // 02 — Objetivo Profissional
    await user.click(screen.getByRole('button', { name: /02 Objetivo/i }));
    expect(
      screen.getByText(/COMO ESCREVER UM BOM OBJETIVO PROFISSIONAL/i)
    ).toBeInTheDocument();
    await user.type(
      screen.getByLabelText(/Objetivo profissional/i),
      'Atuar na coordenação de obras civis e infraestrutura urbana.'
    );
    expect(
      within(screen.getByLabelText(/Folha de currículo A4/i)).getByText(
        /Atuar na coordenação de obras civis/i
      )
    ).toBeInTheDocument();

    // 03 — Resumo Profissional
    await user.click(screen.getByRole('button', { name: /03 Resumo/i }));
    await user.type(
      screen.getByLabelText(/Resumo profissional/i),
      'Seis anos de experiência em gestão de cronograma físico-financeiro.'
    );

    // Simula atualização da página (F5) desmontando e montando novamente o App
    unmount();
    render(<App />);

    // Deve recuperar automaticamente a visualização do editor e os dados preenchidos
    expect(
      within(screen.getByLabelText(/Folha de currículo A4/i)).getByText('Gabriel Ferreira')
    ).toBeInTheDocument();
    expect(
      within(screen.getByLabelText(/Folha de currículo A4/i)).getByText(
        /Seis anos de experiência em gestão de cronograma/i
      )
    ).toBeInTheDocument();
  });

  it('permite adicionar, editar, reordenar e excluir experiências profissionais, além de suportar candidatos sem experiência (1º emprego)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Criar meu currículo' }));
    await user.type(screen.getByLabelText(/Nome completo/i), 'Lucas Primeiro Emprego');

    // Navega para 04 — Experiência
    await user.click(screen.getByRole('button', { name: /04 Experiência/i }));

    // Verifica orientações discretas para quem não tem experiência
    expect(
      screen.getByText(/Ainda não possui experiência profissional formal\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Como valorizar seu currículo sem experiência prévia:/i)
    ).toBeInTheDocument();

    // Marca modo 1º emprego sem erros
    await user.click(screen.getByLabelText(/Busco meu 1º emprego/i));

    // Agora testa adicionar duas experiências, reordenar e excluir
    await user.click(
      screen.getByRole('button', { name: /Adicionar experiência profissional/i })
    );
    await user.type(screen.getByLabelText(/Nome da empresa/i), 'Empresa Alfa');
    await user.type(screen.getByLabelText(/^Cargo$/i), 'Estagiário de Projetos');

    await user.click(
      screen.getByRole('button', { name: /Adicionar experiência profissional/i })
    );
    const companyInputs = screen.getAllByLabelText(/Nome da empresa/i);
    await user.type(companyInputs[1], 'Empresa Beta');

    // Reordena a segunda experiência para cima
    await user.click(screen.getByRole('button', { name: /Mover experiência 2 para cima/i }));
    const reorderedCompanies = screen.getAllByLabelText(/Nome da empresa/i);
    expect(reorderedCompanies[0]).toHaveValue('Empresa Beta');

    // Exclui a primeira experiência
    await user.click(screen.getByRole('button', { name: /Excluir experiência 1/i }));
    expect(screen.getAllByLabelText(/Nome da empresa/i)).toHaveLength(1);
    expect(screen.getByLabelText(/Nome da empresa/i)).toHaveValue('Empresa Alfa');
  });

  it('permite adicionar e remover Formação Acadêmica (05), Cursos (06), Habilidades (07), Idiomas (08) e Informações Adicionais (09)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Criar meu currículo' }));
    await user.type(screen.getByLabelText(/Nome completo/i), 'Ana Clara');

    // 05 — Formação Acadêmica
    await user.click(screen.getByRole('button', { name: /05 Formação/i }));
    await user.click(
      screen.getByRole('button', { name: /Adicionar formação acadêmica/i })
    );
    await user.type(screen.getByLabelText(/Instituição de ensino/i), 'UFPE');
    await user.type(screen.getByLabelText(/^Curso$/i), 'Design');
    expect(
      within(screen.getByLabelText(/Folha de currículo A4/i)).getByText('UFPE')
    ).toBeInTheDocument();

    // 06 — Cursos e Certificações
    await user.click(screen.getByRole('button', { name: /06 Cursos/i }));
    await user.click(
      screen.getByRole('button', { name: /Adicionar curso ou certificação/i })
    );
    await user.type(screen.getByLabelText(/Nome do curso/i), 'Acessibilidade Digital WCAG');
    await user.type(screen.getByLabelText(/^Instituição$/i), 'W3C Brasil');
    expect(
      within(screen.getByLabelText(/Folha de currículo A4/i)).getByText(
        'Acessibilidade Digital WCAG'
      )
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Excluir curso 1/i }));
    expect(screen.queryByLabelText(/Nome do curso/i)).not.toBeInTheDocument();

    // 07 — Habilidades
    await user.click(screen.getByRole('button', { name: /07 Habilidades/i }));
    await user.type(
      screen.getByLabelText(/Adicionar habilidade individual/i),
      'Figma'
    );
    await user.click(screen.getByRole('button', { name: /Adicionar habilidade/i }));
    expect(
      within(screen.getByLabelText(/Folha de currículo A4/i)).getByText('Figma')
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Remover habilidade Figma/i }));
    expect(
      within(screen.getByLabelText(/Folha de currículo A4/i)).queryByText('Figma')
    ).not.toBeInTheDocument();

    // 08 — Idiomas
    await user.click(screen.getByRole('button', { name: /08 Idiomas/i }));
    await user.click(screen.getByRole('button', { name: /Adicionar idioma/i }));
    await user.type(screen.getByLabelText(/01\. Idioma/i), 'Inglês');
    await user.selectOptions(screen.getByLabelText(/Nível de proficiência/i), 'Fluente');
    expect(
      within(screen.getByLabelText(/Folha de currículo A4/i)).getByText('Inglês')
    ).toBeInTheDocument();

    // 09 — Informações Adicionais
    await user.click(screen.getByRole('button', { name: /09 Adicionais/i }));
    await user.type(
      screen.getByLabelText(/Informações adicionais/i),
      'Monitora voluntária de tipografia.'
    );
    expect(
      within(screen.getByLabelText(/Folha de currículo A4/i)).getByText(
        /Monitora voluntária de tipografia\./i
      )
    ).toBeInTheDocument();
  });

  it('solicita confirmação antes de limpar os dados do currículo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Criar meu currículo' }));
    await user.type(screen.getByLabelText(/Nome completo/i), 'Pedro Henrique');

    await user.click(screen.getByRole('button', { name: /Limpar dados/i }));
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByText(/Deseja apagar todas as informações preenchidas\?/i)
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /Confirmar limpeza/i }));

    expect(screen.getByLabelText(/Nome completo/i)).toHaveValue('');
    expect(screen.getByText(/Sua folha A4 está pronta\./i)).toBeInTheDocument();
  });

  it('valida conteúdo antes de exportar PDF e inicia download com nome sanitizado quando preenchido', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Criar meu currículo' }));

    // Tenta clicar em BAIXAR CURRÍCULO PDF com o documento em branco
    const exportButtons = screen.getAllByRole('button', { name: /BAIXAR CURRÍCULO PDF/i });
    await user.click(exportButtons[0]);

    const alert = screen.getByRole('alert');
    expect(
      within(alert).getByText(/Preencha ao menos seu nome e informações básicas/i)
    ).toBeInTheDocument();
    expect(
      within(alert).getByRole('button', { name: /Tentar novamente/i })
    ).toBeInTheDocument();

    // Agora preenche o nome e clica em BAIXAR CURRÍCULO PDF
    await user.type(screen.getByLabelText(/Nome completo/i), 'Helena Vasconcelos');
    await user.click(exportButtons[0]);

    expect(
      await screen.findByText(/PDF gerado com sucesso: curriculo-Helena-Vasconcelos\.pdf/i)
    ).toBeInTheDocument();
  });

  it('permite visualizar, comparar e alternar entre os 5 modelos na Biblioteca de Modelos mantendo os dados preenchidos e persistindo a escolha', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole('button', { name: 'Criar meu currículo' }));
    await user.type(screen.getByLabelText(/Nome completo/i), 'Roberto Campos');
    await user.type(
      screen.getByLabelText(/Cargo ou título profissional/i),
      'Diretor de Operações'
    );

    // Abre a Biblioteca Visual dos 5 Modelos
    await user.click(screen.getByRole('button', { name: /Comparar 5 modelos/i }));

    const libraryDialog = screen.getByRole('dialog', {
      name: /Biblioteca de Modelos Profissionais/i,
    });
    expect(libraryDialog).toBeInTheDocument();

    // Verifica que os 5 modelos estão visíveis na biblioteca junto com a nota ATS
    expect(within(libraryDialog).getByText(/Nota de transparência ATS:/i)).toBeInTheDocument();
    expect(within(libraryDialog).getByRole('heading', { name: 'ESSENCIAL' })).toBeInTheDocument();
    expect(within(libraryDialog).getByRole('heading', { name: 'EDITORIAL' })).toBeInTheDocument();
    expect(within(libraryDialog).getByRole('heading', { name: 'CLÁSSICO' })).toBeInTheDocument();
    expect(within(libraryDialog).getByRole('heading', { name: 'EXECUTIVO' })).toBeInTheDocument();
    expect(within(libraryDialog).getByRole('heading', { name: 'TÉCNICO' })).toBeInTheDocument();

    // Seleciona o novo modelo M·04 EXECUTIVO na biblioteca
    await user.click(
      within(libraryDialog).getByRole('button', { name: /Utilizar modelo EXECUTIVO/i })
    );

    // Verifica que a folha A4 passou para o modelo EXECUTIVO preservando o nome "Roberto Campos"
    const a4Sheet = screen.getByLabelText(/Folha de currículo A4 — Modelo EXECUTIVO/i);
    expect(within(a4Sheet).getByText('Roberto Campos')).toBeInTheDocument();
    expect(within(a4Sheet).getByText(/FOLIO · MATRIZ EXECUTIVA \(CONSELHO\)/i)).toBeInTheDocument();

    // Alterna para o modelo M·05 TÉCNICO pela barra rápida do cabeçalho sem perder dados
    const templateGroup = screen.getByRole('group', {
      name: /Selecionar modelo visual do currículo/i,
    });
    await user.click(within(templateGroup).getByRole('button', { name: /Técnico/i }));

    const techSheet = screen.getByLabelText(/Folha de currículo A4 — Modelo TECNICO/i);
    expect(within(techSheet).getByText('Roberto Campos')).toBeInTheDocument();
    expect(within(techSheet).getByText(/FOLIO · MATRIZ TÉCNICA \(ENGENHARIA\)/i)).toBeInTheDocument();

    // Verifica persistência do modelo selecionado após recarregar a página
    unmount();
    render(<App />);
    expect(
      screen.getByLabelText(/Folha de currículo A4 — Modelo TECNICO de Roberto Campos/i)
    ).toBeInTheDocument();
  });
});
