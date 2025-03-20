const infoWindow = document.getElementById('info-window');
const infoWindowContent = infoWindow.querySelector('.modal-content');

function openInfoWindow(type, title = '', messages = []) {
    infoWindow.showModal();

    clearInfoWindowContent();

    switch (type) {
        case 'bfs':
            title = 'Busca em Largura'
            messages.push(`
                Descrição: Esse algoritmo de busca em grafos é utilizado para
                realizar uma busca ou travessia num grafo. Intuitivamente, o algoritmo começa num nó raiz e explora 
                todos os nós vizinhos. Então, para cada um desses vértices mais próximos,
                exploramos os seus vértices vizinhos inexplorados e assim por diante, até que
                ele encontre o alvo da busca (ou, se for travessia, até não haver mais adjacências para visitar). 
            `);
            messages.push('Complexidade de Tempo: O(|V| + |E|)');
            messages.push('Complexidade de Espaço: O(|V|), se usado lista de adjacência');
            messages.push('onde V é o conjunto de vértices e E é o conjunto de arestas do grafo.');
            break;
        case 'dfs':
            title = 'Busca em Profundidade'
            messages.push(`
                Descrição: Esse algoritmo de busca em grafos é utilizado para
                realizar uma busca ou travessia num grafo. Intuitivamente, o algoritmo começa num nó raiz
                e explora tanto quanto possível cada um dos seus ramos, antes
                de retroceder (backtracking). Isso é feito até encontrar o alvo da busca (ou, se for travessia,
                até não haver mais adjacências para visitar). 
            `);
            messages.push('Complexidade de Tempo: O(|V| + |E|)')
            messages.push('Complexidade de Espaço: O(|V|), se usado lista de adjacência');
            messages.push('onde V é o conjunto de vértices e E é o conjunto de arestas do grafo.');
            break;
        case 'check-cycles':
            title = 'Checar ciclos'
            messages.push(`
                Descrição: A checagem de ciclos está sendo feita com uma abordagem de busca
                em profundidade, marcando os nós visitados e mantendo um conjunto de nós em um
                ciclo temporário. Se encontrar um nó já visitado no ciclo temporário, então
                um ciclo foi encontrado.
            `);
            messages.push('Complexidade de Tempo: O(|V| + |E|)')
            messages.push('Complexidade de Espaço: O(|V|), se usado lista de adjacência');
            messages.push('onde V é o conjunto de vértices e E é o conjunto de arestas do grafo.');
            break;
        case 'get-connected-components':
            title = 'Obter componentes conexas'
            messages.push(`
                Descrição: A detecção de componentes conexas utiliza uma abordagem de busca
                em profundidade, marcando os nós visitados e agrupando os nós conectados em
                componentes separadas. Em cada etapa da busca, o algoritmo cria uma nova
                lista de componentes e adiciona todos os nós visitados durante essa travessia
                a ela, separando os componentes.
            `);
            messages.push('Complexidade de Tempo: O(|V| + |E|)')
            messages.push('Complexidade de Espaço: O(|V|), se usado lista de adjacência');
            messages.push('onde V é o conjunto de vértices e E é o conjunto de arestas do grafo.');
            break;
        case 'get-strongly-connected-components':
            title = 'Obter componentes fortemente-conexas'
            messages.push(`
                Descrição: A detecção de componentes fortemente-conexas utiliza o algoritmo de Tarjan,
                que por sua vez utiliza busca em profundidade. Ele atribui índices a cada nó enquanto percorre o grafo e mantém
                uma pilha de nós, acompanhando o menor índice alcançável a partir de cada nó
                da travessia. Quando um nó é visitado pela primeira vez, ele é atribuído e empurrado para
                a pilha. Conforme a travessia continua, o algoritmo atualiza o menor índice alcançável de cada nó.
                Se o menor índice alcançável de um nó corresponder ao seu próprio índice, isso marca o fim de uma componente
                fortemente conexa, e os nós são desempilhados até que o nó atual seja alcançado novamente. Esses nós desempilhados
                formam uma componente fortemente conexa.
            `);
            messages.push('Complexidade de Tempo: O(|V| + |E|)')
            messages.push('Complexidade de espaço: O(|V|), se usado lista de adjacência');
            messages.push('onde V é o conjunto de vértices e E é o conjunto de arestas do grafo.');
            break;
        case 'get-shortest-path':
            title = 'Obter o caminho mais curto entre dois nós'
            messages.push(`
                Descrição: Esse algoritmo utiliza o algoritmo de Dijkstra para encontrar o caminho mais curto
                entre dois nós específicos em um grafo. Ele considera as arestas do grafo como tendo um custo.
                Partindo do nó inicial (fonte), ele expande sistematicamente para os nós vizinhos e atualiza 
                continuamente as distâncias mais curtas conhecidas até encontrar o nó de destino ou completar
                a exploração dos nós alcançáveis. É usada uma fila de prioridade para escolher sempre o nó com
                a menor distância conhecida em cada passo. Quando um caminho mais curto é encontrado, suas distâncias
                são atualizadas. Ao final, através de um mapa de predecessores de cada nó, ele reconstrói o caminho
                mais curto do nó fonte ao nó destino em ordem sequencial.
            `);
            messages.push('Complexidade de Tempo: O(|V| log |V| + |E|)')
            messages.push('Complexidade de espaço: O(|V|)');
            messages.push('onde V é o conjunto de vértices e E é o conjunto de arestas do grafo.');
            break;
        case 'global-info':
            title = 'Informações Gerais';
            messages.push('Teclas de atalho');
            messages.push('- Enter: Confirma ações de modais abertos.');
            messages.push('- Esc: Fecha modais.');
            messages.push('- Ctrl + A: Seleciona todos os elementos do grafo.');
            messages.push('- Ctrl + C: Copia os elementos selecionados.');
            messages.push('- Ctrl + V: Cola os elementos copiados.');
            messages.push('- Ctrl + Z: Desfaz a última ação.');
            messages.push('- Ctrl + Y: Refaz a última ação.');
            messages.push('- E: Ativa/Desativa o modo desenho, no qual é possível clicar e arrastar de um nó para o outro para criar uma nova aresta.');
            messages.push('- N: Adiciona um novo nó no local do cursor do mouse.');
            messages.push('- S: Conecta os nós selecionados.');
            messages.push('- D: Desconecta os nós selecionados.');
            messages.push('- Del: Remove os elementos selecionados.');
            messages.push('- Botão direito do mouse: Abre um menu circular nos elementos selecionados para personalizá-los');
            messages.push('- Botão esquerdo do mouse: Seleciona um elemento. Segurando o CTRL, seleciona múltiplos elementos. Arrastando-o em uma área em branco cria um retângulo de seleção.');
            messages.push('Para mais informações, clique no botão "Link para a documentação do trabalho"');
            break;
        case 'custom-algorithms':
            title = 'Algoritmos Personalizados';
            messages.push(`
                Clique em 'Adicionar Algoritmo' para selecionar um arquivo .js com uma função javascript para manipular o grafo na tela.
                Ele deve conter uma função 'customAlgorithm', que pode ter dois parâmetros: graph (uma instância de 'Graph') e selectedNodes (uma lista de 'Node').
            `);
            messages.push(`
                O primeiro parâmetro é uma instância de 'Grafo', onde 'Grafo' é um objeto Javascript com uma lista de 'Nodes', uma lista de 'Edges' e um booleano 'isDirected'
                que diz se o grafo é ou não direcionado.
            `);
            messages.push(`
                O segundo parâmetro é uma lista de 'Node' selecionados na tela.
            `);
            messages.push(`
                Um 'Grafo' possui os métodos:
            `);                
            messages.push(`
                - 'getNeighbors(node)': retorna a lista dos nós vizinhos a um determinado 'Nó' . Se 'isDirected' for 'true',
                traz todos nós tanto conectados a arestas de entrada quanto de saída. Se for 'false', traz apenas os vizinhos conectados às arestas
                de saída.
            `);
            messages.push(`
                - 'getEdges(node)': retorna todas as arestas ligadas a um nó; tanto as de entrada quanto as de saída.
            `);
            messages.push(`
                - 'getEdge(sourceNode, targetNode)': retorna a aresta que conecta dois nós passados como parâmetros. Caso não haja, retorna undefined.
            `);
            messages.push(`
                Cada 'Node' é um objeto Javascript com atributos 'id', 'weight', 'tag', 'outgoingEdges' e 'incomingEdges'.
                O 'id' é o Guid do objeto Cytoscape; o 'weight' é o peso do nó; o 'tag' é o tag do nó; o 'outgoingEdges' é uma lista de arestas
                de saída e o 'incomingEdges' é uma lista de arestas de entrada.

            `);
            messages.push(`
                Cada 'Edge' é um objeto Javascript com atributos 'id', 'sourceNode', 'targetNode', 'weight' e 'tag'.
                O 'id' é o Guid do objeto Cytoscape; o 'weight' é o peso da aresta; o 'tag' é o tag da aresta; o 'sourceNode' é o nó
                fonte e o 'targetNode' é o nó de saída.
            `);
            messages.push(`
                Os algoritmos adicionados ficarão guardados em memória e listados no menu lateral na seção 'Algoritmos Personalizados'.
                Se quiser remover algoritmos importados, você pode clicar no 'X' ao lado do algoritmo ou no botão 'Limpar'
                para deletar todos os algoritmos importados.
            `);
            messages.push(`
                O retorno da função deve ser uma lista de 'actions', onde cada action é um objeto Javascript com os seguintes parâmetros:
                'type' como parâmetro obrigatório; 'elementId' como parâmetro obrigatório do 'type' = 'animate'; 'message' como parâmetro obrigatório do
                'type' = 'print'; 'color' como parâmetro opcional e padrão como sendo vermelho.
            `);
            messages.push(`
                O 'type' pode ser 'animate' ou 'print'. Indica como funcionará a animação.
                Se for 'animate', precisa conter o 'elementId' de cada objeto animado.
                Esse objeto terá por padrão sua cor mudada para vermelho, porém pode ser opcionalmente modificada para outras cores ('color').
                É também possível modificar o peso pelo 'weight', o 'tag' e a espessura pelo 'size'.
                Se for 'print', precisa conter a 'message' a ser printada na tela para cada objeto.
                O texto dessa mensagem terá por padrão sua cor vermelha, porém pode ser opcionalmente modificada para outras cores ('color').
            `);
            break;
        case 'custom-algorithm':
            title = `Algoritmo '${title}'`;
            if (messages.length === 0) {
                messages.push(`
                    Não há descrição para esse algoritmo.
                `);
            }
            break;
        case 'regular-graph':
            title = 'Grafo Regular';
            messages.push(`
                Descrição: Um grafo regular é um grafo onde cada vértice tem o mesmo número de arestas. Ou seja, todos os vértices possuem o mesmo grau.
                Você pode personalizar esse grafo informando o número de nós e o grau de cada nó. Por exemplo, um grafo regular de grau 2 é um ciclo.
            `);
            messages.push(`
                Ao criar um grafo regular, o grafo atualmente desenhado na tela será deletado.
            `);
            break;
        case 'complete-graph':
            title = 'Grafo Completo';
            messages.push(`
                Descrição: Um grafo completo é um grafo em que cada par de vértices está conectado por uma aresta. Em um grafo completo com n vértices,
                cada vértice possui grau n-1. Você pode personalizar esse grafo informando o número de nós. 
            `);
            messages.push(`
                Ao criar um grafo completo, o grafo atualmente desenhado na tela será deletado.
            `);
            break;
        case 'star-graph':
            title = 'Grafo Estrela';
            messages.push(`
                Descrição: Um grafo estrela é um tipo de grafo onde um único vértice central está conectado a todos os outros vértices, que não têm outras conexões entre si.
                Você pode personalizar esse grafo informando o número de nós. O vértice central terá grau n-1, onde n é o número total de nós.
            `);
            messages.push(`
                Ao criar um grafo estrela, o grafo atualmente desenhado na tela será deletado.
            `);
            break;
        case 'wheel-graph':
            title = 'Grafo Roda';
            messages.push(`
                Descrição: Um grafo roda é formado por um ciclo de n-1 nós e um nó central conectado a todos os nós do ciclo.
                Você pode personalizar esse grafo informando o número de nós. O nó central terá grau n-1 e cada nó no ciclo terá grau 3.
            `);
            messages.push(`
                Ao criar um grafo roda, o grafo atualmente desenhado na tela será deletado.
            `);
            break;
        case 'bipartite-graph':
            title = 'Grafo Bipartido';
            messages.push(`
                Descrição: Um grafo bipartido é um grafo cujos vértices podem ser divididos em dois conjuntos disjuntos, onde não há arestas entre vértices do mesmo conjunto.
                Você pode personalizar esse grafo informando o número de nós de cada conjunto.
            `);
            messages.push(`
                Ao criar um grafo bipartido, o grafo atualmente desenhado na tela será deletado.
            `);
            break;
        case 'complete-bipartite-graph':
            title = 'Grafo Completo Bipartido';
            messages.push(`
                Descrição: Um grafo completo bipartido é um tipo de grafo bipartido onde cada vértice de um conjunto está conectado a todos os vértices do outro conjunto.
                Você pode personalizar esse grafo informando o número de nós de cada conjunto.
            `);
            messages.push(`
                Ao criar um grafo completo bipartido, o grafo atualmente desenhado na tela será deletado.
            `);
            break;
        case 'binary-tree-graph':
            title = 'Grafo Árvore Binária';
            messages.push(`
                Descrição: Um grafo árvore binária é um grafo acíclico conexo em que cada nó possui no máximo 2 filhos.
                Em uma árvore binária, todos os nós, exceto a raiz, têm exatamente um nó pai. É muito utilizada
                para algoritmos de pesquisa de dados.
            `);
            messages.push(`
                Você pode personalizar esse grafo definindo o número total de nós e a altura da árvore.
                Lembre-se: a altura mínima é o piso de log2 de "n" e a altura máxima é "n", onde "n"
                é o número de nós.
            `);
            messages.push(`
                Ao criar um grafo árvore binária, o grafo atualmente desenhado na tela será deletado.
            `);
            break;
        case 'petersen-graph':
            title = 'Grafo Petersen';
            messages.push(`
                Descrição: O grafo de Petersen é um grafo bem específico: ele é simétrico e possui 10 vértices e 15 arestas,
                organizados de maneira que cada vértice está conectado a exatamente 3 outros vértices, formando uma "estrela"
                com um ciclo externo conectado a ela. É muito usado em problemas de combinatória e possui propriedades únicas.
                Como ele é um exemplo fixo, não permite personalização.
            `);
            messages.push(`
                Ao criar o grafo de Petersen, o grafo atualmente desenhado na tela será deletado.
            `);
            break;
    }

    const heading = document.createElement('h1');
    heading.textContent = title;
    heading.classList.add('modal-title');

    const content = document.createElement('div');
    content.classList.add('modal-section');
    content.dataset.fdColumn = 'true';
    for (const message of messages) {
        const paragraph = document.createElement('p');
        paragraph.textContent = message;
        content.appendChild(paragraph);
    }

    infoWindowContent.appendChild(heading);
    infoWindowContent.appendChild(content);
    infoWindowContent.appendChild(createCloseButton());
}

function createCloseButton() {
    const div = document.createElement('div');
    div.classList.add('modal-section');
    div.dataset.jcSpaceAround = 'true';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Fechar';
    closeButton.classList.add('modal-close');
    closeButton.addEventListener('click', closeInfoWindow);

    div.appendChild(closeButton);

    return div;
}

function clearInfoWindowContent() {
    infoWindowContent.replaceChildren();
}

function closeInfoWindow() {
    infoWindow.close();
}

export {
    openInfoWindow,
    closeInfoWindow,
}
