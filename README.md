# Desafio Grupo Arcca - Back-end
## Visão Geral

Este README tem como objetivo fornecer uma descrição detalhada dos requisitos funcionais, não funcionais e das regras de negócio para o desenvolvimento do banco de dados de reviews do Google Maps. O sistema tem como finalidade principal armazenar e gerenciar os dados de reviews de várias empresas presentes no Google Maps, possibilitando a geração de relatórios a partir desses dados.

## Requisitos Funcionais

1. **Armazenamento de Reviews:**
   - [X] O sistema deve ser capaz de receber e armazenar um ou mais reviews de empresas do Google Maps.
   - [X] Cada review deve conter os seguintes dados: nome do avaliador, descrição do review, data da avaliação, nota atribuída.

2. **Validação de Reviews Únicos:**
   - [X] O sistema deve impedir a inserção de reviews duplicados no banco de dados.

3. **Geração de Relatórios:**
   - [X] O sistema deve permitir a geração de relatórios a partir dos dados armazenados, fornecendo informações úteis sobre as avaliações das empresas.

## Requisitos Não Funcionais

1. **Segurança:**
   - [X] O banco de dados deve garantir a segurança dos dados armazenados, adotando medidas de proteção contra acesso não autorizado e possíveis ataques.

2. **Desempenho:**
   - [X] O sistema deve ser eficiente no armazenamento e recuperação de dados, garantindo tempos de resposta rápidos mesmo com um grande volume de reviews.


## Regras de Negócio
1. **Atualização de Reviews:**
   - [X] O sistema deve permitir a atualização de reviews já cadastrados.