function handleKey(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();
        if (!text) return;
        const li = document.createElement('li');
        li.textContent = text;
        li.onclick = () => li.classList.toggle('done');
        li.ondblclick = () => li.remove();
        document.getElementById('taskList').appendChild(li);
        input.value = '';
    }
}