(function () {
//API url
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

//get element
const dataPanel = document.getElementById('data-panel')
const searchForm = document.getElementById('search')
const searchInput = document.getElementById('search-input')
const pagination =document.getElementById('pagination')
const modeSwitch = document.getElementById('mode-switch')

// params setting
const data = []
const ITEM_PER_PAGE = 12
let paginationData = []
let displayType = 'card'
let page = 1 // default page 1


//get data from API 
axios.get(INDEX_URL)
.then((response) => {
    data.push(...response.data.results)
    getTotalPages(data)
    getPageData(page, data)  
  })
.catch((err) => console.log(err))

// listen to data panel
dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.btn-show-movie')) {
    showMovie(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addFavoriteItem(event.target.dataset.id)
    console.log(event.target.dataset.id)
  } 
})

// listen to search form submit event
searchForm.addEventListener('submit', event => {
  let results = []
  event.preventDefault()
  const regex = new RegExp(searchInput.value, 'i')
  results = data.filter(movie => movie.title.match(regex))
  console.log(results)
  getTotalPages(results)
  getPageData(1, results)
})

// listen to pagination click event
pagination.addEventListener('click', event => {
  console.log(event.target.dataset.page)
  if (event.target.tagName === 'A') {
    page = event.target.dataset.page
    getPageData(event.target.dataset.page)
  }
})

// listen to modeSwitch click event
modeSwitch.addEventListener ('click', (event) => {
  if (event.target.tagName === 'I') {
    displayType = event.target.id
    getPageData(page,paginationData) 
  }
})


function displayDataList (data) {
    let htmlContent = ''
    if (displayType === 'card') {
    data.forEach(function (item, index) {
      htmlContent += ` 
      <div class="col-sm-3">
        <div class="card mb-2">
          <img class="card-img-top" src="${POSTER_URL}${item.image}" alt="Card image cap">
        <div class="card-body movie-item-body">
          <h6 class="card-title">${item.title}</h6>
        </div>

        <!-- "More" button -->
        <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button --> 
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
      `
    })
  }
  else if (displayType === 'list') {  
    data.forEach(function (item, index) {
    htmlContent += ` 
    <ul class="list-group list-group-flush col-12">
     <li class="list-group-item d-flex nowrap justify-content-between">
      <div class="col-6">
        <h6 class="card-title">${item.title}</h6>
      </div>
      <div class="col-2">
      <!-- "More" button -->
      <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
      <!-- favorite button --> 
      <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
      </div>
      </li>
    </ul>
    `
  })
  }
    dataPanel.innerHTML = htmlContent
}


function showMovie (id) {
  // get elements
  const modalTitle = document.getElementById('show-movie-title')
  const modalImage = document.getElementById('show-movie-image')
  const modalDate = document.getElementById('show-movie-date')
  const modalDescription = document.getElementById('show-movie-description')
  // set request url
  const url = INDEX_URL + id

  // send request to show api
  axios.get(url).then(response => {
    const data = response.data.results

  // insert data into modal ui
  modalTitle.textContent = data.title
  modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
  modalDate.textContent = `release at : ${data.release_date}`
  modalDescription.textContent = `${data.description}`
  })
}


function addFavoriteItem (id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = data.find(item => item.id === Number(id))

  if (list.some(item => item.id === Number(id))) {
    alert(`${movie.title} is already in your favorite list.`)
  } else {
    list.push(movie)
    alert(`Added ${movie.title} to your favorite list!`)
  }
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


function getTotalPages (data){
  let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
  let pageItemContent = ''
  for( let i=0; i < totalPages; i++) {
    pageItemContent += `
    <li class="page-item">
      <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
    </li>
    `
  }
  pagination.innerHTML = pageItemContent
}


function getPageData (pageNum, data) {
  paginationData = data || paginationData
  let offset = (pageNum - 1) * ITEM_PER_PAGE
  let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
  displayDataList(pageData)
  }

})()