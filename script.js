window.DADOS=[{"n":"cidade","d":"Cidades e unidades da federação usadas na composição de endereços.","l":"Origem: carga cadastral pelo Administrador. Destino: cep e endereco.","r":"Atendente: R; Gerente: R; Administrador: C/R/U","c":[["id_cidade","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de cidade."],["nome","VARCHAR(100)","[UK composta: nome, uf] | NOT NULL","N/A","Nome do município."],["uf","CHAR(2)","[UK composta: nome, uf] | NOT NULL | CHECK (uf IN ('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'))","N/A","Sigla da unidade da federação; limitada às 27 siglas válidas."]]},{"n":"cep","d":"Catálogo de CEPs com logradouro, bairro e cidade; evita repetir cidade e UF em cada endereço (3FN).","l":"Origem: carga cadastral pelo Administrador. Destino: endereco e comprovantes de entrega.","r":"Atendente: R; Gerente: R; Administrador: C/R/U","c":[["cep","CHAR(8)","[PK] | NOT NULL | CHECK (cep REGEXP '^[0-9]{8}$')","N/A","CEP com 8 dígitos numéricos, sem máscara."],["logradouro","VARCHAR(255)","NOT NULL","N/A","Nome da rua ou avenida."],["bairro","VARCHAR(100)","NOT NULL","N/A","Bairro do CEP."],["id_cidade","BIGINT UNSIGNED","[FK] cidade.id_cidade | NOT NULL","N/A","Referência a cidade.id_cidade."]]},{"n":"perfil","d":"Perfis de acesso do sistema: Atendente, Gerente e Administrador. Base do controle de acesso por papel (RNF10).","l":"Origem: carga inicial do script DDL. Destino: usuario e permissões (RBAC).","r":"Atendente: sem acesso; Gerente: R; Administrador: C/R/U","c":[["id_perfil","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de perfil."],["nome","VARCHAR(30)","[UK] | NOT NULL | CHECK (nome IN ('Atendente','Gerente','Administrador'))","N/A","Perfil de acesso: Atendente, Gerente ou Administrador."]]},{"n":"usuario","d":"Operadores do sistema, com perfil, credenciais protegidas por hash e controle de bloqueio (RF06 e RF07).","l":"Origem: RF06 e RF07. Destino: pedido, estorno, historico_preco, movimentacao_estoque e log_auditoria.","r":"Atendente: sem acesso; Gerente: R; Administrador: C/R/U","c":[["id_usuario","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de usuario."],["id_perfil","BIGINT UNSIGNED","[FK] perfil.id_perfil | NOT NULL","N/A","Referência a perfil.id_perfil."],["nome","VARCHAR(255)","NOT NULL","DP","Nome completo do operador."],["login","VARCHAR(100)","[UK] | NOT NULL","DP","Identificador de acesso, único."],["senha_hash","VARCHAR(255)","NOT NULL","DP","Hash Argon2id ou bcrypt da senha; nunca guarda senha em texto claro (RNF09)."],["data_criacao","DATETIME","NOT NULL | DEFAULT CURRENT_TIMESTAMP","N/A","Data e hora de criação da conta, gerada pelo servidor."],["tentativas_falha","INT","NOT NULL | DEFAULT 0 | CHECK (tentativas_falha >= 0)","N/A","Falhas consecutivas de login; zerada no login com sucesso (RF07)."],["bloqueado_ate","DATETIME","NULL","N/A","Fim do bloqueio de 15 minutos após 5 falhas; nulo se não bloqueado."],["ativo","TINYINT(1)","NOT NULL | DEFAULT 1 | CHECK (ativo IN (0,1))","N/A","Situação do registro: 1 ativo, 0 inativo (exclusão lógica)."],["data_inativacao","DATETIME","NULL","N/A","Data e hora da inativação lógica; nulo enquanto ativo."],["troca_senha_obrigatoria","TINYINT(1)","NOT NULL | DEFAULT 1 | CHECK (troca_senha_obrigatoria IN (0,1))","N/A","Vale 1 quando o usuário deve trocar a senha no próximo acesso (RNF01)."]]},{"n":"cliente","d":"Pessoa física ou jurídica que compra na adega. Guarda CPF/CNPJ cifrado e hash de unicidade, maioridade verificada e controle de anonimização (RF01, RF14, PR03 e PR04).","l":"Origem: RF01 e RF14. Destino: pedido, consentimento_lgpd, solicitacao_titular, RF04 e sp_exportar_titular.","r":"Atendente: C/R/U; Gerente: C/R/U; Administrador: R","c":[["id_cliente","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de cliente."],["nome","VARCHAR(255)","NOT NULL","DP","Nome completo ou razão social."],["tipo_pessoa","ENUM('PF','PJ')","NOT NULL","N/A","Pessoa física (PF) ou jurídica (PJ)."],["email","VARCHAR(255)","NULL","DP","E-mail opcional de contato."],["cpf_cnpj_cifrado","VARBINARY(64)","NULL","DP","CPF ou CNPJ cifrado com AES-256-GCM pela aplicação; nulo após anonimização definitiva (PR01 e PR03)."],["cpf_cnpj_hash","CHAR(64)","[UK] | NOT NULL","DP","HMAC-SHA-256 do CPF/CNPJ, usado só para garantir unicidade."],["maioridade_verificada","TINYINT(1)","NOT NULL | DEFAULT 0 | CHECK (maioridade_verificada IN (0,1))","DP","Vale 1 quando a maioridade foi verificada; exigida na venda de bebida alcoólica (RN12)."],["data_verificacao_maioridade","DATETIME","NULL","DP","Data e hora da verificação de maioridade."],["data_cadastro","DATETIME","NOT NULL | DEFAULT CURRENT_TIMESTAMP","N/A","Data e hora do cadastro, gerada pelo servidor."],["ativo","TINYINT(1)","NOT NULL | DEFAULT 1 | CHECK (ativo IN (0,1))","N/A","Situação do registro: 1 ativo, 0 inativo (exclusão lógica)."],["data_inativacao","DATETIME","NULL","N/A","Data e hora da inativação lógica; nulo enquanto ativo."],["anonimizado","TINYINT(1)","NOT NULL | DEFAULT 0 | CHECK (anonimizado IN (0,1))","N/A","Vale 1 quando os dados pessoais foram anonimizados por sp_anonimizar_cliente (PR03)."],["data_anonimizacao","DATETIME","NULL","N/A","Data e hora da anonimização."]]},{"n":"telefone_cliente","d":"Telefones do cliente, um ou mais por cliente (1FN).","l":"Origem: RF01. Destino: atendimento e sp_exportar_titular.","r":"Atendente: C/R/U; Gerente: C/R/U; Administrador: R","c":[["id_telefone_cliente","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de telefone_cliente."],["id_cliente","BIGINT UNSIGNED","[FK] cliente.id_cliente | [UK composta: id_cliente, numero] | NOT NULL","N/A","Referência a cliente.id_cliente."],["numero","VARCHAR(20)","[UK composta: id_cliente, numero] | NOT NULL","DP","Número de telefone; único por cliente."],["tipo","ENUM('CELULAR','FIXO')","NOT NULL","N/A","Tipo da linha: CELULAR ou FIXO."],["principal","TINYINT(1)","NOT NULL | DEFAULT 0 | CHECK (principal IN (0,1))","N/A","Vale 1 para o telefone principal do cliente."]]},{"n":"endereco","d":"Endereços de entrega do cliente, ligados a um CEP.","l":"Origem: RF01. Destino: pedido (entrega) e sp_exportar_titular.","r":"Atendente: C/R/U; Gerente: C/R/U; Administrador: R","c":[["id_endereco","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de endereco."],["id_cliente","BIGINT UNSIGNED","[FK] cliente.id_cliente | NOT NULL","N/A","Referência a cliente.id_cliente."],["cep","CHAR(8)","[FK] cep.cep | NOT NULL","DP","CEP do endereço, com referência à tabela cep."],["numero","VARCHAR(20)","NOT NULL","DP","Número do imóvel."],["complemento","VARCHAR(100)","NULL","DP","Complemento opcional do endereço."],["ativo","TINYINT(1)","NOT NULL | DEFAULT 1 | CHECK (ativo IN (0,1))","N/A","Situação do registro: 1 ativo, 0 inativo (exclusão lógica)."],["data_inativacao","DATETIME","NULL","N/A","Data e hora da inativação lógica; nulo enquanto ativo."]]},{"n":"categoria","d":"Agrupamento de produtos do catálogo (RF08).","l":"Origem: RF08. Destino: produto.","r":"Atendente: R; Gerente: C/R/U; Administrador: C/R/U","c":[["id_categoria","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de categoria."],["nome","VARCHAR(100)","[UK] | NOT NULL","N/A","Nome da categoria, único."],["ativo","TINYINT(1)","NOT NULL | DEFAULT 1 | CHECK (ativo IN (0,1))","N/A","Situação do registro: 1 ativo, 0 inativo (exclusão lógica)."],["data_inativacao","DATETIME","NULL","N/A","Data e hora da inativação lógica; nulo enquanto ativo."]]},{"n":"produto","d":"Item comercializado: preço de tabela, código de barras e indicação de bebida alcoólica. O saldo é derivado dos lotes (RF03).","l":"Origem: RF03. Destino: item_pedido, lote_produto e historico_preco.","r":"Atendente: R; Gerente: C/R/U; Administrador: C/R/U","c":[["id_produto","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de produto."],["id_categoria","BIGINT UNSIGNED","[FK] categoria.id_categoria | NOT NULL","N/A","Referência a categoria.id_categoria."],["descricao","VARCHAR(255)","NOT NULL","N/A","Descrição comercial do produto."],["codigo_barras","VARCHAR(32)","[UK] | NOT NULL","N/A","Código de barras, único."],["preco_tabela","DECIMAL(10,2)","NOT NULL | CHECK (preco_tabela > 0)","N/A","Preço de tabela vigente; deve ser maior que zero."],["alcoolico","TINYINT(1)","NOT NULL | CHECK (alcoolico IN (0,1))","N/A","Vale 1 quando o produto é bebida alcoólica (PR04)."],["data_cadastro","DATETIME","NOT NULL | DEFAULT CURRENT_TIMESTAMP","N/A","Data e hora do cadastro do produto."],["ativo","TINYINT(1)","NOT NULL | DEFAULT 1 | CHECK (ativo IN (0,1))","N/A","Situação do registro: 1 ativo, 0 inativo (exclusão lógica)."],["data_inativacao","DATETIME","NULL","N/A","Data e hora da inativação lógica; nulo enquanto ativo."]]},{"n":"historico_preco","d":"Histórico de alterações do preço de tabela, gravado por trigger (RF03).","l":"Origem: trigger trg_produto_au sobre produto. Destino: consulta gerencial.","r":"Atendente: sem acesso; Gerente: R; Administrador: R","c":[["id_historico_preco","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de historico_preco."],["id_produto","BIGINT UNSIGNED","[FK] produto.id_produto | NOT NULL","N/A","Referência a produto.id_produto."],["id_usuario","BIGINT UNSIGNED","[FK] usuario.id_usuario | NOT NULL","N/A","Referência a usuario.id_usuario."],["preco_anterior","DECIMAL(10,2)","NOT NULL | CHECK (preco_anterior > 0)","N/A","Preço de tabela antes da alteração."],["preco_novo","DECIMAL(10,2)","NOT NULL | CHECK (preco_novo > 0)","N/A","Preço de tabela depois da alteração."],["data_alteracao","DATETIME","NOT NULL | DEFAULT CURRENT_TIMESTAMP","N/A","Data e hora da alteração, geradas pelo servidor."]]},{"n":"lote_produto","d":"Lotes recebidos, com validade e saldo atual. Sustenta FEFO e alertas de vencimento (RF05 e RF11).","l":"Origem: RF11 (sp_entrada_lote). Destino: venda em ordem FEFO (RF02), vw_lote_a_vencer e vw_saldo_produto.","r":"Atendente: R; Gerente: C/R/U; Administrador: R","c":[["id_lote_produto","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de lote_produto."],["id_produto","BIGINT UNSIGNED","[FK] produto.id_produto | [UK composta: id_produto, numero_lote] | NOT NULL","N/A","Referência a produto.id_produto."],["numero_lote","VARCHAR(100)","[UK composta: id_produto, numero_lote] | NOT NULL","N/A","Número do lote, único por produto."],["data_validade","DATE","NOT NULL","N/A","Data de validade; lote vencido não pode ser vendido (RN06)."],["quantidade_atual","INT","NOT NULL | DEFAULT 0 | CHECK (quantidade_atual >= 0)","N/A","Saldo atual do lote, mantido por sp_movimentar_estoque; nunca negativo (RN04)."]]},{"n":"forma_pagamento","d":"Formas de pagamento aceitas pela adega (RF10).","l":"Origem: RF10. Destino: pagamento_pedido e estorno.","r":"Atendente: R; Gerente: R; Administrador: C/R/U","c":[["id_forma_pagamento","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de forma_pagamento."],["nome","VARCHAR(50)","[UK] | NOT NULL","N/A","Nome da forma de pagamento, único."],["ativo","TINYINT(1)","NOT NULL | DEFAULT 1 | CHECK (ativo IN (0,1))","N/A","Situação do registro: 1 ativo, 0 inativo (exclusão lógica)."],["data_inativacao","DATETIME","NULL","N/A","Data e hora da inativação lógica; nulo enquanto ativo."]]},{"n":"pedido","d":"Venda registrada, com canal, situação (ABERTO, FINALIZADO, CANCELADO), desconto e dados de cancelamento. O total não é armazenado: vem de vw_pedido_total (RF02 e RF09).","l":"Origem: RF02 e RF09. Destino: item_pedido, pagamento_pedido, estorno, RF04 e retenção fiscal de 5 anos (PR01).","r":"Atendente: C/R/U (pedido ABERTO); Gerente: R; Administrador: R","c":[["id_pedido","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de pedido."],["id_cliente","BIGINT UNSIGNED","[FK] cliente.id_cliente | NOT NULL","N/A","Referência a cliente.id_cliente."],["id_usuario","BIGINT UNSIGNED","[FK] usuario.id_usuario | NOT NULL","N/A","Usuário que registrou o pedido (RN02)."],["id_endereco_entrega","BIGINT UNSIGNED","[FK] endereco.id_endereco | NULL","N/A","Endereço de entrega; obrigatório no canal NAO_PRESENCIAL."],["canal_venda","ENUM('BALCAO','NAO_PRESENCIAL')","NOT NULL","N/A","Canal da venda: BALCAO ou NAO_PRESENCIAL (PR02)."],["situacao","ENUM('ABERTO','FINALIZADO','CANCELADO')","NOT NULL | DEFAULT 'ABERTO'","N/A","Estado do pedido: ABERTO, FINALIZADO ou CANCELADO (RN09)."],["valor_desconto","DECIMAL(10,2)","NOT NULL | DEFAULT 0 | CHECK (valor_desconto >= 0)","N/A","Desconto em reais; maior ou igual a zero e limitado por perfil (RN11)."],["data_pedido","DATETIME","NOT NULL | DEFAULT CURRENT_TIMESTAMP","N/A","Data e hora do pedido, geradas pelo servidor."],["data_finalizacao","DATETIME","NULL","N/A","Data e hora da finalização."],["data_entrega","DATETIME","NULL","N/A","Data de recebimento; marco inicial dos 7 dias do art. 49 do CDC (PR02)."],["data_cancelamento","DATETIME","NULL | CHECK (data_cancelamento IS NULL OR data_cancelamento >= data_pedido)","N/A","Data e hora do cancelamento, geradas pelo servidor."],["id_usuario_cancelamento","BIGINT UNSIGNED","[FK] usuario.id_usuario | NULL","N/A","Gerente que autorizou o cancelamento (RN13)."],["motivo_cancelamento","TEXT","NULL","N/A","Justificativa com ao menos 10 caracteres (RN13)."],["chave_acesso_fiscal","CHAR(44)","NULL | CHECK (chave_acesso_fiscal IS NULL OR chave_acesso_fiscal REGEXP '^[0-9]{44}$')","DP","Chave de 44 dígitos do documento fiscal emitido em sistema externo."]]},{"n":"item_pedido","d":"Itens de cada pedido, com preço unitário congelado no momento da venda (RN03).","l":"Origem: RF02. Destino: movimentacao_estoque, vw_pedido_total e RF04.","r":"Atendente: C/R/U (pedido ABERTO); Gerente: R; Administrador: R","c":[["id_item_pedido","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de item_pedido."],["id_pedido","BIGINT UNSIGNED","[FK] pedido.id_pedido | [UK composta: id_pedido, id_produto] | NOT NULL","N/A","Referência a pedido.id_pedido."],["id_produto","BIGINT UNSIGNED","[FK] produto.id_produto | [UK composta: id_pedido, id_produto] | NOT NULL","N/A","Referência a produto.id_produto."],["quantidade","INT","NOT NULL | CHECK (quantidade > 0)","N/A","Quantidade vendida; maior que zero."],["preco_unitario_venda","DECIMAL(10,2)","NOT NULL | CHECK (preco_unitario_venda > 0)","N/A","Preço unitário congelado no pedido (RN03)."]]},{"n":"pagamento_pedido","d":"Pagamentos do pedido, permitindo pagamento misto (RN14).","l":"Origem: RF02. Destino: validação na finalização e RF04.","r":"Atendente: C/R; Gerente: R; Administrador: R","c":[["id_pagamento_pedido","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de pagamento_pedido."],["id_pedido","BIGINT UNSIGNED","[FK] pedido.id_pedido | NOT NULL","N/A","Referência a pedido.id_pedido."],["id_forma_pagamento","BIGINT UNSIGNED","[FK] forma_pagamento.id_forma_pagamento | NOT NULL","N/A","Referência a forma_pagamento.id_forma_pagamento."],["valor","DECIMAL(10,2)","NOT NULL | CHECK (valor > 0)","N/A","Valor pago nesta forma; a soma iguala o total do pedido (RN14)."]]},{"n":"estorno","d":"Estorno do valor de pedido cancelado, no máximo um por pedido (RF09 e PR02).","l":"Origem: RF09 (sp_cancelar_pedido). Destino: retenção fiscal (PR01) e conciliação financeira.","r":"Atendente: sem acesso; Gerente: C/R; Administrador: R","c":[["id_estorno","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de estorno."],["id_pedido","BIGINT UNSIGNED","[FK] pedido.id_pedido | [UK] | NOT NULL","N/A","Pedido cancelado que originou o estorno; no máximo um estorno por pedido."],["id_forma_pagamento","BIGINT UNSIGNED","[FK] forma_pagamento.id_forma_pagamento | NOT NULL","N/A","Referência a forma_pagamento.id_forma_pagamento."],["id_usuario","BIGINT UNSIGNED","[FK] usuario.id_usuario | NOT NULL","N/A","Referência a usuario.id_usuario."],["valor","DECIMAL(10,2)","NOT NULL | CHECK (valor > 0)","N/A","Valor estornado; não excede o total do pedido."],["data_estorno","DATETIME","NOT NULL | DEFAULT CURRENT_TIMESTAMP","N/A","Data e hora do estorno, geradas pelo servidor."]]},{"n":"movimentacao_estoque","d":"Livro de movimentações de estoque por lote: entradas, saídas, estornos, ajustes e descartes (RN10).","l":"Origem: RF02, RF09, RF11 e RF12 via sp_movimentar_estoque. Destino: lote_produto e vw_conciliacao_estoque.","r":"Atendente: R; Gerente: C/R/U; Administrador: R","c":[["id_movimentacao_estoque","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de movimentacao_estoque."],["id_lote_produto","BIGINT UNSIGNED","[FK] lote_produto.id_lote_produto | NOT NULL","N/A","Referência a lote_produto.id_lote_produto."],["id_item_pedido","BIGINT UNSIGNED","[FK] item_pedido.id_item_pedido | NULL","N/A","Item de pedido que originou a venda ou a recomposição; nulo nos demais tipos."],["id_usuario","BIGINT UNSIGNED","[FK] usuario.id_usuario | NOT NULL","N/A","Referência a usuario.id_usuario."],["tipo","ENUM('ENTRADA','SAIDA_VENDA','ESTORNO_CANCELAMENTO','AJUSTE_POSITIVO','AJUSTE_NEGATIVO','DESCARTE_VENCIDO')","NOT NULL | CHECK (tipo NOT IN ('AJUSTE_POSITIVO','AJUSTE_NEGATIVO','DESCARTE_VENCIDO') OR (motivo IS NOT NULL AND CHAR_LENGTH(TRIM(motivo)) > 0))","N/A","ENTRADA, SAIDA_VENDA, ESTORNO_CANCELAMENTO, AJUSTE_POSITIVO, AJUSTE_NEGATIVO ou DESCARTE_VENCIDO."],["quantidade","INT","NOT NULL | CHECK (quantidade > 0)","N/A","Quantidade movimentada, sempre positiva; o sinal vem do tipo."],["motivo","TEXT","NULL","N/A","Motivo da movimentação; obrigatório em ajustes e descarte."],["data_hora","DATETIME","NOT NULL | DEFAULT CURRENT_TIMESTAMP","N/A","Data e hora da movimentação, geradas pelo servidor."]]},{"n":"consentimento_lgpd","d":"Registro de consentimentos do titular por finalidade e versão do termo (PR03).","l":"Origem: RF14. Destino: auditoria de conformidade e sp_exportar_titular.","r":"Atendente: C/R; Gerente: R; Administrador: C/R/U","c":[["id_consentimento_lgpd","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de consentimento_lgpd."],["id_cliente","BIGINT UNSIGNED","[FK] cliente.id_cliente | NOT NULL","N/A","Referência a cliente.id_cliente."],["finalidade","VARCHAR(255)","NOT NULL","N/A","Finalidade do tratamento consentida pelo titular."],["versao_termo","VARCHAR(30)","NOT NULL","N/A","Versão do termo aceito."],["data_consentimento","DATETIME","NOT NULL | DEFAULT CURRENT_TIMESTAMP","N/A","Data e hora do consentimento."],["data_revogacao","DATETIME","NULL","N/A","Data da revogação; nulo enquanto vigente."]]},{"n":"solicitacao_titular","d":"Solicitações de direitos do titular (LGPD, art. 18), com prazo de resposta de 15 dias (RF14).","l":"Origem: RF14. Destino: sp_anonimizar_cliente e vw_solicitacao_vencendo.","r":"Atendente: sem acesso; Gerente: R; Administrador: C/R/U","c":[["id_solicitacao_titular","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de solicitacao_titular."],["id_cliente","BIGINT UNSIGNED","[FK] cliente.id_cliente | NOT NULL","N/A","Referência a cliente.id_cliente."],["tipo","ENUM('ACESSO','CORRECAO','ANONIMIZACAO','PORTABILIDADE','REVOGACAO')","NOT NULL","N/A","ACESSO, CORRECAO, ANONIMIZACAO, PORTABILIDADE ou REVOGACAO."],["situacao","ENUM('ABERTA','ATENDIDA','NEGADA_RETENCAO_LEGAL')","NOT NULL | DEFAULT 'ABERTA'","N/A","ABERTA, ATENDIDA ou NEGADA_RETENCAO_LEGAL."],["data_solicitacao","DATETIME","NOT NULL | DEFAULT CURRENT_TIMESTAMP","N/A","Data e hora do pedido do titular."],["data_resposta","DATETIME","NULL","N/A","Data da resposta ao titular; prazo de 15 dias."]]},{"n":"log_auditoria","d":"Trilha de auditoria somente de inclusão: operações sensíveis e eventos de login (RNF01 e RF13).","l":"Origem: triggers de auditoria e sp_registrar_tentativa_login. Destino: consulta de auditoria (RF13).","r":"Atendente: sem acesso; Gerente: R; Administrador: R (somente inclusao; nenhum perfil altera ou exclui)","c":[["id_log_auditoria","BIGINT UNSIGNED","[PK] | NOT NULL | AUTO_INCREMENT","N/A","Identificador único (chave substituta) de log_auditoria."],["id_usuario","BIGINT UNSIGNED","[FK] usuario.id_usuario | NULL","N/A","Usuário que executou a ação; nulo em ações do sistema ou login sem usuário identificado."],["tabela_afetada","VARCHAR(100)","NOT NULL","N/A","Tabela alterada, ou usuario nos eventos de login."],["id_registro_afetado","VARCHAR(100)","NULL","N/A","Chave do registro afetado, em texto."],["operacao","ENUM('INSERT','UPDATE','DELETE','LOGIN_OK','LOGIN_FALHA')","NOT NULL","N/A","INSERT, UPDATE, DELETE, LOGIN_OK ou LOGIN_FALHA."],["valor_anterior","JSON","NULL","DP","Snapshot JSON anterior, sem dados pessoais em claro."],["valor_novo","JSON","NULL","DP","Snapshot JSON posterior, sem dados pessoais em claro."],["data_hora","DATETIME","NOT NULL | DEFAULT CURRENT_TIMESTAMP","N/A","Data e hora do evento, geradas pelo servidor."]]}];
(function () {
  var D = window.DADOS;
  var $ = function (s) { return document.querySelector(s); };
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; }
  var CLS = { 'DP': 'dp', 'DPS': 'dps', 'N/A': 'na' };
  var NOMES = { 'DP': 'Dado Pessoal', 'DPS': 'Dado Pessoal Sensível', 'N/A': 'Não Aplicável' };
  var nav = $('#nav-list');
  var main = $('#dicionario');
  var blocos = [];
  var CAB = ['Atributo', 'Descrição / Regra de Negócio', 'Tipo e Tamanho', 'Constraints', 'Privacidade (LGPD/GDPR)', 'Linhagem (Data Lineage)', 'Controle de Acesso (RBAC)'];

  D.forEach(function (t) {
    var li = el('li');
    var a = el('a', '', t.n);
    a.href = '#' + t.n;
    li.append(a);
    nav.append(li);

    var sec = el('section', 'tabela');
    sec.id = t.n;
    sec.append(el('h2', '', t.n));
    sec.append(el('p', 'finalidade', t.d));
    var wrap = el('div', 'tabela-wrap');
    var tb = el('table');
    var hr = el('tr');
    CAB.forEach(function (h) { var th = el('th', '', h); th.scope = 'col'; hr.append(th); });
    var thead = el('thead');
    thead.append(hr);
    tb.append(thead);
    var tbody = el('tbody');
    var linhas = [];
    t.c.forEach(function (c) {
      var tr = el('tr');
      tr.append(el('td', 'attr', c[0]));
      tr.append(el('td', '', c[4]));
      tr.append(el('td', 'tipo', c[1]));
      var k = el('td', 'cons');
      c[2].split(' | ').forEach(function (p) {
        var s = el('span', 'marca');
        var m = p.match(/^(\[[^\]]+\])(.*)$/);
        if (m) { s.append(el('strong', '', m[1])); if (m[2]) s.append(document.createTextNode(m[2])); } else { s.textContent = p; }
        k.append(s);
      });
      tr.append(k);
      var pv = el('td');
      var b = el('span', 'badge badge-' + CLS[c[3]], '[' + c[3] + ']');
      b.title = NOMES[c[3]];
      pv.append(b);
      tr.append(pv);
      tr.append(el('td', 'meta', t.l));
      tr.append(el('td', 'meta', t.r));
      tbody.append(tr);
      linhas.push({ tr: tr, nome: c[0].toLowerCase() });
    });
    tb.append(tbody);
    wrap.append(tb);
    sec.append(wrap);
    main.append(sec);
    blocos.push({ sec: sec, li: li, nome: t.n.toLowerCase(), linhas: linhas });
  });

  var busca = $('#busca');
  var contagem = $('#contagem');
  var vazio = $('#vazio');
  function filtrar() {
    var q = busca.value.trim().toLowerCase();
    var tabelas = 0, colunas = 0;
    blocos.forEach(function (b) {
      var casaTabela = q === '' || b.nome.indexOf(q) !== -1;
      var visiveis = 0;
      b.linhas.forEach(function (l) {
        var ok = casaTabela || l.nome.indexOf(q) !== -1;
        l.tr.hidden = !ok;
        if (ok) visiveis++;
      });
      b.sec.hidden = visiveis === 0;
      b.li.hidden = visiveis === 0;
      if (visiveis > 0) { tabelas++; colunas += visiveis; }
    });
    contagem.textContent = tabelas + ' de ' + blocos.length + ' tabelas, ' + colunas + ' colunas exibidas';
    vazio.hidden = tabelas !== 0;
  }
  busca.addEventListener('input', filtrar);
  filtrar();

  var raiz = document.documentElement;
  var salvo = null;
  try { salvo = localStorage.getItem('tema'); } catch (e) { salvo = null; }
  var tema = salvo || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  var btnTema = $('#btn-tema');
  function aplicarTema(v) {
    raiz.setAttribute('data-theme', v);
    btnTema.textContent = v === 'dark' ? 'Modo claro' : 'Modo escuro';
    btnTema.setAttribute('aria-pressed', v === 'dark' ? 'true' : 'false');
    try { localStorage.setItem('tema', v); } catch (e) { return; }
  }
  aplicarTema(tema);
  btnTema.addEventListener('click', function () {
    tema = raiz.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    aplicarTema(tema);
  });

  var menu = $('#sidebar');
  var btnMenu = $('#btn-menu');
  btnMenu.addEventListener('click', function () {
    var aberto = menu.classList.toggle('aberta');
    btnMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('aberta'); btnMenu.setAttribute('aria-expanded', 'false'); }
  });

  var modal = $('#modal-der');
  var cena = $('#der-cena');
  var img = $('#der-img');
  var pz = null;
  var ultimoFoco = null;
  function iniciarPanzoom() {
    if (pz || typeof Panzoom === 'undefined') return;
    pz = Panzoom(img, { maxScale: 10, minScale: 0.1, canvas: true });
    cena.addEventListener('wheel', pz.zoomWithWheel);
  }
  function abrir() {
    ultimoFoco = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('sem-rolagem');
    iniciarPanzoom();
    if (pz) pz.reset({ animate: false });
    $('#der-fechar').focus();
  }
  function fechar() {
    modal.hidden = true;
    document.body.classList.remove('sem-rolagem');
    if (ultimoFoco) ultimoFoco.focus();
  }
  $('#btn-der').addEventListener('click', abrir);
  $('#der-fechar').addEventListener('click', fechar);
  $('#der-mais').addEventListener('click', function () { if (pz) pz.zoomIn(); });
  $('#der-menos').addEventListener('click', function () { if (pz) pz.zoomOut(); });
  $('#der-reset').addEventListener('click', function () { if (pz) pz.reset(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) fechar(); });
})();
