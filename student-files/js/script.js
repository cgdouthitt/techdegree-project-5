let randomUsers = [];
let filteredUsers = {results: []};
const randomUserURL = "https://randomuser.me/api/?results=12&nat=us";
const body = document.querySelector('body');
const gallery = document.getElementById('gallery');
const searchContainer = document.querySelector('.search-container');

async function getRandomUsers() {
    const response = await fetch(randomUserURL);
    const data = await response.json();
    randomUsers = data;
    filteredUsers.results = data.results.map(obj => ({ ...obj }));
    createRandomUserGallery(data);
}

function createRandomUserGallery(data) {
    gallery.innerHTML = '';
    let galleryHTML = '';
    data.results.map( user => {
        galleryHTML += `<div class="card">
                    <div class="card-img-container">
                        <img class="card-img" src="${user.picture.thumbnail}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                        <p class="card-text">${user.email}</p>
                        <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                    </div>
                </div>`
    });
    gallery.insertAdjacentHTML('beforeend', galleryHTML);
}

gallery.addEventListener('click', e => {
    const userCard = e.target.closest('.card');
    if (!userCard) return;

    const userName = userCard.querySelector('#name').textContent.split(' ');
    const user = randomUsers.results.find(
        (user) => user.name.first === userName[0] && user.name.last === userName[1]
    );
    createUserModal(user);
});

function createUserModal(data) {
    let modalHTML = '';
    const dateOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    const dob = new Date(data.dob.date).toLocaleDateString("en-US", dateOptions);
    const firstName = data.name.first;
    const lastName = data.name.last;
    modalHTML += `<div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${data.picture.thumbnail}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${firstName} ${lastName}</h3>
                        <p class="modal-text">${data.email}</p>
                        <p class="modal-text cap">${data.location.city}</p>
                        <hr>
                        <p class="modal-text">${data.phone}</p>
                        <p class="modal-text">${data.location.street.number} ${data.location.street.name}, ${data.location.city}, ${data.location.state} ${data.location.postcode}</p>
                        <p class="modal-text">Birthday: ${dob}</p>
                    </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>`;
    gallery.insertAdjacentHTML('beforeend', modalHTML);

    const modalContainer = document.querySelector('.modal-container');
    const closeBtn = document.getElementById('modal-close-btn');
    closeBtn.addEventListener('click', e => {
        modalContainer.remove();
    });

    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    let modalUserIndex = filteredUsers.results.findIndex(
        (user) => user.name.first === firstName && user.name.last === lastName
    );
    let topIndex = filteredUsers.results.length - 1;
    if(modalUserIndex === 0) {
        prevBtn.style.display = 'none';
    }
    if(modalUserIndex === topIndex) {
        nextBtn.style.display = 'none';
    }
    prevBtn.addEventListener('click', e => {
        modalContainer.remove();
        modalUserIndex--;
        createUserModal(filteredUsers.results[modalUserIndex]);
        if(modalUserIndex === 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = '';
        }
        if(modalUserIndex === topIndex) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = '';
        }
    });
    nextBtn.addEventListener('click', e => {
        modalContainer.remove();
        modalUserIndex++;
        createUserModal(filteredUsers.results[modalUserIndex]);
        if(modalUserIndex === 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = '';
        }
        if(modalUserIndex === topIndex) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = '';
        }
    });
}

body.addEventListener('click', e => {
    const modalContainer = document.querySelector('.modal-container');
    const isOutsideContainer = !e.target.closest('.modal');
    const isOutsideBtnContainer = !e.target.closest('.modal-btn-container');
    const userCard = e.target.closest('.card');
    if(isOutsideContainer && isOutsideBtnContainer && !userCard && modalContainer) {
        modalContainer.remove();
    }
});

const searchHTML = `<form action="#" method="get">
                        <input type="search" id="search-input" class="search-input" placeholder="Search...">
                        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                    </form>`;
searchContainer.insertAdjacentHTML('beforeend', searchHTML);
const searchBox = document.querySelector('form');
const searchInput = document.getElementById('search-input');
searchBox.addEventListener('submit', e => {
    const searchValue = searchInput.value.toLowerCase();
    filteredUsers.results = randomUsers.results.filter(
        (user) => user.name.first.toLowerCase().includes(searchValue) || user.name.last.toLowerCase().includes(searchValue)
    );
    createRandomUserGallery(filteredUsers);
});
searchInput.addEventListener('keyup', e => {
    const searchValue = searchInput.value.toLowerCase();
    filteredUsers.results = randomUsers.results.filter(
        (user) => user.name.first.toLowerCase().includes(searchValue) || user.name.last.toLowerCase().includes(searchValue)
    );
    createRandomUserGallery(filteredUsers);
});

getRandomUsers();