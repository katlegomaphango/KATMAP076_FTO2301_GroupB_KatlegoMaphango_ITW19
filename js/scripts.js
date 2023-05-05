import { BOOKS_PER_PAGE, authors, genres, books, html } from "./data.js";

if (!books && !Array.isArray(books)) throw new Error('Source required') 

let isOpen = false
let matches = books
let page = 1;

// Event Handlers
const settingsHandler = (event) => {
    isOpen = !isOpen
    if(isOpen) {
        html.backdrop.style.display = 'block'
        html.theme.overlay.style.display = 'block'
    } else {
        html.backdrop.style.display = 'none'
        html.theme.overlay.style.display = ''
    }
}
const settingsFormHandler = (event) => {
    event.preventDefault()
    if (html.theme.settings_theme.value == 'day') {
        document.documentElement.style.setProperty('--color-dark', html.theme.day.dark)
        document.documentElement.style.setProperty('--color-light', html.theme.day.light)
    } else {
        document.documentElement.style.setProperty('--color-dark', html.theme.night.dark)
        document.documentElement.style.setProperty('--color-light', html.theme.night.light)
    }
    html.backdrop.style.display = 'none'
    html.theme.overlay.style.display = ''
}
const listShowHandler = () => {
    if(matches.length > 0){
        html.list.data_button.disabled = false
        html.list.data_message.classList.remove('list__message_show')
        html.list.data_items.innerHTML = ''
        html.list.data_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE ,page + 1))
        page += 1 
        html.list.data_button.innerHTML = /* html */ `
            <span>Show more</span>
            <span class="list__remaining"> (${matches.length - (BOOKS_PER_PAGE * page)})</span>
        `
    } else {
        html.list.data_items.innerHTML = ''
        html.list.data_message.classList.add('list__message_show')
        html.list.data_button.disabled = true
    }
}
const listItemsHandler = (event) => {
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

    html.summary.active.open = true
    html.summary.blur.src = bookObj.image
    html.summary.image.src = bookObj.image
    html.summary.title.innerText = bookObj.title
    html.summary.subtitle.innerText = `${authors[bookObj.author]} (${new Date(bookObj.published).getFullYear()})`
    html.summary.description.innerText = bookObj.description
}
const searchHandler = (event) => {
    isOpen = !isOpen
    if(isOpen) {
        html.backdrop.style.display = 'block'
        html.search.overlay.style.display = 'block'
    } else {
        html.backdrop.style.display = 'none'
        html.search.overlay.style.display = ''
    }
}
const searchSubmitHandler = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)

    const tempAuthorId = Object.keys(authors).find(key => authors[key] === filters.author)
    const tempGenreId = Object.keys(genres).find(key => genres[key] === filters.genre)

    if (filters.title == '' && filters.genre == 'any' && filters.author == 'any') { matches = matches }
    if (filters.title != '' && filters.genre == 'any' && filters.author == 'any') {
        matches = matches.filter( book => book.title.toLowerCase().includes(filters.title.toLowerCase()))
        html.list.data_items.innerHTML = ''
        html.list.data_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        html.list.data_message.classList.remove('list__message_show')
        html.list.data_button.disabled = false
    }
    if (filters.title == '' && filters.genre != 'any' && filters.author == 'any') {
        matches = matches.filter( book => book.genres.includes(tempGenreId) )
        html.list.data_items.innerHTML = ''
        html.list.data_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        html.list.data_message.classList.remove('list__message_show')
        html.list.data_button.disabled = false
    }
    if (filters.title == '' && filters.genre == 'any' && filters.author != 'any') {
        matches = matches.filter( book => book.author == tempAuthorId )
        html.list.data_items.innerHTML = ''
        html.list.data_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        html.list.data_message.classList.remove('list__message_show')
        html.list.data_button.disabled = false
    }
    if (filters.title != '' && filters.genre != 'any' && filters.author == 'any') {
        matches = matches.concat(
            matches.filter( book => book.title.toLowerCase() == filters.title.toLowerCase() ),
            matches.filter( book => book.genres.includes(tempGenreId) )
        )
        html.list.data_items.innerHTML = ''
        html.list.data_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        html.list.data_message.classList.remove('list__message_show')
        html.list.data_button.disabled = false
    }
    if (filters.title == '' && filters.genre != 'any' && filters.author != 'any') {
        matches = matches.concat(
            matches.filter( book => book.author == tempAuthorId ),
            matches.filter( book => book.genres.includes(tempGenreId) )
        )
        html.list.data_items.innerHTML = ''
        html.list.data_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        html.list.data_message.classList.remove('list__message_show')
        html.list.data_button.disabled = false
    }
    if (filters.title != '' && filters.genre == 'any' && filters.author != 'any') {
        matches = matches.concat(
            matches.filter( book => book.author == tempAuthorId ),
            matches.filter( book => book.title.toLowerCase() == filters.title.toLowerCase() )
        )
        html.list.data_items.innerHTML = ''
        html.list.data_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        html.list.data_message.classList.remove('list__message_show')
        html.list.data_button.disabled = false
    }
    if (filters.title != '' && filters.genre != 'any' && filters.author != 'any') {
        matches = matches.concat(
            matches.filter( book => book.title.toLowerCase() == filters.title.toLowerCase() ),
            matches.filter( book => book.genres.includes(tempGenreId) ),
            matches.filter( book => book.author == tempAuthorId )
        )
        html.list.data_items.innerHTML = ''
        html.list.data_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, 1))
        html.list.data_message.remove('list__message_show')
        html.list.data_button.disabled = false
    }

    if (matches.length == 0) {
        html.list.data_items.innerHTML = ''
        html.list.data_message.classList.add('list__message_show')
        html.list.data_button.disabled = true
    }

    html.backdrop.style.display = 'none'
    html.search.overlay.style.display = ''
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
html.list.data_items.appendChild(createPreviewsFragment(matches, BOOKS_PER_PAGE, page))

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

populateDropDown(html.search.authors, 'Authors', authors)
populateDropDown(html.search.genres, 'Genres', genres)

html.list.data_button.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0)
html.list.data_button.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>
`

// Event listeners
html.search.search.addEventListener('click', searchHandler)
html.search.cancel.addEventListener('click', searchHandler)
html.search.form.addEventListener('submit', searchSubmitHandler)

html.list.data_button.addEventListener('click',listShowHandler)
html.list.data_items.addEventListener('click', listItemsHandler)
html.summary.close.addEventListener('click', () => html.summary.active.open = false )

html.theme.settings_form.addEventListener('submit', settingsFormHandler)
html.theme.settings_header.addEventListener('click', settingsHandler)
html.theme.settings_cancel.addEventListener('click', settingsHandler)