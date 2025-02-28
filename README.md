# Projeto de Dashboard para Criptomoedas

![Logo do Projeto](./doc/logo.svg)

## Descrição
Este projeto é uma aplicação de dashboard para gerenciamento de criptomoedas, permitindo a visualização e manipulação de dados em tempo real de diversas moedas digitais. Utiliza NestJS como backend, TypeORM para gerenciar o acesso ao banco de dados e está implementado com integração a APIs externas para atualização contínua das informações.

![Screenshot do Dashboard](./doc/dashboard.png)

> **Dica de Desenvolvimento:**  
> Para rodar os projetos é só rodar o docker `docker compose up -d`
> Em cada pasta de domínio deste projeto, há um arquivo `.http` que pode ser usado para gerar requisições e testar os endpoints associados. Esses arquivos ajudam na documentação e facilitam os testes durante o desenvolvimento.
> Acompanhe o [Quadro(Board)](https://github.com/users/MatheusVSMPimentel/projects/3) dentro da aba projetos, para visualizar funções já lançadas e andamento das funções: <https://github.com/users/MatheusVSMPimentel/projects/3>


## Funcionalidades
- **Visualização de Moedas:** Veja detalhes de criptomoedas, como símbolo, imagem, nome completo, e outras informações relevantes.
- **Atualização Automática:** Cronjobs configurados para atualizar os dados das moedas a cada 24 horas.
- **Filtragem Dinâmica:** Filtros que permitem busca dinâmica pelo símbolo das moedas.
- **Estrutura Modular:** Código organizado em módulos, controladores e serviços para facilitar a manutenção e expansão.

## Tecnologias Utilizadas
- **NestJS:** Framework para construção de aplicações server-side eficientes, escaláveis e mantíveis.
- **TypeORM:** ORM para bancos de dados, permitindo fácil integração e manipulação dos dados.
- **Docker:** Containerização da aplicação para facilitar a execução em diferentes ambientes.
- **APIs de Terceiros:** Integração com APIs para obter dados em tempo real das criptomoedas.

## Estrutura do Projeto
O projeto segue uma estrutura modular, dividida em módulos de funcionalidades específicas, garantindo melhor organização e facilidade de manutenção.

## C4 Model documentation:
- **System Context**
![Contexto do sistema](./doc/structurizr-99861-DashCriptoContext.svg)
![legenda sistema](./doc/structurizr-99861-DashCriptoContext-key.svg)

- **Cripto Dashboard Container**
![Container Dashboard Application](./doc/structurizr-99861-DashCriptoContainer.svg)
![legenda container](./doc/structurizr-99861-DashCriptoContainer-key.svg)

- **Cripto Dashboard REST API Component**
![Component Dashboard REST API](./doc/structurizr-99861-DashCriptoApi.svg)
![legenda componente dashboard](./doc/structurizr-99861-DashCriptoApi-key.svg)

- **Cripto Usuario REST API Component**
![Component Usuario REST API](./doc/structurizr-99861-DashUserApi.svg)
![legenda componente usuario](./doc/structurizr-99861-DashUserApi-key.svg)