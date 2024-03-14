document.addEventListener('DOMContentLoaded', function() {
    const itemList = document.getElementById('itemList');
    const historyList = document.getElementById('historyList');
    const itemForm = document.getElementById('itemForm');
    const itemNameInput = document.getElementById('itemName');
    const searchInput = document.getElementById('searchInput');
    const showHistoryButton = document.getElementById('showHistory');
    const closeHistoryButton = document.getElementById('closeHistory');
    const historyTitle = document.getElementById('historyTitle');

    let items = [];

    itemForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const itemName = itemNameInput.value.trim();
        if (itemName !== '') {
            addItem(itemName);
            items.push(itemName);
            itemNameInput.value = '';
            // Verifica se o botão "Visualizar Histórico" já foi adicionado à lista
            if (!itemList.contains(showHistoryButton)) {
                itemList.appendChild(showHistoryButton);
            }
        }
    });

    function addItem(name) {
        const li = document.createElement('li');
        li.classList.add('item');
        li.innerHTML = `
            <input type="checkbox">
            <input type="text" value="${name}" readonly>
            <button class="edit">Editar</button>
            <button class="delete">Excluir</button>
        `;
        itemList.appendChild(li);
        bindItemEvents(li);
    }

    function bindItemEvents(item) {
        const editButton = item.querySelector('.edit');
        const deleteButton = item.querySelector('.delete');
        const itemNameInput = item.querySelector('input[type="text"]');
        const checkbox = item.querySelector('input[type="checkbox"]');

        editButton.addEventListener('click', function() {
            const newName = prompt('Editar item:', itemNameInput.value);
            if (newName !== null && newName.trim() !== '') {
                itemNameInput.value = newName.trim();
            }
        });

        deleteButton.addEventListener('click', function() {
            item.remove();
        });

        checkbox.addEventListener('click', function() {
            if (checkbox.checked) {
                item.classList.add('checked');
            } else {
                item.classList.remove('checked');
            }
            setTimeout(updateListOrder, 0); 
        });
    }

    function updateListOrder() {
        const checkedItems = itemList.querySelectorAll('.checked');
        checkedItems.forEach(item => {
            itemList.appendChild(item);
        });
    }

    setInterval(updateListOrder, 1000);

    // Função para filtrar itens da lista de acordo com o texto de busca
    searchInput.addEventListener('input', function() {
        const searchText = searchInput.value.trim().toLowerCase();
        const filteredItems = items.filter(item => item.toLowerCase().includes(searchText));
        renderFilteredItems(filteredItems);
    });

    // Função para renderizar itens filtrados na lista
    function renderFilteredItems(filteredItems) {
        itemList.innerHTML = '';
        filteredItems.forEach(item => addItem(item));
    }

    // Função para renderizar o histórico completo
    function renderHistory() {
        historyList.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            historyList.appendChild(li);
        });
    }

    showHistoryButton.addEventListener('click', function() {
        historyTitle.style.display = 'block';
        historyList.style.display = 'block';
        closeHistoryButton.style.display = 'block';
        showHistoryButton.style.display = 'none';
        renderHistory();
    });

    closeHistoryButton.addEventListener('click', function() {
        historyTitle.style.display = 'none';
        historyList.style.display = 'none';
        closeHistoryButton.style.display = 'none';
        showHistoryButton.style.display = 'block';
    });
});
