-- Script para popular o banco de dados com instrumentos iniciais
INSERT INTO instrumentos (id, nome, quantidade, "createdAt", "updatedAt") VALUES
  ('inst_1', 'Violão', 3, NOW(), NOW()),
  ('inst_2', 'Piano', 2, NOW(), NOW()),
  ('inst_3', 'Bateria', 1, NOW(), NOW()),
  ('inst_4', 'Baixo', 2, NOW(), NOW()),
  ('inst_5', 'Teclado', 2, NOW(), NOW()),
  ('inst_6', 'Flauta', 4, NOW(), NOW()),
  ('inst_7', 'Saxofone', 1, NOW(), NOW()),
  ('inst_8', 'Trompete', 2, NOW(), NOW())
ON CONFLICT (nome) DO NOTHING;
