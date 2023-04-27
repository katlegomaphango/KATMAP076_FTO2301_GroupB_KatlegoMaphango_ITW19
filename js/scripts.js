import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

if (!books && !Array.isArray(books)) throw new Error('Source required') 
console.log('hey first line')

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

let isOpen = false
let matches = books
let page = 1;

// if (!books && !Array.isArray(books)) throw new Error('Source required') 
// if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
}
const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
}


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

data_list_button.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
data_list_button.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0)
data_list_button.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>
`

data_header_searchBtn.addEventListener('click', data_searchHandler)
data_search_cancelBtn.addEventListener('click', data_searchHandler)

data_list_button.addEventListener('click',data_list_showHandler)
data_list_items.addEventListener('click', data_list_itemsHandler)
data_list_closeBtn.addEventListener('click', () => data_list_active.open = false )

data_settings_form.addEventListener('submit', data_settingsFormHandler)
data_header_settingsBtn.addEventListener('click', data_settingsHandler)
data_settings_cancelBtn.addEventListener('click', data_settingsHandler)






















// fragment = document.createDocumentFragment()
// const extracted = books.slice(0, 36)

// for ({ author, image, title, id }; extracted; i++) {
//     const preview = createPreview({
//         author,
//         id,
//         image,
//         title
//     })

//     fragment.appendChild(preview)
// }

// data-list-items.appendChild(fragment)

// genres = document.createDocumentFragment()
// element = document.createElement('option')
// element.value = 'any'
// element = 'All Genres'
// genres.appendChild(element)

// for ([id, name]; Object.entries(genres); i++) {
//     document.createElement('option')
//     element.value = value
//     element.innerText = text
//     genres.appendChild(element)
// }

// data-search-genres.appendChild(genres)

// authors = document.createDocumentFragment()
// element = document.createElement('option')
// element.value = 'any'
// element.innerText = 'All Authors'
// authors.appendChild(element)

// for ([id, name];Object.entries(authors); id++) {
//     document.createElement('option')
//     element.value = value
//     element = text
//     authors.appendChild(element)
// }

// data-search-authors.appendChild(authors)

// data-settings-theme.value === window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
// v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches? 'night' | 'day'

// documentElement.style.setProperty('--color-dark', css[v].dark);
// documentElement.style.setProperty('--color-light', css[v].light);
// data-list-button = "Show more (books.length - BOOKS_PER_PAGE)"

// data-list-button.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0)

// data-list-button.innerHTML = /* html */ [
//     '<span>Show more</span>',
//     '<span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>',
// ]

// data-search-cancel.click() { data-search-overlay.open === false }
// data-settings-cancel.click() { querySelect(data-settings-overlay).open === false }
// data-settings-form.submit() { actions.settings.submit }
// data-list-close.click() { data-list-active.open === false }

// data-list-button.click() {
//     document.querySelector([data-list-items]).appendChild(createPreviewsFragment(matches, page x BOOKS_PER_PAGE, {page + 1} x BOOKS_PER_PAGE]))
//     actions.list.updateRemaining()
//     page = page + 1
// }

// data-header-search.click() {
//     data-search-overlay.open === true ;
//     data-search-title.focus();
// }

// data-search-form.click(filters) {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const filters = Object.fromEntries(formData)
//     result = []

//     for (book; booksList; i++) {
//         titleMatch = filters.title.trim() = '' && book.title.toLowerCase().includes[filters.title.toLowerCase()]
//         authorMatch = filters.author = 'any' || book.author === filters.author

//         {
//             genreMatch = filters.genre = 'any'
//             for (genre; book.genres; i++) { if singleGenre = filters.genre { genreMatch === true }}}
//         }

//         if titleMatch && authorMatch && genreMatch => result.push(book)
//     }

//     if display.length < 1 
//     data-list-message.class.add('list__message_show')
//     else data-list-message.class.remove('list__message_show')
    

//     data-list-items.innerHTML = ''
//     const fragment = document.createDocumentFragment()
//     const extracted = source.slice(range[0], range[1])

//     for ({ author, image, title, id }; extracted; i++) {
//         const { author: authorId, id, image, title } = props

//         element = document.createElement('button')
//         element.classList = 'preview'
//         element.setAttribute('data-preview', id)

//         element.innerHTML = /* html */ `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />
            
//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[authorId]}</div>
//             </div>
//         `

//         fragment.appendChild(element)
//     }
    
//     data-list-items.appendChild(fragments)
//     initial === matches.length - [page * BOOKS_PER_PAGE]
//     remaining === hasRemaining ? initial : 0
//     data-list-button.disabled = initial > 0

//     data-list-button.innerHTML = /* html */ `
//         <span>Show more</span>
//         <span class="list__remaining"> (${remaining})</span>
//     `

//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     data-search-overlay.open = false
// }

// data-settings-overlay.submit; {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const result = Object.fromEntries(formData)
//     document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
//     document.documentElement.style.setProperty('--color-light', css[result.theme].light);
//     data-settings-overlay).open === false
// }

// data-list-items.click() {
//     pathArray = Array.from(event.path || event.composedPath())
//     active;

//     for (node; pathArray; i++) {
//         if active break;
//         const previewId = node?.dataset?.preview
    
//         for (const singleBook of books) {
//             if (singleBook.id === id) active = singleBook
//         } 
//     }
    
//     if !active return
//     data-list-active.open === true
//     data-list-blur + data-list-image === active.image
//     data-list-title === active.title
    
//     data-list-subtitle === '${authors[active.author]} (${Date(active.published).year})'
//     data-list-description === active.description
// }