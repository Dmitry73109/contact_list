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
        $('#contactIndex').val(index);//all info need to restore info for editing

        contactModal.show();
    });

    $('.delete-icon').on('click', function () {//will delete that data where was pressed
        const index = $(this).data('index');
        contacts.splice(index, 1);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        renderContacts();
    });
}

$('#addContactBtn').on('click', function () {//this one just clear table
    $('#contactForm')[0].reset();
    $('#contactIndex').val('');
    contactModal.show();
});

$('#contactForm').on('submit', function (e) {
    e.preventDefault();
//GET VALUES
    const name = $('#nameInput').val();
    const email = $('#emailInput').val();
    const phone = $('#phoneInput').val();
    const index = $('#contactIndex').val();
//NAME TEST##########################################################
    const nameRegex = /[0-9!@#$%^&*()_+{}\[\]:;"'<>,.?\\\/|=`~]/;//allow only letters

    if(nameRegex.test(name)){
        alert("Wrong name, only letters allowed");
        return;
    }else if(!(name.length<15)){
        alert("Wrong length, 15 letters only allowed");
        return;
    }
//EMAIL TEST##########################################################
    const emailRegex = /[!@#$%^&*()_+{}\[\]:;"'<>,.?\\\/|-]/;//test like: text@text.text

    if(!emailRegex.test(email)){
        alert("Wrong email, only -> test@test.test");
        return;
    }else if(!(email.length>8 && email.length<25)){
        alert("Wrong length, 9-24 only allowed");
        return;
    }
//PHONE TEST##########################################################
    const phoneRegex = /^\+?[0-9]{7,14}$/;//allow 1 plus at 1rst possition and numbers after

    if(!phoneRegex.test(phone)){
        alert("Wrong phone number, only -> +1234567890");
        return;
    }else if(!(phone.length>8 && phone.length<14)){
        alert("Wrong length, only 9-13 allowed");
        return;
    }
//ADD OR EDIT##########################################################
    const newContact = { name, email, phone };

    if (index === '') {//IF EMPTY -> CREATE NEW
        contacts.push(newContact);//NO INDEX, FORM WILL BE EMPTY
    } else {//IF NOT -> EDIT OLD
        contacts[index] = newContact;//INDEX HELPS TO RESTORE INFO TO EDIT IT
    }

    localStorage.setItem('contacts', JSON.stringify(contacts));//SAVE ALL INFO LIKE STRING
    renderContacts();//CLEAR TABLE AND CREATE NEW ONE
    contactModal.hide();//HIDE MENU
});