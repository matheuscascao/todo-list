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
  const data = await response.json();
  return data;
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
  
  if (item.status != 'done') {
    const button = document.createElement('button');
    button.classList.add('next');
    button.setAttribute('type', 'button');
    button.innerHTML = 'Next';
    listItem.appendChild(button);
  }
  if (item.status == 'done') {
    const button = document.createElement('button');
    button.classList.add('next');
    button.setAttribute('type', 'button');
    button.innerHTML = 'Delete';
    listItem.appendChild(button);
    console.log("item: " + item.title)
}
  h2.classList.add('taskTitle');
  h2.innerHTML = item.title;
  div2.appendChild(h2);
  listItem.appendChild(div2);
  
  p.classList.add('taskDescription');
  p.innerHTML = item.description;
  div3.appendChild(p);
  listItem.appendChild(div3);
  
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

  document.getElementById('post').addEventListener('click', async event => {
    const title = document.getElementById('taskTitle').value;
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
  });

});

document.addEventListener('click', async event => { 
    const listItem = event.target.closest('li');
    const title = listItem.querySelector('.taskTitle').textContent;
    const description = listItem.querySelector('.taskDescription').textContent;
    
    let actualStatus = checkItemStatus(title);
    let nextStatus = ""
    if (actualStatus === 'to do') {
        nextStatus = 'doing';
    } else if (actualStatus === 'doing') {
        nextStatus = 'done';
    }
    console.log("actualStatus: " + actualStatus)
    console.log("nextStatus: " + nextStatus)

    if(actualStatus != 'done') {
        await fetch(`${apiUrl}?title=${title}`, {
            method: 'PATCH',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "title": title,
                "description": description,
                "status": nextStatus
            })
          });
    } else {
        await fetch(`${apiUrl}?title=${title}`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
    }
      createListItems();
});