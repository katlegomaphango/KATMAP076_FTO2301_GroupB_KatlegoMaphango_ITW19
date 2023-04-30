import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

if (!books && !Array.isArray(books)) throw new Error('Source required') 

// Theme Day/Night
const data_settings_theme = document.querySelector('[data-settings-theme]')
const data_header_settingsBtn = document.querySelector('[data-header-settings]')
const data_settings_cancelBtn = document.querySelector('[data-settings-cancel]')
const data_settings_form = document.querySelector('[data-settings-form]')

// Book List
const data_list_items = document.querySelector('[data-list-items]')
const data_list_button = document.querySelector('[data-list-button]')
const data_list_message = document.querySelector('[data-list-message]')

// book summary
const data_list_active = document.querySelector('[data-list-active]')
const data_list_blur = document.querySelector('[data-list-blur]')
const data_list_image = document.querySelector('[data-list-image]')
const data_list_title = document.querySelector('[data-list-title]')
const data_list_subtitle = document.querySelector('[data-list-subtitle]')
const data_list_description = document.querySelector('[data-list-description]')
const data_list_closeBtn = document.querySelector('[data-list-close]')

// search 
const data_header_searchBtn = document.querySelector('[data-header-search]')
const data_search_cancelBtn = document.querySelector('[data-search-cancel]')
const data_search_genres = document.querySelector('[data-search-genres]')
const data_search_authors =document.querySelector('[data-search-authors]')
const data_search_form = document.querySelector('[data-search-form]')

let isOpen = false
let matches = books
let page = 1;

const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
}
const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
}

// Event Handlers
const data_settingsHandler = (event) => {
    isOpen = !isOpen
    if(isOpen) {
        document.querySelector('.backdrop').style.display = 'block'
        document.querySelector('[data-settings-overlay]').style.display = 'block'
    } else {
        document.querySelector('.backdrop').style.display = 'none'
        document.querySelector('[data-settings-overlay]').style.display = ''
    }
}
const data_settingsFormHandler = (event) => {
    event.preventDefault()
    if (data_settings_theme.value == 'day') {
        document.documentElement.style.setProperty('--color-dark', day.dark)
        document.documentElement.style.setProperty('--color-light', day.light)
    } else {
        document.documentElement.style.setProperty('--color-dark', night.dark)
        document.documentElement.style.setProperty('--color-light', night.light)
    }
    document.querySelector('.backdrop').style.display = 'none'
    document.querySelector('[data-settings-overlay]').style.display = ''
}
const data_list_showHandler = () => {
    if(matches.length > 0){
        data_list_button.disabled = false
        data_list_message.classList.remove('list__message_show')
        data_list_items.innerHTML = ''
        data_list_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE ,page + 1))
        page += 1 
        data_list_button.innerHTML = /* html */ `
            <span>Show more</span>
            <span class="list__remaining"> (${matches.length - (BOOKS_PER_PAGE * page)})</span>
        `
    } else {
        data_list_items.innerHTML = ''
        data_list_message.classList.add('list__message_show')
        data_list_button.disabled = true
    }
}
const data_list_itemsHandler = (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let bookId
    let bookObj

    for(let i = 0; i < pathArray.length; i++) {
        if(pathArray[i].dataset.id) {
            bookId = pathArray[i].dataset.id
            break
        }
    }

    for(let i = 0; i < matches.length; i++){
        if(matches[i].id === bookId) {
            bookObj = matches[i]
            break
        }
    }

    data_list_active.open = true
    data_list_blur.src = bookObj.image
    data_list_image.src = bookObj.image
    data_list_title.innerText = bookObj.title
    data_list_subtitle.innerText = `${authors[bookObj.author]} (${new Date(bookObj.published).getFullYear()})`
    data_list_description.innerText = bookObj.description
}
const data_searchHandler = (event) => {
    isOpen = !isOpen
    if(isOpen) {
        document.querySelector('.backdrop').style.display = 'block'
        document.querySelector('[data-search-overlay]').style.display = 'block'
    } else {
        document.querySelector('.backdrop').style.display = 'none'
        document.querySelector('[data-search-overlay]').style.display = ''
    }
}
const data_searchSubmitHandler = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)

    const tempAuthorId = Object.keys(authors).find(key => authors[key] === filters.author)
    const tempGenreId = Object.keys(genres).find(key => genres[key] === filters.genre)

    if (filters.title == '' && filters.genre == 'any' && filters.author == 'any') { matches = matches }
    if (filters.title != '' && filters.genre == 'any' && filters.author == 'any') {
        matches = matches.filter( book => book.title.toLowerCase().includes(filters.title.toLowerCase()))
        data_list_items.innerHTML = ''
        data_list_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        data_list_message.classList.remove('list__message_show')
        data_list_button.disabled = false
    }
    if (filters.title == '' && filters.genre != 'any' && filters.author == 'any') {
        matches = matches.filter( book => book.genres.includes(tempGenreId) )
        data_list_items.innerHTML = ''
        data_list_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        data_list_message.classList.remove('list__message_show')
        data_list_button.disabled = false
    }
    if (filters.title == '' && filters.genre == 'any' && filters.author != 'any') {
        matches = matches.filter( book => book.author == tempAuthorId )
        data_list_items.innerHTML = ''
        data_list_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        data_list_message.classList.remove('list__message_show')
        data_list_button.disabled = false
    }
    if (filters.title != '' && filters.genre != 'any' && filters.author == 'any') {
        matches = result.concat(
            matches.filter( book => book.title.toLowerCase() == filters.title.toLowerCase() ),
            matches.filter( book => book.genres.includes(tempGenreId) )
        )
        data_list_items.innerHTML = ''
        data_list_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        data_list_message.classList.remove('list__message_show')
        data_list_button.disabled = false
    }
    if (filters.title == '' && filters.genre != 'any' && filters.author != 'any') {
        matches = result.concat(
            matches.filter( book => book.author == tempAuthorId ),
            matches.filter( book => book.genres.includes(tempGenreId) )
        )
        data_list_items.innerHTML = ''
        data_list_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        data_list_message.classList.remove('list__message_show')
        data_list_button.disabled = false
    }
    if (filters.title != '' && filters.genre == 'any' && filters.author != 'any') {
        matches = result.concat(
            matches.filter( book => book.author == tempAuthorId ),
            matches.filter( book => book.title.toLowerCase() == filters.title.toLowerCase() )
        )
        data_list_items.innerHTML = ''
        data_list_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        data_list_message.classList.remove('list__message_show')
        data_list_button.disabled = false
    }
    if (filters.title != '' && filters.genre != 'any' && filters.author != 'any') {
        matches = result.concat(
            matches.filter( book => book.title.toLowerCase() == filters.title.toLowerCase() ),
            matches.filter( book => book.genres.includes(tempGenreId) ),
            matches.filter( book => book.author == tempAuthorId )
        )
        data_list_items.innerHTML = ''
        data_list_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        data_list_message.classList.remove('list__message_show')
        data_list_button.disabled = false
    }

    if (matches.length == 0) {
        data_list_items.innerHTML = ''
        data_list_message.classList.add('list__message_show')
        data_list_button.disabled = true
    }

    document.querySelector('.backdrop').style.display = 'none'
    document.querySelector('[data-search-overlay]').style.display = ''
}


const createPreview = (bookObj) => {
    const { author, image, title, id } = bookObj

    const previewElement = document.createElement('div')
    previewElement.className = 'preview'
    previewElement.dataset.id = id

    previewElement.innerHTML = /* Html*/ `
        <div>
            <img class="preview__image" src="${image}" alt="book image">
        </div>
        <div class="preview__info">
            <div class="preview__title">${title}</div>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `
    return previewElement
}
const createPreviewsFragment = (booksArray, booksPerPage, Page) => {
    const fragment = document.createDocumentFragment()
    const extracted = booksArray.slice(0, booksPerPage*Page)

    for (let i = 0; i < extracted.length; i++) {
        const { author, image, title, id } = extracted[i]

        const preview = createPreview( { author, id, image, title } )

        fragment.appendChild(preview)
    }

    return fragment
}
data_list_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, page))

const populateDropDown = (DropDownElement, DDType, dataObject) => {
    const fragment = document.createDocumentFragment()
    const fragmentElement = document.createElement('option')
    fragmentElement.dataset.id = ''
    fragmentElement.value = 'any'
    fragmentElement.innerText = `All ${DDType}`
    fragment.appendChild(fragmentElement)

    for(let i = 0; i < Object.entries(dataObject).length; i++) {
        const [id, name] = Object.entries(dataObject)[i]
        const element = document.createElement('option')
        element.dataset.id = id
        element.value = name
        element.innerText = name
        fragment.appendChild(element)
    }

    DropDownElement.appendChild(fragment)
}

populateDropDown(data_search_authors, 'Authors', authors)
populateDropDown(data_search_genres, 'Genres', genres)

data_list_button.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0)
data_list_button.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>
`

// Event listeners
data_header_searchBtn.addEventListener('click', data_searchHandler)
data_search_cancelBtn.addEventListener('click', data_searchHandler)
data_search_form.addEventListener('submit', data_searchSubmitHandler)

data_list_button.addEventListener('click',data_list_showHandler)
data_list_items.addEventListener('click', data_list_itemsHandler)
data_list_closeBtn.addEventListener('click', () => data_list_active.open = false )

data_settings_form.addEventListener('submit', data_settingsFormHandler)
data_header_settingsBtn.addEventListener('click', data_settingsHandler)
data_settings_cancelBtn.addEventListener('click', data_settingsHandler)