let contacts = [];

const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));

const savedContacts = localStorage.getItem('contacts');
if (savedContacts) {
    contacts = JSON.parse(savedContacts);
    renderContacts();
} else {
    fetch('contacts.json')
        .then(response => response.json())
        .then(data => {
            contacts = data;
            renderContacts();
            localStorage.setItem('contacts', JSON.stringify(contacts));
        })
        .catch(error => console.error('Loading error: ', error));
}

function renderContacts() {
    const $tableBody = $('#contactTable tbody');
    $tableBody.empty();

    contacts.forEach((contact, index) => {
        const $row = $(`
            <tr>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td>
                    <i class="ri-edit-line edit-icon" data-index="${index}" style="cursor:pointer;"></i>
                </td>
                <td>
                    <i class="ri-subtract-line delete-icon" data-index="${index}" style="cursor:pointer; color:red;"></i>
                </td>
            </tr>
        `);
        $tableBody.append($row);
    });

    $('.edit-icon').on('click', function () {
        const index = $(this).data('index');
        const contact = contacts[index];

        $('#nameInput').val(contact.name);
        $('#emailInput').val(contact.email);
        $('#phoneInput').val(contact.phone);
        $('#contactIndex').val(index);

        contactModal.show();
    });

    $('.delete-icon').on('click', function () {
        const index = $(this).data('index');
        contacts.splice(index, 1);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        renderContacts();
    });
}

$('#addContactBtn').on('click', function () {
    $('#contactForm')[0].reset();
    $('#contactIndex').val('');
    contactModal.show();
});

$('#contactForm').on('submit', function (e) {
    e.preventDefault();

    const name = $('#nameInput').val();
    const email = $('#emailInput').val();
    const phone = $('#phoneInput').val();
    const index = $('#contactIndex').val();

    const newContact = { name, email, phone };

    if (index === '') {
        contacts.push(newContact);
    } else {
        contacts[index] = newContact;
    }

    localStorage.setItem('contacts', JSON.stringify(contacts));
    renderContacts();
    contactModal.hide();
});
