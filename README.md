# Desafio Grupo Arcca - Back-end
## Visão Geral

Este README tem como objetivo fornecer uma descrição detalhada dos requisitos funcionais, não funcionais e das regras de negócio para o desenvolvimento do banco de dados de reviews do Google Maps. O sistema tem como finalidade principal armazenar e gerenciar os dados de reviews de várias empresas presentes no Google Maps, possibilitando a geração de relatórios a partir desses dados.

## Requisitos Funcionais

1. **Armazenamento de Reviews:**
   - [ ] O sistema deve ser capaz de receber e armazenar um ou mais reviews de empresas do Google Maps.
   - [ ] Cada review deve conter os seguintes dados: nome do avaliador, descrição do review, data da avaliação, nota atribuída e nome da empresa avaliada.

2. **Validação de Reviews Únicos:**
   - [ ] O sistema deve impedir a inserção de reviews duplicados no banco de dados.
   - [ ] A identificação de reviews duplicados deve ser feita com base em critérios como nome do avaliador, descrição do review, data da avaliação e nome da empresa.

3. **Recuperação de Dados:**
   - [ ] Deve ser possível recuperar os reviews armazenados no banco de dados com base em diferentes critérios, como nome da empresa, data da avaliação, nota atribuída, etc.

4. **Geração de Relatórios:**
   - [ ] O sistema deve permitir a geração de relatórios a partir dos dados armazenados, fornecendo informações úteis sobre as avaliações das empresas.

## Requisitos Não Funcionais

1. **Segurança:**
   - [ ] O banco de dados deve garantir a segurança dos dados armazenados, adotando medidas de proteção contra acesso não autorizado e possíveis ataques.

2. **Desempenho:**
   - [ ] O sistema deve ser eficiente no armazenamento e recuperação de dados, garantindo tempos de resposta rápidos mesmo com um grande volume de reviews.

3. **Escalabilidade:**
   - [ ] O banco de dados deve ser projetado para suportar um crescimento futuro na quantidade de dados e no número de usuários, sem comprometer o desempenho.

4. **Confiabilidade:**
   - [ ] Deve ser assegurada a integridade e a disponibilidade dos dados, evitando perdas ou falhas no acesso às informações.

## Regras de Negócio

1. **Proibição de Reviews Anônimos:**
   - [ ] O sistema não deve permitir a inserção de reviews sem o nome do avaliador, garantindo a transparência e a credibilidade das avaliações.

2. **Restrição de Notas Válidas:**
   - [ ] A nota atribuída ao review deve estar dentro de um intervalo predefinido, garantindo que apenas valores válidos sejam armazenados no banco de dados.

3. **Atualização de Reviews:**
   - [ ] O sistema deve permitir a atualização ou edição de reviews já cadastrados, mantendo um histórico das alterações realizadas.
