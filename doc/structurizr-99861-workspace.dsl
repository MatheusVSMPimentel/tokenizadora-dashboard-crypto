workspace "Tokenizadora-Cripto-Dashboard" "Um Dashboard onde os usuários podem ver criptos e acompanhar suas preferidas." {

    !identifiers hierarchical

    model {
        u = person "Usuario Dashboard"
        
        dash-system = softwareSystem "Cripto Dashboard" "Aplicação contendo um Dashboard de cripto para uso dos clientes logados" {
        
            spa = container "Single Page Application" "Aplicação Single Page que permite usuário fazer login e visualizar cripto moedas em um dashboard" "VueJs" {
                tags "Frontend"
            }
            
            api-gateway = container "Usuario API Gateway" "Aplicação para evitar que o usuario se conecte diretamente com a aplicação de login enquanto realizar load balance" "APISIX"
            
            user-rest = container "Usuario REST API" "Aplicação que realiza cadastro e login de usuários" "NestJs" {
                tags "Backend", "API"
                post-login-user = component "ENDPOINT POST Login" "Fazer login no sistema"
                post-register-user-login = component "ENDPOINT POST Create User" "Criar login de usuario"
            }
            
            dash-rest = container "Dashboard REST API" "Aplicação que realiza buscas das criptomoedas e seus valores atuais e retorna os dados para a SPA" "NestJs" {
                tags "Backend", "API"
                
                get-crypto-list-by-name = component "ENDPOINT GET Crypto List By Name" "Lista as criptomoedas disponíveis pelo nome"
                get-crypto-value = component "ENDPOINT GET Crypto Value" "Verifica o valor atual de uma criptomoeda"
                cron-crypto-list-update = component "CRONJOB GET All Cryptos List" "Resgata a lista de moedas uma vez por dia e atualiza bancos e cache"
                websocket-crypto-return = component "WEBSOCKET Update Front Values" "Transmite atualizações em tempo real para o frontend"
            }
            
            redis-db = container "Cache Dashboard Database" "Armazena dados temporários para acesso rápido" "Redis" {
                tags "Database", "Cache"
            }
            
            sql-db = container "Dashboard Database" "Armazena os dados persistentes do dashboard" "SQL" {
                tags "Database"
            }
            
            oracle-db = container "User Database" "Armazena os dados dos usuários" "MySQL" {
                tags "Database"
            }
            
            mongo-db = container "Crypto NoSQL Database" "Armazena os dados das criptomoedas monitoradas" "Mongo" {
                tags "Database", "NoSQL"
            }
        }
        
        sso-system = softwareSystem "SSO Partner System" "Aplicação de 3º para realizar login usando SSO"
        cripto-system = softwareSystem "CryptoCompare" "Aplicação de 3º para ler dados de criptomoedas"
        
        
        // Interações
        u -> dash-system.spa "Usa o dashboard para filtrar as criptomoedas"
        
        dash-system -> cripto-system "Obtém dados para alimentar o sistema"
        
        dash-system.spa -> dash-system.dash-rest "Solicita dados de criptomoedas (lista e valores)" "REST API"
        dash-system.spa -> dash-system.api-gateway "Solicita login/cadastro de usuário" "APIGATEWAY"
        dash-system.spa -> dash-system.dash-rest.get-crypto-list-by-name "Lista as criptomoedas disponíveis"
        dash-system.spa -> dash-system.dash-rest.get-crypto-value "Retorna o valor da criptomoeda pesquisada"
        
        dash-system.dash-rest -> dash-system.sql-db "Realiza operações CRUD no banco do dashboard" "SQL"
        
        dash-system.dash-rest.get-crypto-list-by-name -> dash-system.redis-db "Consulta dados em cache" "Redis"
        dash-system.dash-rest.get-crypto-list-by-name -> dash-system.sql-db "Consulta e atualiza dados persistentes" "SQL"
        dash-system.dash-rest.cron-crypto-list-update -> cripto-system "Solicita dados atualizados de criptomoedas e atualiza bancos e cache" "API Externa"
        cripto-system -> dash-system.dash-rest.websocket-crypto-return "Envia dados atualizados de criptomoedas" "WebSocket"
        dash-system.spa -> dash-system.dash-rest.websocket-crypto-return "Solicita atualizações em tempo real para o frontend" "WebSocket"
        
        dash-system.dash-rest.get-crypto-value -> dash-system.mongo-db "Salva correlação entre o id do usuário e as criptos" "SQL"
        dash-system.dash-rest.get-crypto-value -> cripto-system "Confirma o valor da criptomoeda" "API Externa"
        
        dash-system.user-rest.post-login-user -> sso-system "Realiza login usando plataformas de 3º"
        dash-system.user-rest.post-login-user -> dash-system.oracle-db "Pesquisa de dados"
        dash-system.user-rest.post-register-user-login -> dash-system.oracle-db "Realiza operações CRUD nos dados de usuários"
        dash-system.api-gateway -> dash-system.user-rest.post-login-user "Fazer login"
        dash-system.api-gateway -> dash-system.user-rest.post-register-user-login "Criar usuario"
        
    }

    views {
        systemContext dash-system "DashCriptoContext" {
            include *
            autolayout lr
        }

        container dash-system "DashCriptoContainer" {
            include *
            autolayout lr
        }
        
        component dash-system.dash-rest "DashCriptoApi" {
            include *
            autolayout lr
        }
        
        component dash-system.user-rest "DashUserApi" {
            include *
            autolayout lr
        }
        
        styles {
            element "Element" {
                color #ffffff
            }
            element "Person" {
                background #84a9ac
                shape person
            }
            element "Software System" {
                background #3b6978
                color #ffffff
            }
            element "Container" {
                background #204051
                color #ffffff
            }
            element "Component" {
                background #1a1a1d
                color #ffffff
            }
            element "Database" {
                shape cylinder
                background #0f4c75
                color #ffffff
            }
            element "Frontend" {
                background #e4f9f5
                color #000000
            }
            element "Backend" {
                background #3282b8
                color #ffffff
            }
            element "API" {
                border solid
                colour #bbe1fa
            }
            element "Cache" {
                background #f8b500
            }
            element "NoSQL" {
                background #f6416c
            }
        }
    }

    configuration {
        scope softwaresystem
    }
}
