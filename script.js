fetch('contacts.json')
.then(response => response.json())
.then(data => {
    console.log(data);
    renderContacts(data);
})
.catch(error => console.error('Loading error: ', error));

function renderContacts(contacts){
const tableBody = document.querySelector('#contactTable tbody');
tableBody.innerHTML = "";

contacts.forEach(contact => {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${contact.name}</td>
    <td>${contact.email}</td>
    <td>${contact.phone}</td>
    `;
    tableBody.appendChild(row);
});
}
