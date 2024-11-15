//Initial variable creation and element selection
let randomUsers = [];
let filteredUsers = {results: []};
const randomUserURL = "https://randomuser.me/api/?results=12&nat=us";
const body = document.querySelector('body');
const gallery = document.getElementById('gallery');
const searchContainer = document.querySelector('.search-container');

//Calls api and returns 12 random users. Then creates user gallery from this data.
async function getRandomUsers() {
    const response = await fetch(randomUserURL);
    const data = await response.json();
    randomUsers = data;
    filteredUsers.results = data.results.map(obj => ({ ...obj }));
    createSearch();
    createRandomUserGallery(data);
}

//function for search box creation
function createSearch() {
    const searchHTML = `<form action="#" method="get">
                            <input type="search" id="search-input" class="search-input" placeholder="Search...">
                            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                        </form>`;
    searchContainer.insertAdjacentHTML('beforeend', searchHTML);
    const searchBox = document.querySelector('form');
    const searchInput = document.getElementById('search-input');
    
    //Search function for searching gallery by user name(first/last)
    function searchUserName(searchValue) {
        const isUserMatch = (user) => user.name.first.toLowerCase().includes(searchValue) || user.name.last.toLowerCase().includes(searchValue);
        
        filteredUsers.results = randomUsers.results.filter(isUserMatch);
    }
    
    //Function for adding both types of event listeners for search functionality
    function addSearchListener(element, event) {
        element.addEventListener(event, e => {
            e.preventDefault();
            const searchValue = searchInput.value.toLowerCase();
            searchUserName(searchValue);
            createRandomUserGallery(filteredUsers);
        });
    }

    addSearchListener(searchBox, 'submit');
    addSearchListener(searchInput, 'keyup');
}

//Function for creating user gallery from api results
function createRandomUserGallery(data) {
    gallery.innerHTML = '';
    let galleryHTML = '';
    data.results.map( user => {
        const img = user.picture.thumbnail;
        const firstName = user.name.first;
        const lastName = user.name.last;
        const email = user.email;
        const city = user.location.city;
        const state = user.location.state;
        galleryHTML += `<div class="card">
                    <div class="card-img-container">
                        <img class="card-img" src="${img}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
                        <p class="card-text">${email}</p>
                        <p class="card-text cap">${city}, ${state}</p>
                    </div>
                </div>`;
    });
    gallery.insertAdjacentHTML('beforeend', galleryHTML);
}

//Event listener that opens the modal when a gallery card is clicked
gallery.addEventListener('click', e => {
    const userCard = e.target.closest('.card');
    if (!userCard) return;

    const userName = userCard.querySelector('#name').textContent.split(' ');
    const isUserMatch = (user) => user.name.first === userName[0] && user.name.last === userName[1];
    const user = randomUsers.results.find(isUserMatch);
    createUserModal(user);
});

//Function to create user modal after user card is clicked
function createUserModal(data) {
    let modalHTML = '';
    const firstName = data.name.first;
    const lastName = data.name.last;
    const img = data.picture.thumbnail;
    const email = data.email;
    const phone = data.phone;
    const streetNumber = data.location.street.number;
    const streetName = data.location.street.name;
    const city = data.location.city;
    const state = data.location.state;
    const zip = data.location.postcode;
    const dateOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    const dob = new Date(data.dob.date).toLocaleDateString("en-US", dateOptions);
    modalHTML += `<div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${img}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${firstName} ${lastName}</h3>
                        <p class="modal-text">${email}</p>
                        <p class="modal-text cap">${city}</p>
                        <hr>
                        <p class="modal-text">${phone}</p>
                        <p class="modal-text">${streetNumber} ${streetName}, ${city}, ${state} ${zip}</p>
                        <p class="modal-text">Birthday: ${dob}</p>
                    </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>`;
    gallery.insertAdjacentHTML('beforeend', modalHTML);

    //Selecting all modal elements after creation and creating other constant variables
    const modalContainer = document.querySelector('.modal-container');
    const closeBtn = document.getElementById('modal-close-btn');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    const topIndex = filteredUsers.results.length - 1;
    const isUserMatch = (user) => user.name.first === firstName && user.name.last === lastName;

    //Used to either get the initial user index of the opened modal or update and return the new index after toggling through the modal
    function getUpdateUserIndex(type, element) {
        let UserIndex = filteredUsers.results.findIndex(isUserMatch);
        if(type === 'get') {
            return UserIndex;
        } else {
            element.id === 'modal-next' ? UserIndex++ : UserIndex --;
            return UserIndex
        }
    }

    //Uses the getUpdateUserIndex return value to show or hide the prev or next button based on whether the index is currently the first or last.
    function showHideToggleBtns() {
        let modalUserIndex = getUpdateUserIndex('get');
        let isFirst = modalUserIndex === 0;
        let isLast = modalUserIndex === topIndex;
        isFirst ? prevBtn.style.display = 'none' :  prevBtn.style.display = '';
        isLast ? nextBtn.style.display = 'none' :  nextBtn.style.display = '';
    }
    
    //Recreates modal content with new user index
    function addToggleBtnListner(element) {
        element.addEventListener('click', e => {
            modalContainer.remove();
            const newIndex = getUpdateUserIndex('update', e.target);
            const modalUser = filteredUsers.results[newIndex];
            createUserModal(modalUser);
            showHideToggleBtns();
        });
    }

    //close modal with button
    closeBtn.addEventListener('click', e => {
        modalContainer.remove();
    });

    //Initial determination of whether to show toggle buttons and add event listeners
    showHideToggleBtns();
    addToggleBtnListner(prevBtn);
    addToggleBtnListner(nextBtn);
}

//Event listener to allow for closing modal when a click occurs outside of the modal
body.addEventListener('click', e => {
    const modalContainer = document.querySelector('.modal-container');
    const isOutsideContainer = !e.target.closest('.modal');
    const isOutsideBtnContainer = !e.target.closest('.modal-btn-container');
    const userCard = e.target.closest('.card');
    const removeModal = isOutsideContainer && isOutsideBtnContainer && !userCard && modalContainer;
    removeModal && modalContainer.remove();
});

//Initial call to get 12 gallery users and create gallery 
getRandomUsers();