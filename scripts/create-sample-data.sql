-- Script para criar dados de exemplo no sistema

-- Limpar dados existentes (cuidado em produção!)
-- DELETE FROM presencas;
-- DELETE FROM pagamentos;
-- DELETE FROM alunos;
-- DELETE FROM instrumentos;

-- Inserir instrumentos de exemplo
INSERT INTO instrumentos (id, nome, quantidade, "createdAt", "updatedAt") VALUES
  ('inst_violao', 'Violão', 4, NOW(), NOW()),
  ('inst_piano', 'Piano', 2, NOW(), NOW()),
  ('inst_bateria', 'Bateria', 1, NOW(), NOW()),
  ('inst_baixo', 'Baixo', 2, NOW(), NOW()),
  ('inst_teclado', 'Teclado', 3, NOW(), NOW()),
  ('inst_flauta', 'Flauta', 5, NOW(), NOW()),
  ('inst_violino', 'Violino', 3, NOW(), NOW()),
  ('inst_saxofone', 'Saxofone', 2, NOW(), NOW()),
  ('inst_trompete', 'Trompete', 2, NOW(), NOW()),
  ('inst_guitarra', 'Guitarra', 3, NOW(), NOW())
ON CONFLICT (nome) DO NOTHING;

-- Inserir alunos de exemplo
INSERT INTO alunos (id, nome, idade, "instrumentoId", "statusPagamento", "createdAt", "updatedAt") VALUES
  ('aluno_1', 'Maria Silva Santos', 16, 'inst_violao', true, NOW(), NOW()),
  ('aluno_2', 'João Pedro Oliveira', 14, 'inst_piano', false, NOW(), NOW()),
  ('aluno_3', 'Ana Carolina Lima', 18, 'inst_flauta', true, NOW(), NOW()),
  ('aluno_4', 'Carlos Eduardo Costa', 15, 'inst_bateria', true, NOW(), NOW()),
  ('aluno_5', 'Beatriz Ferreira', 17, 'inst_violao', false, NOW(), NOW()),
  ('aluno_6', 'Gabriel Santos', 13, 'inst_teclado', true, NOW(), NOW()),
  ('aluno_7', 'Larissa Rodrigues', 16, 'inst_violino', true, NOW(), NOW()),
  ('aluno_8', 'Rafael Almeida', 19, 'inst_baixo', false, NOW(), NOW()),
  ('aluno_9', 'Camila Souza', 15, 'inst_saxofone', true, NOW(), NOW()),
  ('aluno_10', 'Lucas Pereira', 14, 'inst_guitarra', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir pagamentos para o mês atual
INSERT INTO pagamentos (id, "alunoId", valor, mes, pago, "dataPagamento", "createdAt", "updatedAt") VALUES
  ('pag_1', 'aluno_1', 100.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), true, CURRENT_DATE - INTERVAL '5 days', NOW(), NOW()),
  ('pag_2', 'aluno_2', 100.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), false, NULL, NOW(), NOW()),
  ('pag_3', 'aluno_3', 100.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), true, CURRENT_DATE - INTERVAL '3 days', NOW(), NOW()),
  ('pag_4', 'aluno_4', 100.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), true, CURRENT_DATE - INTERVAL '7 days', NOW(), NOW()),
  ('pag_5', 'aluno_5', 100.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), false, NULL, NOW(), NOW()),
  ('pag_6', 'aluno_6', 100.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), true, CURRENT_DATE - INTERVAL '2 days', NOW(), NOW()),
  ('pag_7', 'aluno_7', 100.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), true, CURRENT_DATE - INTERVAL '4 days', NOW(), NOW()),
  ('pag_8', 'aluno_8', 100.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), false, NULL, NOW(), NOW()),
  ('pag_9', 'aluno_9', 100.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), true, CURRENT_DATE - INTERVAL '6 days', NOW(), NOW()),
  ('pag_10', 'aluno_10', 100.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), true, CURRENT_DATE - INTERVAL '1 day', NOW(), NOW())
ON CONFLICT ("alunoId", mes) DO NOTHING;

-- Inserir algumas presenças de exemplo para a semana atual
INSERT INTO presencas (id, "alunoId", data, presente, "createdAt") VALUES
  -- Segunda-feira
  ('pres_1', 'aluno_1', CURRENT_DATE - INTERVAL '6 days', true, NOW()),
  ('pres_2', 'aluno_2', CURRENT_DATE - INTERVAL '6 days', false, NOW()),
  ('pres_3', 'aluno_3', CURRENT_DATE - INTERVAL '6 days', true, NOW()),
  ('pres_4', 'aluno_4', CURRENT_DATE - INTERVAL '6 days', true, NOW()),
  ('pres_5', 'aluno_5', CURRENT_DATE - INTERVAL '6 days', true, NOW()),
  
  -- Quarta-feira
  ('pres_6', 'aluno_6', CURRENT_DATE - INTERVAL '4 days', true, NOW()),
  ('pres_7', 'aluno_7', CURRENT_DATE - INTERVAL '4 days', true, NOW()),
  ('pres_8', 'aluno_8', CURRENT_DATE - INTERVAL '4 days', false, NOW()),
  ('pres_9', 'aluno_9', CURRENT_DATE - INTERVAL '4 days', true, NOW()),
  ('pres_10', 'aluno_10', CURRENT_DATE - INTERVAL '4 days', true, NOW()),
  
  -- Sexta-feira
  ('pres_11', 'aluno_1', CURRENT_DATE - INTERVAL '2 days', true, NOW()),
  ('pres_12', 'aluno_2', CURRENT_DATE - INTERVAL '2 days', true, NOW()),
  ('pres_13', 'aluno_3', CURRENT_DATE - INTERVAL '2 days', false, NOW()),
  ('pres_14', 'aluno_4', CURRENT_DATE - INTERVAL '2 days', true, NOW()),
  ('pres_15', 'aluno_5', CURRENT_DATE - INTERVAL '2 days', false, NOW())
ON CONFLICT (id) DO NOTHING;
