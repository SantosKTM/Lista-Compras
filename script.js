document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const itemList = document.getElementById('itemList');
    const historyList = document.getElementById('historyList');
    const itemForm = document.getElementById('itemForm');
    const itemNameInput = document.getElementById('itemName');
    const searchInput = document.getElementById('searchInput');
    const showHistoryButton = document.getElementById('showHistory');
    const closeHistoryButton = document.getElementById('closeHistory');
    const historyTitle = document.getElementById('historyTitle');
    const standardItems = document.querySelectorAll('.standard-items .card');

    // Lista de itens e contador de IDs
    let items = [];
    let itemIdCounter = 0; 

    // Função para adicionar um item à lista
    function addItem(name, source) {
        const li = document.createElement('li');
        li.classList.add('item');
        li.setAttribute('data-source', source); 
        li.setAttribute('data-id', itemIdCounter); 
        li.innerHTML = `
            <input type="checkbox">
            <input type="text" value="${name}" readonly>
            <div class="quantity-controls">
                <button class="btn btn-sm btn-primary plus">+</button>
                <span class="quantity">1</span>
                <button class="btn btn-sm btn-danger minus">-</button>
            </div>
            <button class="edit">Editar</button>
            <button class="delete">Excluir</button>
        `;
        itemList.appendChild(li);
        bindItemEvents(li);
    }

    // Função para vincular eventos aos elementos de um item
    function bindItemEvents(item) {
        const editButton = item.querySelector('.edit');
        const deleteButton = item.querySelector('.delete');
        const itemNameInput = item.querySelector('input[type="text"]');
        const quantitySpan = item.querySelector('.quantity');
        const plusButton = item.querySelector('.plus');
        const minusButton = item.querySelector('.minus');
        const checkbox = item.querySelector('input[type="checkbox"]');
        const quantityControls = item.querySelector('.quantity-controls');

        // Evento de clique no botão de edição
        editButton.addEventListener('click', function() {
            const newName = prompt('Editar item:', itemNameInput.value);
            if (newName !== null && newName.trim() !== '') {
                itemNameInput.value = newName.trim();
            }
        });

        // Evento de clique no botão de exclusão
        deleteButton.addEventListener('click', function() {
            item.remove();
        });

        // Evento de clique no botão de adição
        plusButton.addEventListener('click', function() {
            let quantity = parseInt(quantitySpan.textContent);
            quantity++;
            quantitySpan.textContent = quantity;
        });

        // Evento de clique no botão de subtração
        minusButton.addEventListener('click', function() {
            let quantity = parseInt(quantitySpan.textContent);
            if (quantity > 1) {
                quantity--;
                quantitySpan.textContent = quantity;
            }
        });

        // Evento de clique no checkbox
        checkbox.addEventListener('click', function() {
            if (checkbox.checked) {
                item.classList.add('checked');
            } else {
                item.classList.remove('checked');
            }
            setTimeout(updateListOrder, 0); 
        });

        quantityControls.style.display = 'inline-block';
    }

    // Função para atualizar a ordem da lista
    function updateListOrder() {
        const checkedItems = itemList.querySelectorAll('.checked');
        checkedItems.forEach(item => {
            itemList.appendChild(item);
        });
    }

    // Função para filtrar e renderizar os itens na lista
    function renderFilteredItems(filteredItems) {
        itemList.innerHTML = '';
        filteredItems.forEach(item => addItem(item.name, item.source));
    }

    // Função para renderizar o histórico completo de compras
    function renderHistory() {
        historyList.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;
            historyList.appendChild(li);
        });
    }

    // Evento de envio do formulário para adicionar um novo item
    itemForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const itemName = itemNameInput.value.trim();
        if (itemName !== '') {
            addItem(itemName, 'form');
            items.push({ id: itemIdCounter++, name: itemName, quantity: 1 });
            itemNameInput.value = '';
            if (!itemList.contains(showHistoryButton)) {
                itemList.appendChild(showHistoryButton);
            }
        }
    });

    // Evento de entrada de texto na busca rápida
    searchInput.addEventListener('input', function() {
        const searchText = searchInput.value.trim().toLowerCase();
        const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchText));
        renderFilteredItems(filteredItems);
    });

    // Evento de clique no botão "Mostrar Histórico"
    showHistoryButton.addEventListener('click', function() {
        historyTitle.style.display = 'block';
        historyList.style.display = 'block';
        closeHistoryButton.style.display = 'block';
        showHistoryButton.style.display = 'none';
        renderHistory();
    });

    // Evento de clique no botão "Fechar Histórico"
    closeHistoryButton.addEventListener('click', function() {
        historyTitle.style.display = 'none';
        historyList.style.display = 'none';
        closeHistoryButton.style.display = 'none';
        showHistoryButton.style.display = 'block';
    });

    // Evento de clique nos itens padrão para adicionar à lista
    standardItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemName = item.querySelector('.card-title').textContent;
            const existingItem = items.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity++;
                const existingListItem = itemList.querySelector(`.item[data-id="${existingItem.id}"]`);
                const quantitySpan = existingListItem.querySelector('.quantity');
                quantitySpan.textContent = existingItem.quantity;
            } else {
                addItem(itemName, 'standard');
                items.push({ id: itemIdCounter++, name: itemName, quantity: 1 });
            }
        });
    });
});
