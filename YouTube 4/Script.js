const multiSelect = document.getElementById('multiSelect');
const dropdown = document.getElementById('dropdown');
const selectedItems = document.getElementById('selectedItems');
const selectedValues = new Set();
multiSelect.addEventListener('click', () => {
    multiSelect.classList.toggle('active');
});
dropdown.addEventListener('click', (e) => {
    const value = e.target.getAttribute('data-value');
    const label = e.target.textContent;
    if (!selectedValues.has(value)) {
        selectedValues.add(value);
        const tag = document.createElement('span');
        tag.innerHTML = `${label} <i data-remove="${value}">&times;</i>`;
        selectedItems.appendChild(tag);
    }
});
selectedItems.addEventListener('click', (e) => {
    if (e.target.dataset.remove) {
        const valueToRemove = e.target.dataset.remove;
        selectedValues.delete(valueToRemove);
        e.target.parentElement.remove();
    }
});
document.addEventListener('click', (e) => {
    if (!multiSelect.contains(e.target)) {
        multiSelect.classList.remove('active');
    }
});