// Default data
const defaultData = {
  name: '',
  summary: '',
  premiered: '',
  premiereDate: '',
  url: '',
  image: {
      original: ''
  },
  _embedded: {
      seasons: []
  }
}

// Get data
const getData = async () => {
  try {
    const dataResponse = await fetch('https://api.tvmaze.com/singlesearch/shows?q=aj-robibar&embed=seasons')
    if (dataResponse.ok) {
      const data = await dataResponse.json()
      return data
      // console.log(data)
      // return data ? data : defaultData
    } else if (dataResponse.status === 404) {
      alert('No show found!')
      return Promise.reject('No show found')
    } else {
      return Promise.reject(dataResponse.status)
    }
  } catch(err) {
    throw new Error(err)
  }
}


// Global varible to store show name
const globalObj = {}

// Function that saves values to a global object so that it can be used when
// there are any data missing in the api
const saveToGlobal = (name, summary, premiered, premiereDate, url, image) => {
	if (name) globalObj.name = name
	if (summary) globalObj.summary = summary
	if (premiered) globalObj.premiered = premiered
	if (premiereDate) globalObj.premiereDate = premiereDate
	if (url) globalObj.url = url
	if (image) globalObj.image = image
}

// Function that paints the card with appropriate information
const drawCard = (data) => {
	// Grab required variables from data object
	const { name, summary, premiered, premiereDate, url } = data
	const image = data.image ? data.image.original : null
	// If name is not present in data, use the global name instead
	saveToGlobal(name, summary, premiered, premiereDate, url, image)
  // Change the page title
  document.title = name ? name : globalObj.name
	// Paint the card
	document.querySelector('.card').innerHTML = `
		<img class="card-image" src="${image ? image : globalObj.image}" alt="${name ? name : globalObj.name}" />
		<h1 class="card-title">${name ? name : globalObj.name}</h1>
		${summary ? summary : globalObj.summary}
		<p class="card-premiere-date">
			Premiered <br />
			${premiered ? premiered : premiereDate}
		</p>
		<a class="card-readmore" href=${url ? url : globalObj.url} target="_blank">read more</a>
	`
}

// Function that paints the top navigation
const drawNav = (data) => {
  try {
    const { name } = data
    const { seasons } = data._embedded
    // Paint the navigation
    document.body.innerHTML = `
      <nav>
        <a class="brand logo" href="/">${name}</a>
        <ul>
          ${seasons.map(season => `
            <li>
              <a href="#" class="nav-link" data-season="${season.number}">
                S${season.number}
              </a>
            </li>
          `).join('')}
        </ul>
      </nav>
      <form id="search-form">
        <input type="text" placeholder="Your show name here" id="show-name" />
      </form>
      <div class="card"></div>
    `
  } catch (err) {
    throw new Error('No data found!')
  }
}

// Function that handles click event on top nav
const navLinkClickHandler = (links, data) => {
	links.forEach(link => {
		link.addEventListener('click', (event) => {
			event.preventDefault()
			const seasonsArr = data._embedded.seasons
			const season = parseInt(event.target.dataset.season, 10)
			drawCard(seasonsArr[season - 1])
		})
	})
}

// Run the file
const init = async () => {
	// Get data
	const data = await getData()
	// Draw the navigation
	drawNav(data)
	// Draw the card
	drawCard(data)
	// Handle click events on navigation
	navLinkClickHandler(document.querySelectorAll('.nav-link'), data)
  document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault()
    const showName = document.getElementById('show-name').value
    console.log(showName)
  })
}

init()