const apiUrl = 'http://localhost:3000/todo';
const todoItems = {
  todo: [],
  doing: [],
  done: []
};

function checkItemStatus(title) {
    if (todoItems.todo.some(item => item.title === title)) {
      return 'to do';
    } else if (todoItems.doing.some(item => item.title === title)) {
      return 'doing';
    } else if (todoItems.done.some(item => item.title === title)) {
      return 'done';
    } else {
      return 'Not found';
    }
  }

async function fetchListItems(status) {
  const response = await fetch(`${apiUrl}?status=${status}`);
    return await response.json();
}

async function updateTodoItems() {
  todoItems.todo = await fetchListItems('to do');
  todoItems.doing = await fetchListItems('doing');
  todoItems.done = await fetchListItems('done');
}

async function createListItems() {
  await updateTodoItems();
  populateList('todo', todoItems.todo);
  populateList('doing', todoItems.doing);
  populateList('done', todoItems.done);
}

function createListItem(item) {
    const listItem = document.createElement('li');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const div3 = document.createElement('div');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');

    div1.classList.add('border-gradient');
    listItem.appendChild(div1);

    const buttonNext = document.createElement('button');
    buttonNext.classList.add('next');
    buttonNext.setAttribute('type', 'button');
    String(item.status) !== 'done' ? buttonNext.innerHTML = 'Next' : buttonNext.innerHTML = 'Delete';
    listItem.appendChild(buttonNext);

    h2.classList.add('taskTitle');
    h2.innerHTML = item.title;
    div2.appendChild(h2);
    listItem.appendChild(div2);

    p.classList.add('taskDescription');
    p.innerHTML = item.description;
    div3.appendChild(p);
    listItem.appendChild(div3);

    if(String(item.status) !== 'to do') {
        const buttonReturn = document.createElement('button');
        buttonReturn.classList.add('return');
        buttonReturn.setAttribute('type', 'button');
        buttonReturn.innerHTML = 'Return';
        listItem.appendChild(buttonReturn);
    }

    listItem.appendChild(div1);

    return listItem;
}

function populateList(section, listData) {
  const list = document.getElementById(`${section}List`);
  list.innerHTML = '';
  
  listData.forEach(item => {
    const listItem = createListItem(item);
    list.appendChild(listItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {

  createListItems();
  const modal = document.querySelector('dialog');
  
  document.getElementById('openModal').addEventListener('click', () => {
    modal.showModal();
  });
  function isTitleAlreadyExists(title) {
    const allTasks = [...todoItems.todo, ...todoItems.doing, ...todoItems.done];
    return allTasks.some(task => task.title === title);
  }

  document.getElementById('post').addEventListener('click', async event => {
      const title = document.getElementById('taskTitle').value;

      if (title !== '' && title !== null && !isTitleAlreadyExists(title)) {

          const description = document.getElementById('taskDescription').value;

          await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  title,
                  description,
                  status: ['to do']
              })
          });
        }
  });

});

document.addEventListener('click', async event => {
    const targetButton = event.target.closest('button');
    if (targetButton) {
        const listItem = targetButton.closest('li');
        const title = listItem.querySelector('.taskTitle').textContent;
        const description = listItem.querySelector('.taskDescription').textContent;
        const action = targetButton.classList.contains('next') ? 'next' : 'return';
        handleActionButtonClick(title, description, action);
    }
});

async function handleActionButtonClick(title, description, action) {
    const actualStatus = checkItemStatus(title);
    let newStatus = '';

    if (action === 'next') {
        newStatus = getNextStatus(actualStatus);
    } else if (action === 'return') {
        newStatus = getReturnStatus(actualStatus);
    }

    if (actualStatus === 'done' && action === 'next') {
        await deleteTask(title);
    } else {
        await updateTaskStatus(title, description, newStatus);
    }

    createListItems();
}

function getReturnStatus(currentStatus) {
    return currentStatus === 'done' ? 'doing' : 'to do';
}

function getNextStatus(currentStatus) {
    return currentStatus === 'to do' ? 'doing' : 'done';
}

async function updateTaskStatus(title, description, status) {
    await fetch(`${apiUrl}?title=${title}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "title": title,
            "description": description,
            "status": status
        })
    });
}

async function deleteTask(title) {
    await fetch(`${apiUrl}?title=${title}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

